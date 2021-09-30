<template>
  <div>
    <h1>{{customtext}}</h1>
  </div>
</template>

<script>
import store from '@/store'
import { mixin } from '@/utils.js'
export default {
  name: 'MyComponent',
  mixins: [mixin],
  data(){
    return {
      
    }
  },
  props: {
    customtext: String
  },
  computed: {
    dataImport() {
      return store.state.endImport
    },
  },
  methods: {

  },

  watch:{
    dataImport:function(){
      console.log("dataImport over")
      console.log(store.state.myData)
    },
  },

  created(){
    console.log("MyComponent created")
  }

}
</script>

<style scoped lang="scss">

</style>