<template>

  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
    <LeftCol :data-display="display" :localisation="selectedGeoLabel" :date="currentDate" :values="currentValues" :names="names" :evolcodes="evolcodes" :evolvalues="evolvalues"></LeftCol>
    <div class="r_col fr-col-12 fr-col-lg-9">
      <div class="chart ml-lg">
        <canvas :id="chartId"></canvas>
        <div class="flex fr-mt-3v fr-mb-1v" :style="style">
          <span class="legende_dot"></span>
          <p class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{capitalize(units[0])}}</p>
        </div>
        <div class="flex" :style="style">
          <span class="legende_dot" data-serie="2"></span>
          <p class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{capitalize(units[1])}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Chart from 'chart.js'
import LeftCol from '@/components/LeftCol' 
export default {
  name: 'MultiLineChart',
  components: {
    LeftCol
  },
  data(){
    return {
      indicateur_data:undefined,
      indicateur_data2:undefined,
      labels:[],
      dataset:[],
      dataset2:[],
      widgetId:"",
      chartId:"",
      display:"",
      localisation:"",
      currentValues:[],
      currentDate:"",
      names:[],
      units:[],
      evolcodes:[],
      evolvalues:[],
      chart:undefined,
      loading:true,
      legendLeftMargin: 0,
      map:false
    }
  },
  props: {
    indicateur1: String,
    indicateur2: String
  },
  computed: {
    selectedGeoLevel () {
      return store.state.user.selectedGeoLevel
    },
    selectedGeoCode () {
      return store.state.user.selectedGeoCode
    },
    selectedGeoLabel () {
      return store.state.user.selectedGeoLabel
    },
    style () {
      return 'margin-left: ' + this.legendLeftMargin + 'px';
    },

  },
  methods: {

    async getData () {

      const promise1 = store.dispatch('getData', this.indicateur1).then(data => {
        this.indicateur_data = data
      })

      const promise2 = store.dispatch('getData', this.indicateur2).then(data => {
        this.indicateur_data2 = data
      })

      Promise.all([promise1, promise2]).then((values) => {
        this.loading = false
        this.createChart()
      });

    },

    updateData () {

      var self = this
      
      var geolevel = this.selectedGeoLevel
      var geocode = this.selectedGeoCode

      var geoObject
      var geoObject2

      if(geolevel === "France"){
        geoObject = this.indicateur_data["france"][0]
        geoObject2 = this.indicateur_data2["france"][0]
      }else{
        geoObject = this.indicateur_data[geolevel].find(obj => {
          return obj["code_level"] === geocode
        })
        geoObject2 = this.indicateur_data2[geolevel].find(obj => {
          return obj["code_level"] === geocode
        })

      }

      this.names.length = 0
      this.units.length = 0
      this.currentValues.length = 0
      this.evolcodes.length = 0
      this.evolvalues.length = 0      

      this.names.push(this.indicateur_data["nom"],this.indicateur_data2["nom"])
      this.units.push(this.indicateur_data["unite"],this.indicateur_data2["unite"])
      this.currentValues.push(geoObject["last_value"],geoObject2["last_value"])
      this.currentDate = this.convertDateToHuman(geoObject["last_date"])
      this.evolcodes.push(geoObject["evol_color"],geoObject2["evol_color"])
      this.evolvalues.push(geoObject["evol_percentage"],geoObject2["evol_percentage"])

      this.labels.length = 0
      this.dataset.length = 0
      this.dataset2.length = 0

      geoObject["values"].forEach(function(d){
        
        self.labels.push(self.convertDateToHuman(d["date"]))
        self.dataset.push((d["value"]))

        var corresponding_value = geoObject2["values"].find(obj => {
          return obj["date"] === d["date"]
        })

        self.dataset2.push(corresponding_value["value"])

      })

    },

    updateChart () {
      
      this.updateData()
      this.chart.update()
    
    },

    createChart () {
      var self = this
    
      this.updateData()
      
      var xTickLimit
      this.display=== 'big' ? xTickLimit = 6 : xTickLimit = 1
      
      var ctx = document.getElementById(self.chartId).getContext('2d')

      var gradientFill

      this.display=== 'big' ? gradientFill = ctx.createLinearGradient(0, 0, 0, 500) : gradientFill = ctx.createLinearGradient(0, 0, 0, 250)

      gradientFill.addColorStop(0, "rgba(218, 218, 254, 0.6)")
      gradientFill.addColorStop(0.6, "rgba(245, 245, 255, 0)")

      var gradientFill2
      
      this.display=== 'big' ? gradientFill2 = ctx.createLinearGradient(0, 0, 0, 350) : gradientFill2 = ctx.createLinearGradient(0, 0, 0, 225)

      gradientFill2.addColorStop(0, "rgba(0, 124, 58, 0.6)")
      gradientFill2.addColorStop(0.6, "rgba(0, 124, 58, 0)")

      this.chart = new Chart(ctx, {
          data: {
              labels: self.labels,
              datasets: [
                {
                  data: self.dataset,
                  backgroundColor:gradientFill,
                  borderColor:"#000091",
                  type:'line',
                  pointRadius:8,
                  pointBackgroundColor:"rgba(0, 0, 0, 0)",
                  pointBorderColor:"rgba(0, 0, 0, 0)",
                },
                {
                  data: self.dataset2,
                  backgroundColor:gradientFill2,
                  borderColor:"#007c3a",
                  type:'line',
                  pointRadius:8,
                  pointBackgroundColor:"rgba(0, 0, 0, 0)",
                  pointBorderColor:"rgba(0, 0, 0, 0)",
                }
              ]
          },
          options: {
            animation: {
              easing: "easeInOutBack"
            },
            scales: {
              xAxes: [{
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: xTickLimit,
                  maxRotation: 0,
                  minRotation: 0,
                  callback: function(value) {
                    return value.toString().substring(3,5)+"/"+value.toString().substring(8,10)
                  }
                },
              }],
              yAxes: [{
                gridLines: {
                  color: "#e5e5e5",
                  borderDash:[3]
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 5
                },
                afterFit: function(axis) {
                  self.legendLeftMargin = axis.width;
                },
            }]
          },
          legend: {
              display: false
          },
          tooltips:{
            displayColors:false,
            backgroundColor:"#6b6b6b",
            callbacks: {
              label: function(tooltipItems) { 
                var int = self.convertFloatToHuman(tooltipItems["value"])
                return int+" "+self.units[tooltipItems["datasetIndex"]]
              },
              title: function(tooltipItems) { 
                return tooltipItems[0]["label"]
              },
              labelTextColor: function(){
                return "#eeeeee"
              }
            },
          }
        }
      });
    },

    convertStringToLocaleNumber(string){
      return parseInt(string).toLocaleString()
    },

    convertDateToHuman(string){
      let date = new Date(string)
      return date.toLocaleDateString()
    },

    convertFloatToHuman(float){
      if(Number.isInteger(parseFloat(float))){
        return parseInt(float).toLocaleString()  
      }else{
        return parseFloat(float).toFixed(1).toLocaleString()
      }
    },

    capitalize(string){
      if(string){
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
    }
  
  },

  watch:{
    selectedGeoCode:function(){
      this.updateChart()
    },
    selectedGeoLevel:function(){
      this.updateChart()
    }
  },

  created(){
    this.chartId = "myChart"+Math.floor(Math.random() * (1000));
    this.widgetId = "widget"+Math.floor(Math.random() * (1000));
    this.getData()
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



  .widget_container{
    .ml-lg {
      margin-left:0;
    }
    @media (min-width: 62em) {
      .ml-lg {
        margin-left:3rem;
      }
    }
    @media (max-width: 62em) {
      .chart .flex {
        margin-left:0!important
      }
    }
    .r_col {
      align-self:center;
      .flex{
        display: flex;
        .legende_dot{
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-color: #000091;
          display: inline-block;
          margin-top: 0.25rem;
          &[data-serie="2"]{
            background-color: #007c3a;
          }
        }
      }
    }

    .chart canvas {
      max-width:100%;
    }

  }
  
</style>
