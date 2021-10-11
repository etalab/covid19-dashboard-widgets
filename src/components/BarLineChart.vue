<template>
  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
      <div class="fr-warning" v-bind:style="{'display': alerteDisplay}">
        <div class="scheme-border">
            <span class="fr-fi-information-fill fr-px-1w fr-py-3v" aria-hidden="true"></span>
        </div>
        <p class="fr-text--sm fr-mb-0 fr-p-3v">L'affichage des données est uniquement disponible au niveau national</p>
      </div>
    <LeftCol :props="leftColProps"></LeftCol>
    <div class="r_col fr-col-12 fr-col-lg-9">
    <div class="chart ml-lg">
      <div class="linechart_tooltip">
        <div class="tooltip_header"></div>
        <div class="tooltip_body">
          <div class="tooltip_value">
            <span class="legende_dot"></span>
          </div>
        </div>
      </div>
      <canvas :id="chartId"></canvas>
      <div class="flex fr-mt-3v" :style="style">
        <span class="legende_dot"></span>
        <p class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{capitalize(units[0])}}</p>
      </div>
      <div class="flex fr-mt-3v" :style="style">
        <span class="legende_dot"  v-bind:style="{'background-color': leftColProps.colors_legend[1]}"></span>
        <p class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{capitalize(units[1])}}</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { Chart } from 'chart.js'
import LeftCol from '@/components/LeftCol'
import { mixin } from '@/utils.js'

export default {
  name: 'BarLineChart',
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
      protocole: [],
      total: [],
      widgetId: '',
      chartId: '',
      display: '',
      alerteDisplay: 'none',
      leftColProps: {
        localisation: '',
        currentValues: [],
        currentDate: '',
        names: [],
        evolcodes: [],
        evolvalues: [],
        isMap: false,
        date: '',
        colors_legend: ['#000091', '#009081'],
        legendDisplay: [''],
        units: [],
        opacity: [1]
      },
      units: [],
      chart: undefined,
      loading: true,
      legendLeftMargin: 0,
      geoFallback: false,
      geoFallbackMsg: ''
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

      const geolevel = this.selectedGeoLevel
      // const geocode = this.selectedGeoCode

      this.leftColProps.localisation = this.selectedGeoLabel

      let geoObject
      let geoObject2

      if (geolevel === 'France') {
        geoObject = this.indicateur_data.france[0]
        geoObject2 = this.indicateur_data2.france[0]
        this.alerteDisplay = 'none'
      } else {
        this.alerteDisplay = ''
        geoObject = this.indicateur_data.france[0]
        geoObject2 = this.indicateur_data2.france[0]
        this.leftColProps.localisation = 'France entière'
      }

      this.leftColProps.names.length = 0
      this.units.length = 0
      this.leftColProps.currentValues.length = 0
      this.leftColProps.evolcodes.length = 0
      this.leftColProps.evolvalues.length = 0
      this.leftColProps.units.length = 0

      this.leftColProps.names.push(this.indicateur_data.nom, this.indicateur_data2.nom)
      this.units.push(this.indicateur_data.unite, this.indicateur_data2.unite)
      this.leftColProps.currentValues.push(geoObject.last_value, geoObject2.last_value)
      this.leftColProps.currentDate = this.convertDateToHuman(geoObject.last_date)
      this.leftColProps.date = this.convertDateToHuman(geoObject.last_date)
      this.leftColProps.evolcodes.push(geoObject.evol_color, geoObject2.evol_color)
      this.leftColProps.evolvalues.push(geoObject.evol_percentage, geoObject2.evol_percentage)
      this.leftColProps.units.push(this.indicateur_data.unite_short, this.indicateur_data2.unite_short)

      this.labels.length = 0
      this.dataset.length = 0
      this.dataset2.length = 0
      this.protocole.length = 0
      this.total.length = 0

      let date = []
      geoObject.values.forEach(function (d) {
        date.push(d.date)
      })
      date = date.sort().slice(-9)
      geoObject.values.forEach(function (d) {
        if (date.includes(d.date)) {
          self.labels.push(self.convertDateToHuman(d.date))
          self.dataset.push(d.value)
          self.protocole.push(d.protocole)
          self.total.push(d.total)
          const correspondingValue = geoObject2.values.find(obj => {
            return obj.date === d.date
          })
          self.dataset2.push(correspondingValue.value)
        }
      })
    },

    updateChart () {
      this.updateData()
      this.chart.update()
    },

    createChart () {
      const self = this

      this.updateData()

      let xTickLimit
      this.display === 'big' ? xTickLimit = 9 : xTickLimit = 5

      const ctx = document.getElementById(self.chartId).getContext('2d')

      let gradientFill
      this.display === 'big' ? gradientFill = ctx.createLinearGradient(0, 0, 0, 500) : gradientFill = ctx.createLinearGradient(0, 0, 0, 250)

      gradientFill.addColorStop(0, 'rgba(45, 88, 81, 0.3)')
      gradientFill.addColorStop(0.6, 'rgba(245, 245, 255, 0)')

      let max
      max = Math.max.apply(null, self.dataset2)
      if (max < 0.1) {
        max = 1
      } else {
        max = Math.min(Math.ceil(max / 10) * 10, 100)
      }

      this.chart = new Chart(ctx, {
        data: {
          labels: self.labels,
          datasets: [{
            data: self.dataset,
            backgroundColor: '#000091',
            borderColor: '#000091',
            type: 'bar',
            barPercentage: 0.5,
            yAxisID: 'yAxisL',
            order: 2
          },
          {
            data: self.dataset2,
            backgroundColor: gradientFill,
            borderColor: '#009081',
            type: 'line',
            pointRadius: 8,
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            pointHoverBackgroundColor: '#009081',
            pointHoverRadius: 6,
            yAxisID: 'yAxisR',
            order: 1
          }
          ]
        },
        options: {
          animation: {
            easing: 'easeInOutBack'
          },
          scales: {
            xAxes: [{
              offset: true,
              gridLines: {
                color: 'rgba(0, 0, 0, 0)'
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: xTickLimit,
                maxRotation: 0,
                minRotation: 0,
                callback: function (value) {
                  return value.toString().substring(0, 2) + '/' + value.toString().substring(3, 5)
                }
              }
            }],
            yAxes: [{
              position: 'left',
              id: 'yAxisL',
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
            },
            {
              position: 'right',
              id: 'yAxisR',
              gridLines: {
                color: '#e5e5e5',
                borderDash: [3]
              },
              ticks: {
                min: 0,
                max: max,
                autoSkip: true,
                maxTicksLimit: 5,
                callback: function (value) {
                  return value.toString() + '%'
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
            reversed: false,
            displayColors: false,
            backgroundColor: '#6b6b6b',
            enabled: false,
            callbacks: {
              label: function (tooltipItems) {
                const int = parseFloat(self.dataset[tooltipItems.index]).toFixed(0).toLocaleString()
                const total = parseFloat(self.total[tooltipItems.index]).toFixed(0).toLocaleString()
                const taux = self.dataset2[tooltipItems.index].toString()
                if (self.protocole[tooltipItems.index] === undefined) {
                  return [int + ' ' + self.units[0] + ' (' + taux + '%) sur un total de ' + total]
                } else {
                  return ['- ' + int + ' ' + self.units[0] + ' (' + taux + '%) sur un total de ' + total, '- Protocole sanitaire du ' + self.protocole[tooltipItems.index]]
                }
              },
              title: function (tooltipItems) {
                return tooltipItems[0].label
              },
              labelTextColor: function (tooltipItems) {
                // return self.leftColProps.colors_legend[tooltipItems.datasetIndex]
                return '#eeeeee'
              }
            },
            custom: function (context) {
              // Tooltip Element
              const tooltipEl = self.$el.querySelector('.linechart_tooltip')

              // Hide if no tooltip
              const tooltipModel = context
              if (tooltipModel.opacity === 0) {
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

                // const color = tooltipModel.labelTextColors[0]
                const divValue = self.$el.querySelector('.tooltip_value')

                let innerHTML = ''
                bodyLines[0].forEach(function (line) {
                  innerHTML += line + '<br>'
                })

                divValue.innerHTML = innerHTML
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
          min-width: 1rem;
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
    .linechart_tooltip{
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
      .tooltip_header{
        width: 100%;
        height: 30px;
        background-color: #f6f6f6;
        color:#6b6b6b;
        padding-left: 0.75rem;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
      }
      .tooltip_body{
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        padding-top:0.25rem;
        line-height: 1.67;
        .legende_dot{
          min-width: 0.7rem;
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
          background-color: #000091;
          display: inline-block;
          margin-top: 0.25rem;
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
