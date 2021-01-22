<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="increment">J'en veux plus</button>
    <code>{{ count }}</code>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    increment() {
      store.commit('increment')
      const event = new CustomEvent("hello:increment", { detail: store.state.count })
      window.dispatchEvent(event)
    },
  }
}
</script>

<!-- Global style -->
<style>
.hello {
  border: solid #42b983;
  margin: 5px;
  padding: 5px;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
