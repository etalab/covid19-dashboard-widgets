<template>

  <div class="widget_container fr-grid-row" :data-display="display" :id="widgetId">
    <LeftCol :data-display="display" :date="currentDate" :value="currentValue" :unit="unit" :name="name" :evolcode="evolcode" :evolvalue="evolvalue"></LeftCol>
    <div class="r_col fr-col-12 fr-col-md-8 fr-col-lg-9">
      <div class="chart fr-ml-0 fr-ml-md-3w">
        <canvas :id="chartId"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Chart from 'chart.js'
import LeftCol from '@/components/LeftCol' 
export default {
  name: 'LineChart',
  components: {
    LeftCol
  },
  data(){
    return {
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
      evolvalue:""
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
    selectedGeoLabel () {
      return store.state.user.selectedGeoLabel
    },

  },
  methods: {

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
      this.currentValue = geoObject["last_value"]
      this.currentDate = this.convertDateToHuman(geoObject["last_date"])
      this.evolcode = geoObject["evol_color"]
      this.evolvalue = geoObject["evol_percentage"]

      this.labels = []
      this.dataset = []

      geoObject["values"].forEach(function(d){
        self.labels.push(self.convertDateToHuman(d["date"]))
        self.dataset.push((d["value"]))
      })

      this.createChart()

    },

    createChart () {
      var self = this
      
      var xTickLimit
      this.display=== 'big' ? xTickLimit = 5 : xTickLimit = 1
      
      var ctx = document.getElementById(self.chartId).getContext('2d')

      var gradientFill
      this.display=== 'big' ? gradientFill = ctx.createLinearGradient(0, 0, 0, 500) : gradientFill = ctx.createLinearGradient(0, 0, 0, 250)

      gradientFill.addColorStop(0, "rgba(218, 218, 254, 0.6)")
      gradientFill.addColorStop(0.6, "rgba(245, 245, 255, 0)")

      this.chart = new Chart(ctx, {
          data: {
              labels: self.labels,
              datasets: [{
                data: self.dataset,
                backgroundColor:gradientFill,
                borderColor:"#000091",
                type:'line',
                pointRadius:0
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
            callbacks: {
              label: function(tooltipItems) { 
                var int = self.convertStringToLocaleNumber(tooltipItems["value"])
                return int+" "+self.unit
              },
              title: function(tooltipItems) { 
                return tooltipItems[0]["label"]
              }
            }
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
    }
  },

  created(){
    this.chartId = "myChart"+Math.floor(Math.random() * (1000));
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

  .widget_container{

    .r_col {
      align-self:center;
    }

    .chart canvas {
      max-width:100%;
    }

  }
  
</style>
