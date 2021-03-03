import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endImport:false,
    data:{}
  },
  mutations: {
    endImport (state,value) {
      state.endImport = value
    },
    initData (state,data) {
      state.data = data
    },
  }
})
