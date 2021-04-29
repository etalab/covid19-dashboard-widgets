<template>

  <div>

    <div class="list_container">
      <p class="rf-hint-text" id="select-hint-desc-hint">Filter par région</p>
      <select class="rf-select" id="select-reg" name="select" @change="changeGeoLevel('regions',$event)">
          <option value="" selected disabled hidden>ex : Bourgogne-France-Comté</option>
          <option v-for="d in regions" :value="d['value']" :key="d['value']">{{d['label']}}</option>
      </select>
    </div>

    <div class="list_container">
      <p class="rf-hint-text" id="select-hint-desc-hint">Filter par département</p>

      <select class="rf-select" id="select-dep" name="select" @change="changeGeoLevel('departements',$event)">
          <option value="" selected disabled hidden>ex : Côte-d'Or</option>
          <option v-for="d in departements" :value="d['value']" :key="d['value']">{{d['label']}}</option>
      </select>
    </div>

  </div>

</template>

<script>
import store from '@/store'
export default {
  name: 'GeoList',
  data(){
    return {
      departements:[],
      regions:[]
    }
  },
  props: {
    
  },
  computed: {
    dataImport() {
      return store.state.endImport
    },
  },
  methods: {
    populateLists(){
      var self = this

      store.state.dep.forEach(function (dep) {
        var depObj = { "label":dep["label"],"value":dep["value"]}
        self.departements.push(depObj)
      })
      store.state.reg.forEach(function (reg) {
        var regObj = { "label":reg["label"],"value":reg["value"]}
        self.regions.push(regObj)
      })
    },
    changeGeoLevel(level,event){


      var originalObj
      var geoLabel

      if(level=="departements"){
        document.querySelector('#select-reg').value = ""
        originalObj = store.state.dep.find(obj => {
          return obj["value"] === event.target.value
        })
        geoLabel = originalObj["label"]
      }else{
        document.querySelector('#select-dep').value = ""
        originalObj = store.state.reg.find(obj => {
          return obj["value"] === event.target.value
        })
        geoLabel = originalObj["label"]
      }

      store.commit("setUserChoices",{level:level,code:event.target.value,label:geoLabel})

    }
  },
  watch:{
    dataImport:function(){
      this.populateLists()
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";
  @import "../../css/dsfr.min.css";
  
  select{
    width: 250px;
  }
  h4{
    margin-bottom:0px;
  }
  .list_container{
    display: block;
    margin-bottom: 30px;
  }
</style>
