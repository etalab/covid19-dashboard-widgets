<template>

  <div class="widget_container" :data-display="display" :id="widgetId">
    <div class="l_col">
        
        <div class="l_box" data-box="loc">
          <span class="l_box_title">Localisation</span>
          <span class="l_box_label">
            <svg class="loc_ico" width="16" height="16" viewBox="0 0 16 16"><path d="M12.243 2.424c2.343 2.343 2.343 6.142 0 8.485L8 15.152l-4.243-4.243c-2.343-2.343-2.343-6.142 0-8.485C6.101.081 9.9.081 12.243 2.424zM4.7 3.367c-1.822 1.822-1.822 4.777 0 6.6l3.3 3.3 3.3-3.3c1.822-1.823 1.822-4.778 0-6.6-1.823-1.822-4.777-1.822-6.6 0zM8 5.333c.736 0 1.333.597 1.333 1.334C9.333 7.403 8.736 8 8 8s-1.333-.597-1.333-1.333c0-.737.597-1.334 1.333-1.334z" transform="translate(-550 -5417) translate(527 5237) translate(0 124) translate(23 56)"/></svg>
            France entière
          </span>
        </div>
        <div class="l_box" data-box="number">
          <span class="l_box_title">Mise à jour : 12/04/2021</span>
          <span class="l_box_label">Nombre de patients en réanimation</span>
          <div class="l_box_number_container">
            <span class="l_box_number">5902</span>
            <span class="l_box_trend">
              <svg class="trend_ico" width="16" height="16" viewBox="0 0 16 16"><path fill="#d80600" d="M12.714 3.286c2.602 2.602 2.602 6.826 0 9.428-2.602 2.602-6.826 2.602-9.428 0-2.602-2.602-2.602-6.826 0-9.428 2.602-2.602 6.826-2.602 9.428 0zm-1.886 1.886H5.172l2.12 2.12-2.828 2.83 1.415 1.414 2.828-2.829 2.121 2.121V5.172z" transform="translate(-663 -5576) translate(527 5237) translate(1 225) translate(135 114)"/></svg>
              +XX % en 7j
            </span>
          </div>
        </div>
        <div class="l_box" data-box="leg">
          <span class="l_box_title">Légende</span>
          <div class="l_box_legende_container">
            <div class="legende_dot"></div>
            <span class="legende_txt">Patients</span>
          </div>
        </div>

    </div>
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
export default {
  name: 'LineChart',

  data(){
    return {
      labels:[],
      dataset:[],
      widgetId:"",
      chartId:"",
      display:""
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
      

      var ctx = document.getElementById(self.chartId).getContext('2d');

      var gradientFill
      this.display=== 'big' ? gradientFill = ctx.createLinearGradient(0, 0, 0, 500) : gradientFill = ctx.createLinearGradient(0, 0, 0, 250)

      gradientFill.addColorStop(0, "rgba(218, 218, 254, 0.6)");
      gradientFill.addColorStop(0.6, "rgba(245, 245, 255, 0)");

      var chart = new Chart(ctx, {
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
    .l_col{
      width: 33.33%;
      height: 100%;
      display: inline-block;
      overflow: hidden;
      padding-left: 25px;
      padding-right: 25px;
      box-sizing: border-box;
      .l_box{
        width: 100%;
        margin-top: 15px;
        border-bottom: 1px solid #e5e5e5;
        padding-bottom: 25px;
        position: relative;
        .l_box_title{
          font-family: "Marianne";
          font-size: 12px;
          color:#6b6b6b;
          margin-bottom: 15px;
          display: block;
          position: relative;
        }
        .l_box_label{
          font-family: "Marianne";
          font-size: 14px;
          color:#242424;
          position: relative;
          .loc_ico{
            position: relative;
            transform:translate(0,2px);
          } 
        }
        .l_box_number_container{
          margin-top: 5px;
          .l_box_number{
            font-family: "Marianne";
            font-size: 20px;
            color:#161616;
            display: inline-block;
          }
          .l_box_trend{
            font-family: "Marianne";
            font-size: 12px;
            color:#d80600;
            display: inline-block;
            margin-left: 10px;
            .trend_ico{
              position: relative;
              transform:translate(0,2px);
            }
          }
        }
        .l_box_legende_container{
          .legende_dot{
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #000091;
            display: inline-block;
            transform:translate(0,3px);
          }
          .legende_txt{
            font-family: "Marianne";
            font-size: 14px;
            color:#242424;
            display: inline-block;
            margin-left: 5px;
          }
        }
        &:last-child{
          border-bottom: 0px;
          padding-bottom: 0px;
        }
      }
    }
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
      .l_col{
        width: 100%;
        display: block;
        height: 320px;
      }
      .r_col{
        width: 100%;
        display: block;
        height: 220px;
      }
    }
  }
  
</style>
