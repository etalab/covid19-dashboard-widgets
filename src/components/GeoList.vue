<template>

  <div class="fr-mb-4w fr-mt-3v fr-mt-md-0">
    <div class="fr-mb-3w">
      <p class="fr-text--sm fr-mb-1v" id="select-hint-desc-hint">Filtrer par région</p>
      <select class="fr-select fr-text--sm fr-mb-0 fr-py-1v" id="select-reg" name="select" @change="changeGeoLevel('regions',$event)">
        <option value="" selected disabled hidden>ex : Normandie</option>
        <option v-for="d in regions" :value="d['value']" :key="d['value']">{{d['label']}}</option>
      </select>
    </div>

    <div class="fr-mb-3w">
      <p class="fr-text--sm fr-mb-1v" id="select-hint-desc-hint">Filtrer par département</p>
      <select class="fr-select fr-text--sm fr-mb-0 fr-py-1v" id="select-dep" name="select" @change="changeGeoLevel('departements',$event)">
        <option value="" selected disabled hidden>ex : Manche</option>
        <option v-for="d in departements" :value="d['value']" :key="d['value']" v-bind:style="{'display':d['display']}">{{d['label']}}</option>
      </select>
    </div>
    <button @click="resetGeoFilters()" class="fr-link fr-link--sm fr-fi-close-circle-line fr-link--icon-left">Réinitialiser</button>

  </div>

</template>

<script>
import store from '@/store'
export default {
  name: 'GeoList',
  data () {
    return {
      departements: [],
      regions: []
    }
  },
  props: {

  },
  computed: {
    selectedGeoLevel () {
      return store.state.user.selectedGeoLevel
    }
  },
  methods: {
    populateLists () {
      const self = this

      store.state.dep.forEach(function (dep) {
        const depObj = { label: dep.label, value: dep.value }
        self.departements.push(depObj)
      })
      store.state.reg.forEach(function (reg) {
        const regObj = { label: reg.label, value: reg.value }
        self.regions.push(regObj)
      })
    },
    changeGeoLevel (level, event) {
      let originalObj
      let geoLabel
      const self = this

      if (level === 'departements') {
        // document.querySelector('#select-reg').value = ''
        originalObj = store.state.dep.find(obj => {
          return obj.value === event.target.value
        })
        geoLabel = originalObj.label
      } else {
        document.querySelector('#select-dep').value = ''
        originalObj = store.state.reg.find(obj => {
          return obj.value === event.target.value
        })
        geoLabel = originalObj.label

        this.departements.length = 0
        store.state.dep.forEach(function (d) {
          let display = 'none'
          if (d.region_value === event.target.value) {
            display = ''
          }
          const depObj = { label: d.label, value: d.value, display: display }
          self.departements.push(depObj)
        })
      }

      store.commit('setUserChoices', { level: level, code: event.target.value, label: geoLabel })
    },

    resetGeoFilters () {
      document.querySelector('#select-reg').value = ''
      document.querySelector('#select-dep').value = ''
      store.commit('setUserChoices', { level: 'France', code: '01', label: 'France entière' })
      this.populateLists()
    }
  },
  watch: {
    selectedGeoLevel: function () {
      if (this.selectedGeoLevel === 'departements') {
        for (let i = 0; i < this.departements.length; i++) {
          this.departements[i].display = ''
        }
      }
    }
  },

  created () {
    this.populateLists()
  }
}
</script>

<style scoped lang="scss">

.fr-select {
  box-shadow: inset 0 -2px 0 0 #000091;
}

button.fr-link {
  border: solid 1px #e5e5e5;
}

</style>
