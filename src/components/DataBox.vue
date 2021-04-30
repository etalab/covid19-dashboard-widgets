<template>

  <div class="data_box fr-p-3w" :data-display="display" :id="widgetId" v-bind:class="{'green':isGreen,'red':isRed, 'loaded':loaded}">

    <p class="l_box_title fr-text--xs fr-mb-0">Mise à jour : {{currentDate}}</p>
    <p class="fr-text--sm fr-text--bold fr-my-1w">{{name}}</p>
    <div class="evol_box fr-text--sm fr-text--bold fr-py-1v fr-px-1w fr-mb-1w" :evolcode="evolcode" :evolvalue="evolvalue" v-bind:class="{'down':isDown,'green':isGreen,'red':isRed}">
      <svg class="trend_ico" width="20" height="20" viewBox="0 0 16 16"><path d="M12.714 3.286c2.602 2.602 2.602 6.826 0 9.428-2.602 2.602-6.826 2.602-9.428 0-2.602-2.602-2.602-6.826 0-9.428 2.602-2.602 6.826-2.602 9.428 0zm-1.886 1.886H5.172l2.12 2.12-2.828 2.83 1.415 1.414 2.828-2.829 2.121 2.121V5.172z" transform="translate(-663 -5576) translate(527 5237) translate(1 225) translate(135 114)"/></svg>
      <span class="fr-ml-1v">{{convertNumberToHuman(evolvalue)}} % en 7j</span>
    </div>
    <p class="fr-text--xs fr-mb-0">soit <span class="fr-text--bold">{{convertNumberToHuman(currentValue)}} {{unit}}</span></p>
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
      currentValue:"",
      currentDate:"",
      name:"",
      unit:"",
      evolcode:"",
      evolvalue:"",
      isDown:false,
      isGreen:false,
      isRed:false,
      loaded:false
    }
  },
  props: {
    indicateur: String,
  },
  computed: {
    dataImport() {
      return store.state.endImport
    },
    selectedGeoLevel () {
      return store.state.user.selectedGeoLevel
    },
    selectedGeoCode () {
      return store.state.user.selectedGeoCode
    },
  },
  methods: {

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

    testEvolStyle(){
      if(this.evolcode=="green"){
        this.isGreen = true
        this.isRed = false
      }else{
        this.isGreen = false
        this.isRed = true
      }

      this.evolvalue > 0 ? this.isDown = false : this.isDown = true

    },

    updateData () {
      var self = this

      var geolevel = this.selectedGeoLevel
      var geocode = this.selectedGeoCode

      var geoObject

      if(geolevel === "France"){
        geoObject = store.state.data[self.indicateur]["france"][0]
        this.localisation = "France entière"
      }else{
        this.localisation = geocode

        geoObject = store.state.data[self.indicateur][geolevel].find(obj => {
          return obj["code_level"] === geocode
        })  
      }      
      
      this.name = store.state.data[self.indicateur]["nom"]
      this.unit = store.state.data[self.indicateur]["unite"]
      this.currentValue = store.state.data[self.indicateur]["france"][0]["last_value"]
      this.currentValue = geoObject["last_value"]
      this.currentDate = this.convertDateToHuman(geoObject["last_date"])
      this.evolcode = geoObject["evol_color"]
      this.evolvalue = geoObject["evol_percentage"]
    }
    
  },

  watch:{
    dataImport:function(){
      this.updateData()
      this.loaded = true
    },
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
  },

  mounted(){
    document.getElementById(this.widgetId).offsetWidth > 486 ? this.display='big' : this.display='small'
    // 502px to break
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";
  @import "../../css/dsfr.min.css";

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
    }
  }
  
</style>
