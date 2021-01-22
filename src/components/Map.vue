<template>
  <div class="hello">
    <MglMap class="map" :mapStyle="mapStyle" :center="center" :zoom="zoom" :drag-pan="false" :scroll-zoom="false" />
  </div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css'
import Mapbox from "mapbox-gl"
import { MglMap } from "v-mapbox"

export default {
  components: {
    MglMap
  },
  data () {
    return {
      mapStyle: 'https://etalab-tiles.fr/styles/osm-bright/style.json',
      center: [1.7, 46.9],
      zoom: 4.4,
    }
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  }
}
</script>

<style>
.mapboxgl-map {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.map {
  width: 100%;
  height: 500px;
}
</style>
