import Vue from 'vue'

import store from './store'
import HelloWorld from './components/HelloWorld'
import GoodBye from './components/GoodBye'

Vue.config.productionTip = false

import vueCustomElement from 'vue-custom-element'

Vue.use(vueCustomElement)

HelloWorld.store = store
GoodBye.store = store

Vue.customElement('hello-world', HelloWorld)
Vue.customElement('good-bye', GoodBye)
