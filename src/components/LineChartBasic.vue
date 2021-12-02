<template>
  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
    <h3 v-if="indicateur_data">{{ indicateur_data.nom }}</h3>
    <div class="r_col fr-col-12">
      <div class="chart ml-lg">
        <div class="linechart_tooltip">
          <div class="tooltip_header"></div>
          <div class="tooltip_body">
            <div class="tooltip_value">
              <span class="tooltip_dot"></span>
            </div>
          </div>
        </div>
        <canvas :id="chartId"></canvas>
        <div class="flex fr-mt-3v" :style="{'margin-left': style}">
          <span class="legende_dot"></span>
          <p class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{ capitalize(units[0]) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store'
import { Chart } from 'chart.js'
import { mixin } from '@/utils.js'
export default {
  name: 'LineChartBasic',
  components: {
  },
  mixins: [mixin],
  data () {
    return {
      indicateur_data: undefined,
      labels: [],
      dataset: [],
      datasets: [],
      widgetId: '',
      chartId: '',
      display: '',
      units: [],
      chart: undefined,
      loading: true,
      legendLeftMargin: 0
    }
  },
  props: {
    indicateur: String,
    constante: {
      type: Boolean,
      default: false
    },
    periods: {
      type: String,
      default: null
    }
  },
  computed: {
    style () {
      return this.legendLeftMargin + 'px'
    }
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
      const self = this
      var geoObject
      geoObject = this.getGeoObject()

      this.units.length = 0
      this.units.push(this.indicateur_data.unite)

      this.labels.length = 0
      this.dataset.length = 0
      geoObject.values.forEach(function (d) {
        self.labels.push(self.convertDateToHuman(d.date))
        self.dataset.push((d.value))
      })
    },
    getGeoObject () {
      return this.indicateur_data
    },
    updateChart () {
      this.updateData()
      this.chart.update()
    },
    createChart () {
      const self = this
      this.updateData()
      let xTickLimit
      this.display === 'big' ? xTickLimit = 6 : xTickLimit = 1
      const ctx = document.getElementById(self.chartId).getContext('2d')
      let gradientFill
      this.display === 'big' ? gradientFill = ctx.createLinearGradient(0, 0, 0, 500) : gradientFill = ctx.createLinearGradient(0, 0, 0, 250)
      gradientFill.addColorStop(0, 'rgba(218, 218, 254, 0.6)')
      gradientFill.addColorStop(0.6, 'rgba(245, 245, 255, 0)')
      const datasets = [{
        data: self.dataset,
        backgroundColor: gradientFill,
        borderColor: '#000091',
        type: 'line',
        pointRadius: 8,
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointHoverBackgroundColor: 'rgba(0, 0, 145, 1)',
        pointHoverRadius: 6
      }]
      if (this.constante) {
        datasets.push({
          borderColor: '#009081',
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          pointRadius: 8,
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          borderDash: [10, 5]
        })
      }
      this.chart = new Chart(ctx, {
        data: {
          labels: self.labels,
          datasets: datasets
        },
        plugins: [{
        }],
        options: {
          animation: {
            easing: 'easeInOutBack'
          },
          scales: {
            xAxes: [{
              gridLines: {
                color: 'rgba(0, 0, 0, 0)'
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: xTickLimit,
                maxRotation: 0,
                minRotation: 0,
                callback: function (value) {
                  return value.toString().substring(3, 5) + '/' + value.toString().substring(8, 10)
                }
              }
            }],
            yAxes: [{
              gridLines: {
                color: '#e5e5e5',
                borderDash: [3]
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 5,
                callback: function (value, index, values) {
                  if (value >= 1000000000 || value <= -1000000000) {
                    return value / 1e9 + 'B'
                  } else if (value >= 1000000 || value <= -1000000) {
                    return value / 1e6 + 'M'
                  } else if (value >= 1000 || value <= -1000) {
                    return value / 1e3 + 'K'
                  }
                  return value
                }
              },
              afterFit: function (axis) {
                self.legendLeftMargin = axis.width
              }
            }]
          },
          legend: {
            display: false
          },
          tooltips: {
            filter: function (tooltipItem) {
              return tooltipItem.datasetIndex === 0
            },
            enabled: false,
            displayColors: false,
            backgroundColor: '#6b6b6b',
            callbacks: {
              label: function (tooltipItems) {
                const int = self.convertFloatToHuman(tooltipItems.value)
                return int + ' ' + self.units[0]
              },
              title: function (tooltipItems) {
                return tooltipItems[0].label
              },
              labelTextColor: function () {
                return '#eeeeee'
              }
            },
            custom: function (context) {
              // Tooltip Element
              const tooltipEl = self.$el.querySelector('.linechart_tooltip')
              const tooltipModel = context
              if (tooltipModel.opacity === 0 || tooltipModel.title[0] === undefined) {
                tooltipEl.style.opacity = 0
                return
              }
              // Set caret Position
              tooltipEl.classList.remove('above', 'below', 'no-transform')
              if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign)
              } else {
                tooltipEl.classList.add('no-transform')
              }
              function getBody (bodyItem) {
                return bodyItem.lines
              }
              // Set Text
              if (tooltipModel.body) {
                const titleLines = tooltipModel.title || []
                const bodyLines = tooltipModel.body.map(getBody)
                const divDate = self.$el.querySelector('.tooltip_header')
                divDate.innerHTML = titleLines[0]
                const divValue = self.$el.querySelector('.tooltip_value')
                divValue.innerHTML = self.$el.querySelector('.tooltip_dot').outerHTML + ' ' + bodyLines[0]
              }
              const {
                offsetLeft: positionX,
                offsetTop: positionY
              } = self.chart.canvas

              const canvasWidth = Number(self.chart.canvas.style.width.replace(/\D/g, ''))
              const canvasHeight = Number(self.chart.canvas.style.height.replace(/\D/g, ''))
              tooltipEl.style.position = 'absolute'
              tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px'
              tooltipEl.style.pointerEvents = 'none'
              let tooltipX = positionX + tooltipModel.caretX + 10
              let tooltipY = positionY + tooltipModel.caretY - 18
              if (tooltipX + tooltipEl.clientWidth + self.legendLeftMargin > positionX + canvasWidth) { // tooltip disappears at the right of the canvas
                tooltipX = positionX + tooltipModel.caretX - tooltipEl.clientWidth - 10
              }
              if (tooltipY + tooltipEl.clientHeight > positionY + 0.9 * canvasHeight) { // tooltip disappears at the bottom of the canvas
                tooltipY = positionY + tooltipModel.caretY - tooltipEl.clientHeight + 18
              }
              if (tooltipX < positionX) {
                tooltipX = positionX + tooltipModel.caretX - tooltipEl.clientWidth / 2
                tooltipY = positionY + tooltipModel.caretY - tooltipEl.clientHeight - 18
              }
              tooltipEl.style.left = tooltipX + 'px'
              tooltipEl.style.top = tooltipY + 'px'
              tooltipEl.style.opacity = 1
            }
          }
        }
      })
    }
  },
  watch: {
    selectedGeoCode: function () {
      this.updateChart()
    },
    selectedGeoLevel: function () {
      this.updateChart()
    }
  },
  created () {
    this.chartId = 'myChart' + Math.floor(Math.random() * (1000))
    this.widgetId = 'widget' + Math.floor(Math.random() * (1000))
    this.getData()
  },
  mounted () {
    document.getElementById(this.widgetId).offsetWidth > 486 ? this.display = 'big' : this.display = 'small'
  }
}
</script>
<style scoped lang="scss">
.widget_container {

  padding: 30px;
  border: 1px solid #ebebeb;

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
    margin-left: 0;
  }
  @media (min-width: 62em) {
    .ml-lg {
      margin-left: 3rem;
    }
  }
  @media (max-width: 62em) {
    .chart .flex {
      margin-left: 0 !important
    }
  }
  .r_col {
    align-self: center;
    .flex {
      display: flex;
      .legende_dot {
        min-width: 1rem;
        width: 1rem;
        height: 1rem;
        min-width: 1rem;
        border-radius: 50%;
        background-color: #000091;
        display: inline-block;
        margin-top: 0.25rem;
      }
      .legende_dash_line1{
        min-width: 0.4rem;
        width: 0.4rem;
        height: 0.2rem;
        border-radius: 0%;
        display: inline-block;
        margin-top: 0.6rem;
      }
      .legende_dash_line2{
        min-width: 0.4rem;
        width: 0.4rem;
        height: 0.2rem;
        border-radius: 0%;
        display: inline-block;
        margin-top: 0.6rem;
        margin-left: 0.2rem;
      }
    }
  }
  .chart canvas {
    max-width: 100%;
  }
  .linechart_tooltip {
    width: 11.25rem;
    height: auto;
    background-color: white;
    position: fixed;
    z-index: 999;
    border-radius: 4px;
    box-shadow: 0 8px 16px 0 rgba(22, 22, 22, 0.12), 0 8px 16px -16px rgba(22, 22, 22, 0.32);
    text-align: left;
    pointer-events: none;
    font-size: 0.75rem;
    .tooltip_header {
      width: 100%;
      height: 1.75rem;
      background-color: #f6f6f6;
      color: #6b6b6b;
      padding-left: 0.75rem;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
    .tooltip_body {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-top:0.25rem;
      line-height: 1.67;
      .tooltip_dot {
        min-width: 0.7rem;
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
        background-color: #000091;
        display: inline-block;
        margin-top: 0.25rem;
      }
      .tooltip_place {
        color: #242424;
      }
      .tooltip_value {
        color: #242424;
        font-weight: bold;
      }
    }
  }
}
</style>
