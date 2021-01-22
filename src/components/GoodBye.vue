<template>
  <div class="hello">
    <h1>Goodbye stranger {{ msg }}</h1>
    <p><code>{{ count }}</code></p>
    <p><a href="#">LIEN GODDBY</a></p>
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
}
</script>

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
  color:red;
}
</style>
