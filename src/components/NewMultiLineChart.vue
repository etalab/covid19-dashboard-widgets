<template>
  <div class="widget_container fr-grid-row" :class="(loading)?'loading':''" :data-display="display" :id="widgetId">
    <div class="fr-warning" v-if="geoFallback">
      <div class="scheme-border">
        <span class="fr-fi-information-fill fr-px-1w fr-py-3v" aria-hidden="true"></span>
      </div>
      <p class="fr-text--sm fr-mb-0 fr-p-3v">{{ geoFallbackMsg }}</p>
    </div>
    <LeftCol :props="leftColProps" @EventShowLine = "ChangeShowLine2"></LeftCol>
    <div class="r_col fr-col-12 fr-col-lg-9">
      <div class="chart ml-lg">
        <div class="multiline_tooltip">
          <div class="tooltip_header"></div>
          <div class="tooltip_body">
            <div class="tooltip_value">
              <span class="tooltip_dot"></span>
            </div>
          </div>
        </div>
        <canvas :id="chartId"></canvas>
        <div v-for="index in nbIndicateurs" :key="index" class="flex fr-mt-3v fr-mb-1v" :style="style">
          <span class="legende_dot" v-bind:style="{'background-color':colors_legend[index-1]}" @click = "ChangeShowLine(index)"></span>
          <p v-bind:class="classLegend[index - 1]" v-bind:style="{'color':styleLegend[index - 1]}" @click = "ChangeShowLine(index)">
            {{capitalize(names[index - 1])}}
          </p>
        </div>
        <div v-for="index in periodsProps.date.length" :key="index" class="flex fr-mt-3v fr-mb-1v" :style="style">
          <span class="legende_dash_line1" v-bind:style="{'background-color': periodsProps.color}"></span>
          <span class="legende_dash_line2" v-bind:style="{'background-color': periodsProps.color}"></span>
          <p class="fr-text--sm fr-text--bold fr-ml-1v fr-mb-0">{{capitalize(periodsProps.name[index - 1])}}</p>
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
      periodsProps: {
        date: [],
        name: [],
        color: '#161616'
      },
      leftColProps: {
        localisation: '',
        currentValues: [],
        currentDate: '',
        names: [],
        evolcodes: [],
        evolvalues: [],
        isMap: false,
        date: '',
        colors_legend: [],
        legendDisplay: ['', '', ''],
        units: [],
        opacity: []
      },
      units: [],
      names: [],
      chart: undefined,
      loading: true,
      legendLeftMargin: 0,
      geoFallback: false,
      geoFallbackMsg: ''
    }
  },
  props: {
    indicateurs: String,
    periods: {
      type: String,
      default: null
    }
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
      this.indicateur_data.length = this.nbIndicateurs
      promises.length = 0
      for (let i = 0; i < this.nbIndicateurs; i++) {
        const promise = store.dispatch('getData', this.listIndicateurs[i]).then(data => {
          this.indicateur_data[i] = data
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
      if (this.periods !== null) {
        this.periodsProps.date.length = 0
        this.periodsProps.name.length = 0
        const periodsList = this.periods.split(' ')
        periodsList.forEach(function (p) {
          self.periodsProps.date.push(store.state.periods[p].date)
          self.periodsProps.name.push(store.state.periods[p].nom)
        })
      }

      this.showLine.length = this.nbIndicateurs
      this.showLine = this.showLine.fill(true)

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

      let geolevel = this.selectedGeoLevel
      let geocode = this.selectedGeoCode

      let geoObject
      const listGeoObject = []

      this.leftColProps.names.length = 0
      this.units.length = 0
      this.names.length = 0
      this.leftColProps.currentValues.length = 0
      this.leftColProps.evolcodes.length = 0
      this.leftColProps.evolvalues.length = 0
      this.leftColProps.units.length = 0
      this.leftColProps.opacity.length = 0
      this.labels.length = 0
      this.dataset.length = 0

      this.geoFallback = false
      this.geoFallbackMsg = ''

      let isRegionOk = true
      let isDepOk = true
      if (geolevel === 'departements') {
        for (let i = 0; i < this.nbIndicateurs; i++) {
          geoObject = this.indicateur_data[i][geolevel].find(obj => {
            return obj.code_level === geocode
          })
          isDepOk = (isDepOk) && (typeof geoObject !== 'undefined')
        }
        if (!isDepOk) {
          const depObj = store.state.dep.find(obj => {
            return obj.value === geocode
          })
          this.leftColProps.localisation = depObj.region
          geolevel = 'regions'
          geocode = depObj.region_value
          this.geoFallback = true
          this.geoFallbackMsg = 'Affichage des résultats au niveau régional, faute de données au niveau départemental'
        }
      }

      if (geolevel === 'regions') {
        for (let i = 0; i < this.nbIndicateurs; i++) {
          geoObject = this.indicateur_data[i][geolevel].find(obj => {
            return obj.code_level === geocode
          })
          isRegionOk = (isRegionOk) && (typeof geoObject !== 'undefined')
        }
        if (!isRegionOk) {
          this.leftColProps.localisation = 'France entière'
          geolevel = 'France'
          geocode = '01'
          this.geoFallback = true
          this.geoFallbackMsg = 'L\'affichage des données est uniquement disponible au niveau national'
        }
      }

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
        this.leftColProps.units.push(this.indicateur_data[i].unite_short)
        this.leftColProps.opacity.push(1)
        this.names.push(this.indicateur_data[i].nom)
        this.leftColProps.currentValues.push(geoObject.last_value)
        this.leftColProps.evolcodes.push(geoObject.evol_color)
        this.leftColProps.evolvalues.push(geoObject.evol_percentage)

        listGeoObject.push(geoObject)
      }
      this.leftColProps.date = this.convertDateToHuman(listGeoObject[0].last_date)
      this.leftColProps.currentDate = this.convertDateToHuman(listGeoObject[0].last_date)
      this.leftColProps.colors_legend = listColors.slice(0, this.nbIndicateurs)

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
      this.leftColProps.opacity.length = 0
      this.colors.forEach(function (col, index) {
        if (self.showLine[index]) {
          self.colors_legend.push(col)
          self.classLegend.push('fr-text--sm fr-text--bold fr-ml-1v fr-mb-0')
          self.styleLegend.push('#1E1E1E')
          self.leftColProps.opacity.push(1)
        } else {
          self.colors_legend.push(chroma(col).alpha(0.3).hex())
          self.classLegend.push('fr-text--sm fr-ml-1v fr-mb-0')
          self.styleLegend.push('#E7E7E7')
          self.leftColProps.opacity.push(0.33)
        }
      })
      this.chart.update()
    },
    ChangeShowLine2 (payload) {
      this.ChangeShowLine(payload.index + 1)
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
        plugins: [{
          afterDatasetDraw: function (chart, args, options) {
            if (self.periods !== null) {
              self.periodsProps.date.forEach(function (d) {
                const ctx = chart.ctx
                const xAxis = chart.scales['x-axis-0']
                const yAxis = chart.scales['y-axis-0']

                const index = self.labels.indexOf(self.convertDateToHuman(d))
                const x = xAxis.getPixelForTick(index)

                ctx.beginPath()
                ctx.moveTo(x, yAxis.bottom)
                ctx.strokeStyle = self.periodsProps.color
                ctx.lineWidth = '2'
                ctx.setLineDash([5, 3])
                ctx.lineTo(x, yAxis.top)
                ctx.stroke()
              })
            }
          }
        }],
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
            displayColors: false,
            backgroundColor: '#6b6b6b',
            enabled: false,
            callbacks: {
              label: function (tooltipItems) {
                const label = []
                self.dataset.forEach(function (set, i) {
                  if (self.showLine[i]) {
                    const int = set.data[tooltipItems.index]
                    label.push(int + ' ' + self.units[i])
                  }
                })
                return label
              },
              title: function (tooltipItems) {
                return tooltipItems[0].label
              },
              labelTextColor: function (tooltipItems) {
                const color = []
                self.colors_legend.forEach(function (col, i) {
                  if (self.showLine[i]) {
                    color.push(col)
                  }
                })
                return color
              }
            },
            custom: function (context) {
              // Tooltip Element
              const tooltipEl = self.$el.querySelector('.multiline_tooltip')

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

                const color = tooltipModel.labelTextColors[0]
                const divValue = self.$el.querySelector('.tooltip_value')

                const nodeName = self.$el.querySelector('.tooltip_dot').attributes[0].nodeName
                divValue.innerHTML = ''
                bodyLines[0].forEach(function (line, i) {
                  divValue.innerHTML += '<span ' + nodeName + '= "" class="tooltip_dot" style = "background-color:' + color[i] + '"></span>' + ' ' + line + '<br>'
                })
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
          border-radius: 50%;
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
      max-width:100%;
    }
    .multiline_tooltip{
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
        padding-bottom: 0.25rem;
        padding-top:0.25rem;
      }
      .tooltip_body{
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        padding-top:0.25rem;
        .tooltip_dot{
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
