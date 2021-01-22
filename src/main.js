import Vue from 'vue'

import store from './store'
import HelloWorld from './components/HelloWorld'
import GoodBye from './components/GoodBye'
import Map from './components/Map'

Vue.config.productionTip = false

import vueCustomElement from 'vue-custom-element'

Vue.use(vueCustomElement)

// do we need this since we're using a singleton in each component?
HelloWorld.store = store
GoodBye.store = store

Vue.customElement('hello-world', HelloWorld)
Vue.customElement('good-bye', GoodBye)
Vue.customElement('da-map', Map)
