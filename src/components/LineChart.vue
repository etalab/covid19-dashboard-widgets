<template>
  <div class="chart">
    <div class="chart-header rf-text--sm">
        <span>{{title}}</span>
    </div>
    <canvas id="myChart"></canvas>
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
      datasetalter:[]

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
      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: self.labels,
              datasets: [{
                data: self.dataset,
                backgroundColor: "#1167b8",
                type:'bar',
                pointRadius:0
              },{
                  data: self.datasetalter,
                  backgroundColor: "#e5e5f4",
                  type:'line',
                  fill:false
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
        }
      });
      console.log(chart)
    }
    
  },

  watch:{
    dataImport:function(){

      var self = this

      Object.entries(store.state.data).forEach(function(d){
        if(d[1][self.indicateur] != ""){
          self.labels.push((d[0]))
          self.dataset.push((d[1][self.indicateur]))
          self.datasetalter.push((d[1]["dc_tot"]))
        }
      })

      this.createChart()
    },
  },

  created(){
    
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
    height: 350px;
    box-sizing: border-box;
    .chart-header{
      margin-bottom: 20px;
      text-align: center;

    }
  }

  @media (max-width: 768px) {

  }


</style>
