<template>
  <div>
    <div class="widget">
      <div class="widgetHeader">
        <div class="titleHeader">
          <h3>Nouveaux jeux de données créés</h3>
        </div>
        <div class="buttonsHeader">
          <div v-for="item in buttons" @click='changePeriod(item)' v-bind:key="item.label" :class="item.value === nbDatasetSelected ? 'buttonHeader buttonHeaderSelected' : 'buttonHeader'">{{ item.label }}</div>
        </div>
      </div>
      <br />
      <div class="chart_container" style="max-width: 700px; margin-left: 30px;">
        <bar-chart-basic :indicateur="indicateurDatasetSelected"></bar-chart-basic>
      </div>
    </div>
  </div>
</template>
<script>
import BarChartBasic from '@/components/BarChartBasic'

export default {
  name: 'DatagouvWidget',
  components: {
    BarChartBasic
  },
  mixins: [],
  data () {
    return {
      buttons: [
        {
          label: 'Quotidien',
          value: 0,
          indicateur: 'nb_datasets-daily'
        },
        {
          label: 'Hebdomadaire',
          value: 1,
          indicateur: 'nb_datasets-weekly'
        },
        {
          label: 'Mensuel',
          value: 2,
          indicateur: 'nb_datasets-monthly'
        }
      ],
      nbDatasetSelected: 0,
      indicateurDatasetSelected: 'nb_datasets-daily'
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    changePeriod (item) {
      this.nbDatasetSelected = item.value
      this.indicateurDatasetSelected = item.indicateur
      console.log(this.indicateurDatasetSelected)
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped lang="scss">
.widget{
  min-width: 800px;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ebebeb;
}
.widgetHeader{
  width: 100%;
  min-height: 100px;
}
.titleHeader{
  width: 100%;
  color: #000091;
}
.buttonsHeader{
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.buttonHeader{
  padding: 10px;
  border: 1px solid #ebebeb;
  margin-right: 10px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
}

.buttonHeader:hover{
  background-color: #000091;
  color: white;
}
.buttonHeaderSelected{
  background-color: #000091;
  color: white;
}
</style>
