<template>
  <div class="databox">
    <div class="box-header rf-text--sm">
        <span>{{title}}</span>
    </div>
    <span class="number rf-text--lg">{{convertStringToLocaleNumber(record[indicateur])}}</span>
    <span class="rf-text">{{unit}}</span>
    <span class="date rf-text">Dernière mise à jour : {{convertDateToHuman(record["date"])}}</span>
    <a class="rf-link" href="https://www.data.gouv.fr/fr/datasets/donnees-hospitalieres-relatives-a-lepidemie-de-covid-19/" target="_blank">Voir les données sur data.gouv.fr</a>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'DataBox',
  data(){
    return {
      record:{}
    }
  },
  props: {
    indicateur: String,
    title: String,
    unit: String
  },
  computed: {
    dataImport() {
      return store.state.endImport
    },
  },
  methods: {

    convertStringToLocaleNumber(string){
      return parseInt(string).toLocaleString()
    },

    convertDateToHuman(string){
      let date = new Date(string)
      return date.toLocaleDateString()
    }
    
  },

  watch:{
    dataImport:function(){
      this.record = store.state.data[Object.keys(store.state.data)[Object.keys(store.state.data).length-2]]

    },
  },

  created(){
    
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";

  .databox{
    width: 230px;
    height: 125px;
    background-color: #f2f2f9;
    position: relative;
    padding-bottom: 10px;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 50px;
    .box-header{
      background-color: #e5e5f4;
      margin-bottom: 15px;
      span{
        margin-left: 15px;
      }
    }
    span{
      display: block;
      margin-left: 15px;
      &.date{
        font-size:12px;
        position: absolute;
        bottom: 8px;
      }
    }
    a{
      position: absolute;
      bottom: -40px;
      text-decoration: none;
      color:black;
      font-size: 11px;
    }
  }

  @media (max-width: 768px) {

  }


</style>
