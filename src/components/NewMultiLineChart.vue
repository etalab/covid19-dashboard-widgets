<template>

  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
    <LeftCol :props="leftColProps"></LeftCol>
    <div class="r_col fr-col-12 fr-col-lg-9">
      <div class="chart ml-lg">
        <div class="multiline_tooltip" v-if="tooltip.display" :style="{top:tooltip.top,left:tooltip.left}">
          <div class="tooltip_header">{{tooltip.date}}</div>
          <div class="tooltip_body">
            <div class="tooltip_value" v-for="index in nbIndicateurs" :key="index"  v-bind:style="{'display':tooltip.listDisplay[index - 1]}">
              <span class="legende_dot" v-bind:style="{'background-color':colors[index - 1]}"></span>
              {{convertStringToLocaleNumber(tooltip.values[index - 1])}} {{units[index- 1]}}
            </div>
          </div>
        </div>
        <canvas :id="chartId" @mouseleave = 'hideTooltip'></canvas>
        <div v-for="index in nbIndicateurs" :key="index" class="flex fr-mt-3v fr-mb-1v" :style="style">
          <span class="legende_dot" v-bind:style="{'background-color':colors_legend[index-1]}" @click = "ChangeShowLine(index)"></span>
          <p v-bind:class="classLegend[index - 1]" v-bind:style="{'color':styleLegend[index - 1]}" @click = "ChangeShowLine(index)">
            {{capitalize(units[index - 1])}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Chart from 'chart.js'
import chroma from 'chroma-js'
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
      listIndicateurs: [],
      nbIndicateurs: undefined,
      colors: [],
      colors_legend: [],
      colors_gradient: [],
      indicateur_data: [],
      classLegend: [],
      styleLegend: [],
      labels: [],
      dataset: [],
      showLine: [],
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
        values: [],
        date: '',
        listDisplay: []
      }
    }
  },
  props: {
    indicateurs: String
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
      this.listIndicateurs = this.indicateurs.split(' ')
      this.nbIndicateurs = this.listIndicateurs.length
      const promises = []
      this.indicateur_data.length = 0
      promises.length = 0
      for (let i = 0; i < this.nbIndicateurs; i++) {
        const promise = store.dispatch('getData', this.listIndicateurs[i]).then(data => {
          this.indicateur_data.push(data)
        })
        promises.push(promise)
      }
      Promise.all(promises).then((values) => {
        this.loading = false
        this.createChart()
      })
    },

    updateData () {
      const self = this
      this.showLine.length = this.nbIndicateurs
      this.showLine = this.showLine.fill(true)

      this.tooltip.listDisplay.length = this.nbIndicateurs
      this.tooltip.listDisplay = this.tooltip.listDisplay.fill('')

      this.classLegend.length = this.nbIndicateurs
      this.classLegend = this.classLegend.fill('fr-text--sm fr-text--bold fr-ml-1v fr-mb-0')

      const listColors = ['#000091', '#007c3a', '#A558A0'].concat(chroma.brewer.Set2.reverse())
      this.colors = listColors.slice(0, this.nbIndicateurs)
      this.colors_legend = listColors.slice(0, this.nbIndicateurs)
      this.colors_gradient.length = 0
      this.colors.forEach(function (col) {
        self.colors_gradient.push(chroma(col).alpha(0.3).hex())
      })

      this.leftColProps.localisation = this.selectedGeoLabel

      const geolevel = this.selectedGeoLevel
      const geocode = this.selectedGeoCode

      let geoObject
      const listGeoObject = []

      this.leftColProps.names.length = 0
      this.units.length = 0
      this.leftColProps.currentValues.length = 0
      this.leftColProps.evolcodes.length = 0
      this.leftColProps.evolvalues.length = 0

      this.labels.length = 0
      this.dataset.length = 0

      const data = []
      data.length = 0

      for (let i = 0; i < this.nbIndicateurs; i++) {
        data[i] = []
        if (geolevel === 'France') {
          geoObject = this.indicateur_data[i].france[0]
        } else {
          geoObject = this.indicateur_data[i][geolevel].find(obj => {
            return obj.code_level === geocode
          })
        }

        this.leftColProps.names.push(this.indicateur_data[i].nom)
        this.units.push(this.indicateur_data[i].unite)
        this.leftColProps.currentValues.push(geoObject.last_value)
        this.leftColProps.evolcodes.push(geoObject.evol_color)
        this.leftColProps.evolvalues.push(geoObject.evol_percentage)
        listGeoObject.push(geoObject)
      }
      this.leftColProps.date = this.convertDateToHuman(listGeoObject[0].last_date)
      this.leftColProps.currentDate = this.convertDateToHuman(listGeoObject[0].last_date)

      listGeoObject[0].values.forEach(function (d) {
        self.labels.push(self.convertDateToHuman(d.date))
        data[0].push((d.value))

        for (let i = 1; i < self.nbIndicateurs; i++) {
          const correspondingValue = listGeoObject[i].values.find(obj => {
            return obj.date === d.date
          })

          data[i].push(correspondingValue.value)
        }
      })

      const ctx = document.getElementById(self.chartId).getContext('2d')
      let gradientFill

      for (let i = 0; i < this.nbIndicateurs; i++) {
        this.display === 'big' ? gradientFill = ctx.createLinearGradient(0, 0, 0, 500) : gradientFill = ctx.createLinearGradient(0, 0, 0, 250)
        gradientFill.addColorStop(0, this.colors_gradient[i])
        gradientFill.addColorStop(0.6, 'rgba(245, 245, 255, 0)')

        const tmp = {
          data: data[i],
          backgroundColor: gradientFill,
          borderColor: self.colors[i],
          type: 'line',
          pointRadius: 8,
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          showLine: self.showLine[i],
          pointHoverBackgroundColor: self.colors[i],
          pointHoverRadius: 6
        }

        this.dataset.push(tmp)
      }
    },

    updateChart () {
      this.updateData()
      this.chart.update()
    },

    ChangeShowLine (IdLine) {
      const self = this
      const i = IdLine - 1
      this.showLine[i] = !this.showLine[i]
      this.chart.data.datasets[i].showLine = this.showLine[i]
      this.colors_legend.length = 0
      this.classLegend.length = 0
      this.styleLegend.length = 0
      this.tooltip.listDisplay.length = 0
      this.colors.forEach(function (col, index) {
        if (self.showLine[index]) {
          self.tooltip.listDisplay.push('')
          self.colors_legend.push(col)
          self.classLegend.push('fr-text--sm fr-text--bold fr-ml-1v fr-mb-0')
          self.styleLegend.push('#1E1E1E')
        } else {
          self.tooltip.listDisplay.push('none')
          self.colors_legend.push(chroma(col).alpha(0.3).hex())
          self.classLegend.push('fr-text--sm fr-ml-1v fr-mb-0')
          self.styleLegend.push('#E7E7E7')
        }
      })
      this.chart.update()
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

      this.chart = new Chart(ctx, {
        data: {
          labels: self.labels,
          datasets: self.dataset
        },
        options: {
          animation: {
            easing: 'easeInOutBack',
            duration: 0
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
            displayColors: false,
            backgroundColor: '#6b6b6b',
            callbacks: {
              label: function (tooltipItems) {
                const int = self.convertFloatToHuman(tooltipItems.value)
                return int + ' ' + self.units[tooltipItems.datasetIndex]
              },
              title: function (tooltipItems) {
                return tooltipItems[0].label
              },
              labelTextColor: function () {
                return '#eeeeee'
              }
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
          display: inline-block;
          margin-top: 0.25rem;
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
          min-width: 0.7rem;
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
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
