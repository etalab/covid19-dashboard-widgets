import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endImport:false,
    user:{
      selectedGeoLevel:"national",
      selectedGeoCode:undefined
    },
    structure:{},
    territoireData:{
      national:{},
      regional:{},
      departemental:{}
    }
  },
  mutations: {
    endImport (state,value) {
      state.endImport = value
    },
    initStructure (state,data) {
      state.structure = data
    },
    setTerritoireData (state,payload) {
      state.territoireData[payload.level] = payload.data
    },
    setUserChoices (state,payload){
      state.user.selectedGeoLevel = payload.level
      state.user.selectedGeoCode = payload.code
    }
  }
})
