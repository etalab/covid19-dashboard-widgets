<template>
  <div class="databox">
  
    <div class="indicateur_container" v-for="i in indicateurs" :key="i['id_indicateur_fr']">
      
      <h4 class="rf-h4">{{i["nom"]}}</h4>

      <div class="geobox_container">
        <span class="rf-text">Les résultats pour <b>{{geoLevelLabel}}</b></span>
      </div>

      <div class="databox_container">
        
        <div class="box" data-value="initiale">      
          <div class="box_header rf-text--sm">
            <span>En {{formatDate(i["initial_value_date"],"month")}}</span>
          </div>
          <span class="rf-text--lead">{{i["initial_value"]}}</span>
          <span class="rf-text"> {{i["unit"]}}</span>
        </div>

        <div class="box" data-value="latest">
          <div class="box_header rf-text--sm">
            <span>En {{formatDate(i["latest_value_date"],"month")}}</span>
          </div>
          <span class="rf-text--lg">{{i["latest_value"]}}</span>
          <span class="rf-text"> {{i["unit"]}}</span>
          
        </div>

        <div class="box" data-value="target">
          <div class="box_header rf-text--sm">   
            <span>Cible à atteindre en {{formatDate(i["target_date"],"year")}}</span>
          </div>
          <span class="rf-text--lg">{{i["target"]}}</span>
          <span class="rf-text"> {{i["unit"]}}</span>
          <div class="progress_bar">
            <span class="rf-text--xs">{{i["target_percentage"]}}%</span>
            <div class="progress_bar_inner" :style="getProgressBarWidth(i['target_percentage'])"></div>
          </div>
          
        </div>
      </div>
    </div>
    <code><b>logs</b></code><br>
    <code>OVQ sélectionné : {{ovqStructure['nom_ovq']}}</code><br>
    <code>Niveau sélectionné : {{selectedGeoLevel}} ({{selectedGeoCode}})</code>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'DataBox',
  data(){
    return {
      ovqStructure:{},
      ovqDataset:{},
      indicateurs:{}
    }
  },
  props: {
    ovqid: String
  },
  computed: {
    dataImport() {
      return store.state.endImport
    },
    selectedGeoLevel () {
      return store.state.user.selectedGeoLevel
    },
    selectedGeoCode () {
      return store.state.user.selectedGeoCode
    },
    geoLevelLabel (){
      let label
      if(this.selectedGeoLevel=="national"){
        label = "la France entière"
      }else if(this.selectedGeoLevel=="regional"){
        label = "la région "+this.selectedGeoCode
      }else{
        label = "le département "+this.selectedGeoCode
      }
      return label
    }
  },
  methods: {
    
    getOvqData(){
      var self = this

      // get all structure for selected ovq
      this.ovqStructure = store.state.structure.find(ovqStructure => ovqStructure['id_ovq'] == this.ovqid)
      
      // initialize an object for each indicateurs of selected ovq
      this.ovqStructure["indicateurs"].forEach(function(indic){
        self.indicateurs[indic["id_indicateur_fr"]] = {}
        self.indicateurs[indic["id_indicateur_fr"]]["nom"] = indic["nom_indicateur"]
        self.indicateurs[indic["id_indicateur_fr"]]["unit"] = indic["odm_kpi_unit"]
      })

      this.updateOvqData()

    },

    updateOvqData(){
      
      var self = this

      // get data at the selected geo level for every ovq
      let ovqObj
      let regionalData = store.state.territoireData.regional
      let departementalData = store.state.territoireData.departemental

      switch(this.selectedGeoLevel){
        case "national":
          ovqObj = store.state.territoireData.national[0]
          break
        case "regional":
          ovqObj = regionalData.find(regionalData => regionalData['reg'] == this.selectedGeoCode)
          break
        case "departemental":
          ovqObj = departementalData.find(departementalData => departementalData['dep'] == this.selectedGeoCode)
          break
      }
      // get data for selected geo level of selected ovq
      this.ovqDataset = ovqObj["ovq"].find(ovqDataset => ovqDataset['id_ovq'] == this.ovqid);

      // get data for indicateurs of selected ovq
      let indicateursJSON = this.ovqDataset["indicateurs"]

      // loop into propreties of each indicateurs and store them in the corresponding initialized objects
      indicateursJSON.forEach(function (indicateurPropreties) {
        let dataIndicateur = indicateurPropreties[Object.keys(indicateurPropreties)[0]]
        let indicateurID = Object.keys(indicateurPropreties)
        for (const [prop, value] of Object.entries(dataIndicateur[0])) {
         self.indicateurs[indicateurID][prop] = value  
        }
      }) 

    },

    formatDate(date,level){
      let newDate = new Date(date)
      let dateOptions
      if(level == "month"){
        dateOptions = {  year: 'numeric', month: 'long' }
      }else{
        dateOptions = {  year: 'numeric'}
      }
      return newDate.toLocaleDateString('fr-FR',dateOptions)
    },

    getProgressBarWidth(value){
      return "width:"+value+"%";
    }

  },

  watch:{
    dataImport:function(){
      this.getOvqData()
    },
    selectedGeoCode:function(){
      this.updateOvqData()
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  // @import "../../css/overload-fonts.css";

  .indicateur_container{
    margin-bottom: 30px;
  }

  h4{
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .geobox_container{
    width: 100%;
    max-width: 700px;
    box-sizing: border-box;
    height: 35px;
    background-color: #f5f5f5;
    border-radius: 35px;
    margin-bottom: 15px;
    padding-left: 20px;
    padding-top: 5px;
  }

  .databox_container{
    width: 100%;
    max-width: 700px;
    display: flex;
    justify-content: space-between;
    .box{
      display: block;
      width: 30%;
      padding-left: 20px;
      padding-bottom: 15px;
      .box_header{
        margin-bottom: 20px;
      }
      .progress_bar{
        width: 80%;
        height: 20px;
        background-color:#bbbee1;
        position: relative;
        margin-top: 20px;
        .progress_bar_inner{
          background-color: #3949ab;
          height: 100%;
        }
        span{
          color:white;
          position:absolute;
          margin-left:10px;
        }
      }
      &[data-value="initiale"]{
        background-color: rgb(255, 249, 248);    
        .box_header{
          background-color: rgb(255, 244, 242);
        }
      }
      &[data-value="latest"]{
        background-color: rgb(243, 250, 247);
        .box_header{
          background-color: rgb(231, 245, 239);
        }
      }
      &[data-value="target"]{
        background-color: rgb(242, 242, 249);
        .box_header{
          background-color: rgb(229, 229, 244);
        }
      }
    }
  }

  @media (max-width: 728px) {

    .databox_container{
      flex-direction: column;
      .box{
        width: 100%;
      }
    }

  }


</style>
