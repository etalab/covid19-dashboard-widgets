<template>

  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
    <LeftCol :data-display="display" :localisation="selectedGeoLabel" :date="currentDate" :value="currentValue" :name="name" :evolcode="evolcode" :evolvalue="evolvalue"></LeftCol>
    <div class="r_col fr-col-12 fr-col-md-8 fr-col-lg-9">
      <div class="chart fr-ml-0 fr-ml-md-3w">
        <canvas :id="chartId"></canvas>
      </div>
      <div class="unit_container">
        <div class="legende_dot"></div>
        <span class="fr-text--sm fr-text--bold fr-ml-1v">{{capitalize(unit)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Chart from 'chart.js'
import LeftCol from '@/components/LeftCol' 
export default {
  name: 'BarChart',
  components: {
    LeftCol
  },
  data(){
    return {
      indicateur_data : undefined,
      labels:[],
      dataset:[],
      widgetId:"",
      chartId:"",
      display:"",
      localisation:"",
      currentValue:"",
      currentDate:"",
      name:"",
      unit:"",
      evolcode:"",
      evolvalue:"",
      chart:undefined,
      loading:true
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
    selectedGeoLabel () {
      return store.state.user.selectedGeoLabel
    },

  },
  methods: {

    async getData () {
      var url = "https://data.widgets.dashboard.covid19.data.gouv.fr/"+this.indicateur+".json"
      const dataRequest = await fetch(url)
      const data = await dataRequest.json()
      this.indicateur_data = data
      this.loading = false
      this.createChart()
    },

    updateData () {

      var self = this
      
      var geolevel = this.selectedGeoLevel
      var geocode = this.selectedGeoCode

      var geoObject

      if(geolevel === "France"){
        geoObject = this.indicateur_data["france"][0]
      }else{
        geoObject = this.indicateur_data[geolevel].find(obj => {
          return obj["code_level"] === geocode
        })  
      }      

      this.name = this.indicateur_data["nom"]
      this.unit = this.indicateur_data["unite"]
      this.currentValue = geoObject["last_value"]
      this.currentDate = this.convertDateToHuman(geoObject["last_date"])
      this.evolcode = geoObject["evol_color"]
      this.evolvalue = geoObject["evol_percentage"]

      this.labels.length = 0
      this.dataset.length = 0

      geoObject["values"].forEach(function(d){
        self.labels.push(self.convertDateToHuman(d["date"]))
        self.dataset.push((d["value"]))
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

      this.chart = new Chart(ctx, {
          data: {
              labels: self.labels,
              datasets: [{
                data: self.dataset,
                backgroundColor:"#000091",
                borderColor:"#000091",
                type:'bar',
                borderWidth:4
              }]
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
                return int+" "+self.unit
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
      this.updateData()
    },
    selectedGeoLevel:function(){
      this.updateData()
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
        }
      }
    }

    .chart canvas {
      max-width:100%;
    }

  }
  
</style>
