import Vue from 'vue'

import store from './store'
import { getData } from './import.js'

import MyComponent from './components/MyComponent'

import vueCustomElement from 'vue-custom-element'
Vue.use(getData(store))

Vue.config.productionTip = false

Vue.use(vueCustomElement)

Vue.customElement('my-component', MyComponent)