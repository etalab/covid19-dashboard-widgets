<template>

  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
    <LeftCol :props="leftColProps"></LeftCol>
    <div class="r_col fr-col-12 fr-col-lg-9">
      <div class="chart ml-lg">
        <div class="multiline_tooltip" v-if="tooltip.display" :style="{top:tooltip.top,left:tooltip.left}">
          <div class="tooltip_header">{{tooltip.date}}</div>
          <div class="tooltip_body">
            <div class="tooltip_value">
              <span class="legende_dot"></span>
              {{convertStringToLocaleNumber(tooltip.value)}} {{units[0]}}
            </div>
            <div class="tooltip_value">
              <span class="legende_dot" data-serie="2"></span>
              {{convertStringToLocaleNumber(tooltip.value2)}} {{units[1]}}</div>
          </div>
        </div>
        <canvas :id="chartId" @mouseleave = 'hideTooltip'></canvas>
        <div class="flex fr-mt-3v fr-mb-1v" :style="style">
          <span v-if="showLine" class="legende_dot" @click = "ChangeShowLine(1)"></span>
          <span v-else class="legende_dot" showLine = false @click = "ChangeShowLine(1)"></span>
          <p v-if="showLine" class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{capitalize(units[0])}}</p>
          <p v-else class="fr-text--sm fr-ml-1v fr-mb-0" style="color:#E7E7E7">{{capitalize(units[0])}}</p>
        </div>
        <div class="flex" :style="style">
          <span v-if="showLine2" class="legende_dot" data-serie="2" @click = "ChangeShowLine(2)"></span>
          <span v-else class="legende_dot" data-serie="2" showLine = false @click = "ChangeShowLine(2)"></span>
          <p v-if="showLine2" class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0 ">{{capitalize(units[1])}}</p>
          <p v-else class="fr-text--sm fr-ml-1v fr-mb-0 " style="color:#E7E7E7">{{capitalize(units[1])}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Chart from 'chart.js'
import LeftCol from '@/components/LeftCol'
import { mixin } from '@/utils.js'

export default {
  name: 'MultiLineChart',
  components: {
    LeftCol
  },
  mixins: [mixin],
  data () {
    return {
      indicateur_data: undefined,
      indicateur_data2: undefined,
      labels: [],
      dataset: [],
      dataset2: [],
      showLine: true,
      showLine2: true,
      widgetId: '',
      chartId: '',
      display: '',
      leftColProps: {
        localisation: '',
        currentValues: [],
        currentDate: '',
        names: [],
        evolcodes: [],
        evolvalues: [],
        isMap: false,
        date: ''
      },
      units: [],
      chart: undefined,
      loading: true,
      legendLeftMargin: 0,
      tooltip: {
        top: '0px',
        left: '0px',
        display: false,
        value: 0,
        value2: 0,
        date: ''
      }
    }
  },
  props: {
    indicateur1: String,
    indicateur2: String
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
      return 'margin-left: ' + this.legendLeftMargin + 'px'
    }

  },
  methods: {
    async getData () {
      const promise1 = store.dispatch('getData', this.indicateur1).then(data => {
        this.indicateur_data = data
      })

      const promise2 = store.dispatch('getData', this.indicateur2).then(data => {
        this.indicateur_data2 = data
      })

      Promise.all([promise1, promise2]).then((values) => {
        this.loading = false
        this.createChart()
      })
    },

    updateData () {
      const self = this

      this.leftColProps.localisation = this.selectedGeoLabel

      const geolevel = this.selectedGeoLevel
      const geocode = this.selectedGeoCode

      let geoObject
      let geoObject2

      if (geolevel === 'France') {
        geoObject = this.indicateur_data.france[0]
        geoObject2 = this.indicateur_data2.france[0]
      } else {
        geoObject = this.indicateur_data[geolevel].find(obj => {
          return obj.code_level === geocode
        })
        geoObject2 = this.indicateur_data2[geolevel].find(obj => {
          return obj.code_level === geocode
        })
      }

      this.leftColProps.date = this.convertDateToHuman(geoObject.last_date)

      this.leftColProps.names.length = 0
      this.units.length = 0
      this.leftColProps.currentValues.length = 0
      this.leftColProps.evolcodes.length = 0
      this.leftColProps.evolvalues.length = 0

      this.leftColProps.names.push(this.indicateur_data.nom, this.indicateur_data2.nom)
      this.units.push(this.indicateur_data.unite, this.indicateur_data2.unite)
      this.leftColProps.currentValues.push(geoObject.last_value, geoObject2.last_value)
      this.leftColProps.currentDate = this.convertDateToHuman(geoObject.last_date)
      this.leftColProps.evolcodes.push(geoObject.evol_color, geoObject2.evol_color)
      this.leftColProps.evolvalues.push(geoObject.evol_percentage, geoObject2.evol_percentage)

      this.labels.length = 0
      this.dataset.length = 0
      this.dataset2.length = 0

      geoObject.values.forEach(function (d) {
        self.labels.push(self.convertDateToHuman(d.date))
        self.dataset.push((d.value))

        const correspondingValue = geoObject2.values.find(obj => {
          return obj.date === d.date
        })

        self.dataset2.push(correspondingValue.value)
      })
    },

    updateChart () {
      this.updateData()
      this.chart.update()
    },

    ChangeShowLine (IdLine) {
      if (IdLine === 1) {
        this.showLine = !this.showLine
        this.chart.data.datasets[0].showLine = this.showLine
        this.chart.update()
      } else {
        this.showLine2 = !this.showLine2
        this.chart.data.datasets[1].showLine = this.showLine2
        this.chart.update()
      }
    },
    hideTooltip () {
      this.tooltip.display = false
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

      let gradientFill2

      this.display === 'big' ? gradientFill2 = ctx.createLinearGradient(0, 0, 0, 350) : gradientFill2 = ctx.createLinearGradient(0, 0, 0, 225)

      gradientFill2.addColorStop(0, 'rgba(0, 124, 58, 0.6)')
      gradientFill2.addColorStop(0.6, 'rgba(0, 124, 58, 0)')

      this.chart = new Chart(ctx, {
        data: {
          labels: self.labels,
          datasets: [
            {
              data: self.dataset,
              backgroundColor: gradientFill,
              borderColor: '#000091',
              type: 'line',
              pointRadius: 8,
              pointBackgroundColor: 'rgba(0, 0, 0, 0)',
              pointBorderColor: 'rgba(0, 0, 0, 0)',
              showLine: self.showLine,
              pointHoverBackgroundColor: 'rgba(0, 0, 145, 1)',
              pointHoverRadius: 6
            },
            {
              data: self.dataset2,
              backgroundColor: gradientFill2,
              borderColor: '#007c3a',
              type: 'line',
              pointRadius: 8,
              pointBackgroundColor: 'rgba(0, 0, 0, 0)',
              pointBorderColor: 'rgba(0, 0, 0, 0)',
              showLine: self.showLine2,
              pointHoverBackgroundColor: 'rgba(0, 124, 58, 1)',
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          animation: {
            easing: 'easeInOutBack'
          },
          onHover: (e) => {
            if (this.chart.getElementsAtEvent(e).length !== 0) {
              const index = this.chart.getElementsAtEvent(e)[0]._index
              const pxTop = Math.min(this.chart.scales['y-axis-0'].getPixelForValue(this.dataset[index], index), this.chart.scales['y-axis-0'].getPixelForValue(this.dataset2[index], index))
              this.tooltip.top = (e.target.getBoundingClientRect().top + pxTop - 50) + 'px'
              this.tooltip.left = (e.target.getBoundingClientRect().left + this.chart.scales['x-axis-0'].getPixelForTick(index) + 25) + 'px'
              this.tooltip.display = true

              this.tooltip.value = this.dataset[index]
              this.tooltip.value2 = this.dataset2[index]
              this.tooltip.date = this.labels[index]
            } else {
              this.tooltip.display = false
            }
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
                maxTicksLimit: 5
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
            enabled: false
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

  .widget_container{
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
          min-width: 1rem;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-color: #000091;
          &[showLine=false]{
            background-color: rgba(0, 0, 145, 0.3)
          }
          display: inline-block;
          margin-top: 0.25rem;
          &[data-serie="2"]{
            background-color: #007c3a;
            &[showLine=false]{
              background-color: rgba(0, 124, 58, 0.3)
            }
          }
        }
      }
    }

    .chart canvas {
      max-width:100%;
    }
    .multiline_tooltip{
      width: 165px;
      height: auto;
      background-color: white;
      position: fixed;
      z-index: 999;
      border-radius: 4px;
      box-shadow: 0 8px 16px 0 rgba(22, 22, 22, 0.12), 0 8px 16px -16px rgba(22, 22, 22, 0.32);
      text-align: left;
      pointer-events: none;
      font-size: 0.75rem;
      .tooltip_header{
        width: 100%;
        height: 30px;
        background-color: #f6f6f6;
        color:#6b6b6b;
        padding-left: 5px;
        padding-top: 3px;
      }
      .tooltip_body{
        padding-left: 5px;
        padding-bottom: 5px;
        line-height: 1.67;
        .legende_dot{
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
          background-color: #000091;
          &[showLine=false]{
            background-color: rgba(0, 0, 145, 0.3)
          }
          display: inline-block;
          margin-top: 0.25rem;
          &[data-serie="2"]{
            background-color: #007c3a;
            &[showLine=false]{
              background-color: rgba(0, 124, 58, 0.3)
            }
          }
        }
        .tooltip_place{
          color:#242424;
        }
        .tooltip_value{
          color:#242424;
          font-weight: bold;
        }
      }
    }

  }

</style>
