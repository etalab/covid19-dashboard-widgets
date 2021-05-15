<template>

  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
    <LeftCol :data-display="display" :localisation="selectedGeoLabel" :date="currentDate" :values="currentValues" :names="names" :evolcodes="evolcodes" :evolvalues="evolvalues"></LeftCol>
    <div class="r_col fr-col-12 fr-col-lg-9">
      <div class="sep fr-my-4w fr-my-md-3w"></div>
      <div class="chart ml-lg">
        <canvas :id="chartId"></canvas>
      </div>
      <div class="flex fr-mt-3v ml-lg">
        <span class="legende_dot"></span>
        <p class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{capitalize(units[0])}}</p>
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
      indicateur_data:undefined,
      labels:[],
      dataset:[],
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
      store.dispatch('getData', this.indicateur).then(data => {
        this.indicateur_data = data
        this.loading = false
        this.createChart()
      })
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

      this.names.length = 0
      this.units.length = 0
      this.currentValues.length = 0
      this.evolcodes.length = 0
      this.evolvalues.length = 0      

      this.names.push(this.indicateur_data["nom"])
      this.units.push(this.indicateur_data["unite"])
      this.currentValues.push(geoObject["last_value"])
      this.currentDate = this.convertDateToHuman(geoObject["last_date"])
      this.evolcodes.push(geoObject["evol_color"])
      this.evolvalues.push(geoObject["evol_percentage"])

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
      this.display=== 'big' ? xTickLimit = 6 : xTickLimit = 1
      
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
    .sep {
      border-bottom:1px solid #E5E5E5;
    }
    .ml-lg {
      margin-left:0;
    }
    @media (min-width: 62em) {
      .sep {
        display: none;
      }
      .ml-lg {
        margin-left:3rem;
      }
    }
    .r_col {
      align-self:center;
      .flex{
        display: flex;
        align-items: center;
        .legende_dot{
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-color: #000091;
          display: inline-block;
        }
      }
    }

    .chart canvas {
      max-width:100%;
    }

  }
  
</style>
