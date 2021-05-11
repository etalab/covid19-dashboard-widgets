import Vue from 'vue'

import store from './store'
import { getData } from './import.js'
Vue.use(getData(store))

//import Map from './components/Map'
import DataBox from './components/DataBox'
import LineChart from './components/LineChart'
import MultiLineChart from './components/MultiLineChart'
import BarChart from './components/BarChart'
import GeoList from './components/GeoList'

Vue.config.productionTip = false

import vueCustomElement from 'vue-custom-element'

Vue.use(vueCustomElement)

//Vue.customElement('da-map', Map)
Vue.customElement('data-box', DataBox)
Vue.customElement('line-chart', LineChart)
Vue.customElement('multiline-chart', MultiLineChart)
Vue.customElement('bar-chart', BarChart)
Vue.customElement('geo-list', GeoList)
