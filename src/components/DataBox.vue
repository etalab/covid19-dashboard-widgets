<template>

  <div class="data_box" :data-display="display" :id="widgetId" v-bind:class="{'green':isGreen,'red':isRed}">

    <span class="date">Mise à jour : {{currentDate}}</span>
    <span class="name">{{name}}</span>
    <div class="evol_box" :evolcode="evolcode" :evolvalue="evolvalue" v-bind:class="{'down':isDown,'green':isGreen,'red':isRed}">
      <svg class="trend_ico" width="16" height="16" viewBox="0 0 16 16"><path d="M12.714 3.286c2.602 2.602 2.602 6.826 0 9.428-2.602 2.602-6.826 2.602-9.428 0-2.602-2.602-2.602-6.826 0-9.428 2.602-2.602 6.826-2.602 9.428 0zm-1.886 1.886H5.172l2.12 2.12-2.828 2.83 1.415 1.414 2.828-2.829 2.121 2.121V5.172z" transform="translate(-663 -5576) translate(527 5237) translate(1 225) translate(135 114)"/></svg>
      {{convertNumberToHuman(evolvalue)}} % en 7j
    </div>
    <span class="number">soit <span class="inner_number">{{convertNumberToHuman(currentValue)}} {{unit}}</span></span>
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

  .data_box{
    width: 248px;
    height: 220px;
    background-color: white;
    margin:0;
    padding:24px 24px 0 24px;
    box-sizing: border-box;
    &.green{
      border-bottom: 5px solid #357941;
    }
    &.red{
      border-bottom: 5px solid #d80600;
    }
    .date{
      font-family: "Marianne";
      font-size:12px;
      line-height: 1.67;
      color: #6b6b6b;
      display: block;
      margin-bottom: 10px;
    }
    .name{
      font-family: "Marianne";
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      color: #242424;
      margin-bottom: 10px;
      display: block;
    }
    .evol_box{
      display: inline-block;
      font-family: "Marianne";
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      padding:0 8px 0 8px;
      box-sizing: border-box;
      margin-top: 8px;
      margin-bottom: 8px;
      .trend_ico{
        position: relative;
        transform:translate(0,2px);
        margin-right: 2px;
      }
      &.down{
        .trend_ico{
          transform:translate(0,2px) rotate(90deg);
        }
      }
      &.green{
        color:#357941;
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
    .number{
      display: block;
      font-family: Marianne;
      font-size: 12px;
      color: #6b6b6b;
      .inner_number{
        font-size: 12px;
        font-weight: bold;
      }
    }
    &[data-display="small"]{
      width: 288px;
      height: 196px;
      .evol_box{
        margin-top: 0px;
      }
    }
  }
  
</style>
