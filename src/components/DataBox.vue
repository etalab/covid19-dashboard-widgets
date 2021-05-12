<template>

  <div class="data_box fr-p-3w" :data-display="display" :id="widgetId" v-bind:class="{'green':isGreen,'red':isRed, 'loading':loading}">

    <p class="l_box_title fr-text--xs fr-mb-0">Mise à jour : {{currentDate}}</p>
    <p class="fr-text--sm fr-text--bold fr-my-1w">{{name}}</p>
    <div class="evol_box fr-text--sm fr-text--bold fr-py-1v fr-px-1w fr-mb-1w" :evolcode="evolcode" :evolvalue="evolvalue" v-bind:class="{'down':isDown,'green':isGreen,'red':isRed,'blue':isBlue}" v-if="(!testIfNaN(evolvalue))">
      <svg class="trend_ico" width="24" height="24" viewBox="0 0 24 24">
        <path v-if="!isBlue" d="M19.071 4.929c3.903 3.903 3.903 10.239 0 14.142-3.903 3.903-10.239 3.903-14.142 0-3.903-3.903-3.903-10.239 0-14.142 3.903-3.903 10.239-3.903 14.142 0zm-2.828 2.828H7.757l3.182 3.182-4.242 4.243 2.121 2.121 4.243-4.242 3.182 3.182V7.757z" transform="translate(-902 -5664) translate(902 5664)"/>
        <path v-if="isBlue" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm4 11H8v2h8v-2zm0-4H8v2h8V9z" transform="translate(-1366 -5645) translate(1366 5645)"/>
      </svg>
      <span class="fr-ml-1v">{{convertFloatToHuman(evolvalue)}} % en 7 jours</span>
    </div>
    <p class="fr-text--xs fr-mb-0"><span v-if="(!testIfNaN(evolvalue))">soit</span> <span class="fr-text--bold">{{convertNumberToHuman(currentValue)}} {{unit}}</span></p>
  </div>

</template>

<script>
import store from '@/store'
export default {
  name: 'DataBox',
  components: {
    
  },
  data(){
    return {
      display:"",
      indicateur_data:undefined,
      currentValue:"",
      currentDate:"",
      name:"",
      unit:"",
      evolcode:"",
      evolvalue:"",
      isDown:false,
      isGreen:false,
      isRed:false,
      isBlue:false,
      loading:true,
      inViewport:false,
    }
  },
  props: {
    indicateur: String,
  },
  computed: {
    selectedGeoLevel () {
      return store.state.user.selectedGeoLevel
    },
    selectedGeoCode () {
      return store.state.user.selectedGeoCode
    },
  },
  methods: {

    isInViewport(){
      var response
      var rect = document.getElementById(this.widgetId).getBoundingClientRect();
      rect.top < document.documentElement.clientHeight ? response = true : response = false
      this.inViewport = response
    },

    handleScroll(){
      this.isInViewport()
      if(this.inViewport&&this.loading){ this.getData() }
    },

    async getData () {
      var url = "https://data.widgets.dashboard.covid19.data.gouv.fr/"+this.indicateur+"_short.json"
      const dataRequest = await fetch(url)
      const data = await dataRequest.json()
      this.indicateur_data = data
      this.loading = false
      this.updateData()
    },

    convertStringToLocaleNumber(string){
      return parseInt(string).toLocaleString()
    },

    convertDateToHuman(string){
      let date = new Date(string)
      return date.toLocaleDateString()
    },

    convertNumberToHuman(float){
      return parseFloat(float).toLocaleString()
    },

    convertFloatToHuman(float){
      return parseFloat(float).toFixed(1).toLocaleString()
    },

    testIfNaN(float){
      return isNaN(parseFloat(float))
    },

    testEvolStyle(){
      if(this.evolcode=="green"){
        this.isGreen = true
        this.isRed = false
        this.isBlue = false
        this.evolvalue > 0 ? this.isDown = false : this.isDown = true
      }else if(this.evolcode=="red"){
        this.isGreen = false
        this.isRed = true
        this.isBlue = false
        this.evolvalue > 0 ? this.isDown = false : this.isDown = true
      }else{
        this.isGreen = false
        this.isRed = false
        this.isBlue = true
        this.isDown = false
      }

    },

    updateData () {
      var geolevel = this.selectedGeoLevel
      var geocode = this.selectedGeoCode

      var geoObject

      if(geolevel === "France"){
        geoObject = this.indicateur_data["france"][0]
        this.localisation = "France entière"
      }else{
        this.localisation = geocode

        geoObject = this.indicateur_data[geolevel].find(obj => {
          return obj["code_level"] === geocode
        })  
      }      
      
      this.name = this.indicateur_data["nom"]
      this.unit = this.indicateur_data["unite"]
      this.currentValue = this.indicateur_data["france"][0]["last_value"]
      this.currentValue = geoObject["last_value"]
      this.currentDate = this.convertDateToHuman(geoObject["last_date"])
      this.evolcode = geoObject["evol_color"]
      this.evolvalue = geoObject["evol_percentage"]
    }

  },

  watch:{
    selectedGeoCode:function(){
      this.updateData()
    },
    selectedGeoLevel:function(){
      this.updateData()
    },
    evolcode:function(){
      this.testEvolStyle()
    },
    evolvalue:function(){
      this.testEvolStyle()
    },
  },

  created(){
    this.widgetId = "widget"+Math.floor(Math.random() * (1000));
    window.addEventListener('scroll', this.handleScroll);
  },

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },

  mounted(){
    var self = this
    document.getElementById(this.widgetId).offsetWidth > 486 ? this.display='big' : this.display='small'
    setTimeout(function(){
      self.isInViewport()
      if(self.inViewport){ self.getData() }
    },100)
    // 502px to break
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access 
  @import "../../css/overload-fonts.css";
  @import "../../css/dsfr.min.css";
  */

  .data_box{
    background-color: white;
    box-shadow: 0 1px 8px 1px rgba(22, 22, 22, 0.04), 0 2px 8px -4px rgba(22, 22, 22, 0.04);
    height: 100%;

    .l_box_title{
      color: #6b6b6b;
    }

    &.green{
      border-bottom: 5px solid #007c3a;
    }
    &.red{
      border-bottom: 5px solid #d80600;
    }

    .evol_box{
      display: inline-flex;
      align-items: center;

      &.down{
        .trend_ico{
          transform: rotate(90deg);
        }
      }
      &.green{
        color:#007c3a;
        background-color: #d9ffeb;
        .trend_ico{
          path{
            fill:#357941;
          }
        }
      }
      &.red{
        color:#d80600;
        background-color: #fff4f3;
        .trend_ico{
          path{
            fill:#d80600;
          }
        }
      }
      &.blue{
        color:#0768d5;
        background-color: #f0f7ff;
        .trend_ico{
          path{
            fill:#0768d5;
          }
        }
      }
    }
  }
  
</style>
