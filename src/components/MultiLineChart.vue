<template>

  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
    <MultiLeftCol :data-display="display" :localisation="selectedGeoLabel" :date="currentDate" :values="currentValues" :names="names" :evolcodes="evolcodes" :evolvalues="evolvalues"></MultiLeftCol>
    <div class="r_col fr-col-12 fr-col-md-8 fr-col-lg-9">
      <div class="chart fr-ml-0 fr-ml-md-3w">
        <canvas :id="chartId"></canvas>
      </div>
      <div class="unit_container">
        <div class="multi_unit">
          <div class="legende_dot"></div>
          <span class="fr-text--sm fr-text--bold fr-ml-1v">{{capitalize(units[0])}}</span>
        </div>
        <div class="multi_unit">
          <div class="legende_dot" data-serie="2"></div>
          <span class="fr-text--sm fr-text--bold fr-ml-1v">{{capitalize(units[1])}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Chart from 'chart.js'
import MultiLeftCol from '@/components/MultiLeftCol' 
export default {
  name: 'MultiLineChart',
  components: {
    MultiLeftCol
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
      loading:true
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

  },
  methods: {

    async getData () {
      var url = "https://data.widgets.dashboard.covid19.data.gouv.fr/"+this.indicateur1+".json"
      const dataRequest = await fetch(url)
      const data = await dataRequest.json()
      this.indicateur_data = data

      var url2 = "https://data.widgets.dashboard.covid19.data.gouv.fr/"+this.indicateur2+".json"
      const dataRequest2 = await fetch(url2)
      const data2 = await dataRequest2.json()
      this.indicateur_data2 = data2

      this.loading = false
      this.createChart()
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
      this.display=== 'big' ? xTickLimit = 5 : xTickLimit = 1
      
      var ctx = document.getElementById(self.chartId).getContext('2d')

      var gradientFill

      this.display=== 'big' ? gradientFill = ctx.createLinearGradient(0, 0, 0, 500) : gradientFill = ctx.createLinearGradient(0, 0, 0, 250)

      gradientFill.addColorStop(0, "rgba(218, 218, 254, 0.6)")
      gradientFill.addColorStop(0.6, "rgba(245, 245, 255, 0)")

      var gradientFill2
      
      this.display=== 'big' ? gradientFill2 = ctx.createLinearGradient(0, 0, 0, 350) : gradientFill2 = ctx.createLinearGradient(0, 0, 0, 225)

      gradientFill2.addColorStop(0, "rgba(223, 0, 27, 0.6)")
      gradientFill2.addColorStop(0.6, "rgba(223, 0, 27, 0)")

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
                  borderColor:"#df001b",
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
                    return value.toString().substring(0,5);
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
                }   
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
                var int = self.convertStringToLocaleNumber(tooltipItems["value"])
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
      console.log(this.chart)
    },

    convertStringToLocaleNumber(string){
      return parseInt(string).toLocaleString()
    },

    convertDateToHuman(string){
      let date = new Date(string)
      return date.toLocaleDateString()
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

    .r_col {
      align-self:center;
      .unit_container{
        margin-top: 15px;
        text-align: left;
        padding-left: 65px;
        .legende_dot{
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #000091;
          display: inline-block;
          transform:translate(0,3px);
          &[data-serie="2"]{
            background-color: #df001b;
          }
        }
      }
    }

    .chart canvas {
      max-width:100%;
    }

  }
  
</style>
