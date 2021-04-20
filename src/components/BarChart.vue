<template>

  <div class="widget_container" :data-display="display" :id="widgetId">
    <LeftCol :data-display="display" :date="currentDate" :value="currentValue" :unit="unit" :name="name"></LeftCol>
    <div class="r_col">
      <div class="chart">
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
      currentValue:"",
      currentDate:"",
      name:"Taux d'incidence",
      unit:"Incidence pour 100 000 habitants"
    }
  },
  props: {
    indicateur: String,
  },
  computed: {
    dataImport() {
      return store.state.endImport
    },
  },
  methods: {

    createChart () {
      var self = this
      
      var xTickLimit
      this.display=== 'big' ? xTickLimit = 5 : xTickLimit = 1
      
      var ctx = document.getElementById(self.chartId).getContext('2d')

      var chart = new Chart(ctx, {
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
      console.log(chart)
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

      var self = this

      this.currentValue = Object.entries(store.state.data)[Object.entries(store.state.data).length-2][1][self.indicateur]

      this.currentDate = this.convertDateToHuman(Object.entries(store.state.data)[Object.entries(store.state.data).length-2][0])

      console.log(store.state.data)

      Object.entries(store.state.data).forEach(function(d){
        if(d[1][self.indicateur] != ""&&d[0] != ""){
          self.labels.push(self.convertDateToHuman(d[0]))
          self.dataset.push((d[1][self.indicateur]))
        }
      })

      this.createChart()
    },
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

  .widget_container{
    max-width: 792px;
    height: 390px;
    border:1px solid #e5e5e5;
    box-sizing: border-box;
    margin:0 auto;
    .r_col{
      width: 66.66%;
      height: 100%;
      display: inline-block;
      position: relative;
      .chart{
        display: block;
        width: 100%;
        height: auto;
        position: absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
      }
    }
    &[data-display="small"]{
      height: 515px;
      .r_col{
        width: 100%;
        display: block;
        height: 220px;
      }
    }
  }
  
</style>