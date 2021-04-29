import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endImport:false,
    data:{},
    dep:[],
    reg:[],
    user:{
      selectedGeoLevel:"France",
      selectedGeoCode:"01",
      selectedGeoLabel:"France"
    },
  },
  mutations: {
    endImport (state,value) {
      state.endImport = value
    },
    initData (state,data) {
      state.data = data
    },
    initDep (state,dep) {
      state.dep = dep
    },
    initReg (state,reg) {
      state.reg = reg
    },
    setUserChoices (state,payload){
      state.user.selectedGeoLevel = payload.level
      state.user.selectedGeoCode = payload.code
      state.user.selectedGeoLabel = payload.label
    }
  }
})
