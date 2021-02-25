<template>
  <div class="chart">
    <div class="chart-header rf-text--sm">
        <span>{{title}}</span>
    </div>
    <canvas :id="chartId"></canvas>
  </div>
</template>

<script>
import store from '@/store'
import Chart from 'chart.js'
export default {
  name: 'LineChart',

  data(){
    return {
      labels:[],
      dataset:[],
      chartId:""
    }
  },
  props: {
    indicateur: String,
    title: String,
    unit: String
  },
  computed: {
    dataImport() {
      return store.state.endImport
    },
  },
  methods: {

    createChart () {
      var self = this
      var ctx = document.getElementById(self.chartId).getContext('2d');
      var chart = new Chart(ctx, {
          data: {
              labels: self.labels,
              datasets: [{
                data: self.dataset,
                backgroundColor: "#1167b8",
                type:'bar',
                pointRadius:0
              }]
          },
          options: {
            scales: {
              xAxes: [{
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                }
              }],
              yAxes: [{
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
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

      Object.entries(store.state.data).forEach(function(d){
        if(d[1][self.indicateur] != ""){
          self.labels.push(self.convertDateToHuman(d[0]))
          self.dataset.push((d[1][self.indicateur]))
        }
      })

      this.createChart()
    },
  },

  created(){
    this.chartId = "myChart"+Math.floor(Math.random() * (1000));
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";

  .chart{
    display: block;
    width: 100%;
    max-width: 450px;
    height: auto;
    margin:0 auto 20px;
    .chart-header{
      margin-bottom: 20px;
      text-align: center;

    }
  }

  @media (max-width: 768px) {

  }


</style>
