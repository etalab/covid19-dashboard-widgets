<template>
  <div class="barchart">
    
    <canvas id="myChart"></canvas>

  </div>
</template>

<script>
import store from '@/store'
import Chart from 'chart.js';
export default {
  name: 'BarChart',
  data(){
    return {
      ovqStructure:{},
      ovqDataset:{},
      indicateurs:{}
    }
  },
  props: {
    ovqid: String
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

    getOvqdata () {

       this.ovqStructure = store.state.structure.find(ovqStructure => ovqStructure['id_ovq'] == this.ovqid)
       console.log(this.ovqStructure)
       this.createChart()


    },
    
    createChart () {

      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [{
                  backgroundColor: '#1aad8c',
                  borderColor: '#1aad8c',
                  borderWidth:5,
                  pointBorderColor:'#ffffff',
                  pointBorderWidth:2,
                  pointRadius:7,
                  fill:false,
                  data: [0, 10, 5, 2, 20, 30, 45]
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
      this.getOvqdata()
    },
    selectedGeoCode:function(){
      console.log("change geo")
    }
  },

  created(){
    
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";

  .barchart{
    width: 100%;
    max-width: 450px;
    height: 350px;
    box-sizing: border-box;
    margin:0 auto;
  }

  @media (max-width: 728px) {

  }


</style>
