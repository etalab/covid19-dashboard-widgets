<template>

  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
      <div class="fr-warning" v-if="geoFallback">
        <div class="scheme-border">
            <span class="fr-fi-information-fill fr-px-1w fr-py-3v" aria-hidden="true"></span>
        </div>
        <p class="fr-text--sm fr-mb-0 fr-p-3v">{{geoFallbackMsg}}
        </p>
    </div>
    <LeftCol :props="leftColProps"></LeftCol>
    <div class="r_col fr-col-12 fr-col-lg-9">
      <div class="chart ml-lg">
        <canvas :id="chartId"></canvas>
        <div class="flex fr-mt-3v" :style="style">
          <span class="legende_dot"></span>
          <p class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{capitalize(units[0])}}</p>
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
  name: 'LineChart',
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
      leftColProps:{
        localisation:"",
        currentValues:[],
        currentDate:"",
        names:[],
        evolcodes:[],
        evolvalues:[],
        isMap:false
      },
      units:[],
      chart:undefined,
      loading:true,
      legendLeftMargin: 0,
      geoFallback:false,
      geoFallbackMsg:"",
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
    style () {
      return 'margin-left: ' + this.legendLeftMargin + 'px';
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

      this.leftColProps["localisation"] = this.selectedGeoLabel

      var geoObject

      geoObject = this.getGeoObject(geolevel,geocode)

      if(typeof geoObject === 'undefined'){
        if(geolevel == 'regions'){
          geoObject = this.getGeoObject("France","01")
          this.leftColProps["localisation"] = "France entière"
          this.geoFallback=true
          this.geoFallbackMsg="Affichage des résultats au niveau national, faute de données au niveau régional"
        }else{
          var depObj = store.state.dep.find(obj => {
            return obj["value"] === geocode
          })
          geoObject = this.getGeoObject("regions",depObj["region_value"])
          this.leftColProps["localisation"] = depObj["region"]
          this.geoFallback=true
          this.geoFallbackMsg="Affichage des résultats au niveau régional, faute de données au niveau départemental"
          if(typeof geoObject === 'undefined'){
            geoObject = this.getGeoObject("France","01")
            this.leftColProps["localisation"] = "France entière"
            this.geoFallback=true
            this.geoFallbackMsg="Affichage des résultats au niveau national, faute de données au niveau régional ou départemental"
          }
        }
      }

      this.leftColProps['names'].length = 0
      this.units.length = 0
      this.leftColProps['currentValues'].length = 0
      this.leftColProps['evolcodes'].length = 0
      this.leftColProps['evolvalues'].length = 0

      this.leftColProps['names'].push(this.indicateur_data["nom"])
      this.units.push(this.indicateur_data["unite"])
      this.leftColProps['currentValues'].push(geoObject["last_value"])
      this.leftColProps['currentDate'] = this.convertDateToHuman(geoObject["last_date"])
      this.leftColProps['evolcodes'].push(geoObject["evol_color"])
      this.leftColProps['evolvalues'].push(geoObject["evol_percentage"])

      this.labels.length = 0
      this.dataset.length = 0

      geoObject["values"].forEach(function(d){
        self.labels.push(self.convertDateToHuman(d["date"]))
        self.dataset.push((d["value"]))
      })

    },

    getGeoObject(geolevel,geocode){

      var geoObject
      if(geolevel === "France"){
        geoObject = this.indicateur_data["france"][0]
      }else{
        geoObject = this.indicateur_data[geolevel].find(obj => {
          return obj["code_level"] === geocode
        })
      }
      return geoObject
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

      this.chart = new Chart(ctx, {
          data: {
              labels: self.labels,
              datasets: [{
                data: self.dataset,
                backgroundColor:gradientFill,
                borderColor:"#000091",
                type:'line',
                pointRadius:8,
                pointBackgroundColor:"rgba(0, 0, 0, 0)",
                pointBorderColor:"rgba(0, 0, 0, 0)",
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
                return int+" "+self.units[0]
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

    convertFloatToHuman(float){
      if(Number.isInteger(parseFloat(float))){
        return parseInt(float).toLocaleString()  
      }else{
        return parseFloat(float).toFixed(1).toLocaleString()
      }
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
  }

}
</script>

<style scoped lang="scss">

  .widget_container{
    .fr-warning {
      display: flex;
      min-width: 100%;
      margin: 0 0 0.75rem;
      background-color: var(--w);
      width: 100%;
      .scheme-border {
          min-width: 2.5rem;
          background-color: #0768d5;
          display: flex;
          justify-content: center;
      }
      span {
          display: block;
          color: var(--w);
      }
      p {
          border: solid 1px #0768d5;
          width: 100%;

      }
    }
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
          min-width: 1rem;
          border-radius: 50%;
          background-color: #000091;
          display: inline-block;
          margin-top: 0.25rem;
        }
      }
    }

    .chart canvas {
      max-width:100%;
    }

  }

</style>
