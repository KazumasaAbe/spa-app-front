/* eslint-disable */
<template>
  <div class="map">
    <GmapMap
      :center="center"
      :zoom="zoom"
      style="width: 100%; height: 600px"
    >
      <GmapMarker
        v-for="(m, i) in hostDetails"
        :key="i"
        :title="m.name"
        :position="{ lat: parseFloat(m.latitude), lng: parseFloat(m.longitude) }"
        :animation="Number(m.acceptable)"
        :icon="{url: '/img/kappa.png', scaledSize: { width: 40, height: 40, f: 'px', b: 'px' }}"
        @click="onClickMarker(index, m)"
      />
    </GmapMap>
    <nuxt-link to="/search">
      検索画面に戻る
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hostDetails: [],
      center: { lat: 39.3321782595909, lng: 141.53094514522962 },
      zoom: 17,
      infoWindowPos: null,
      infoWinOpen: false,
      infoContent: {
        imageurl: null,
        title: null,
        address: null
      },
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      }
    }
  },

  mounted () {
    this.$axios
      .get('/api/v1/host_details.json')
      .then(response => (this.hostDetails = response.data))
  }
}
</script>

/* eslint-enable */
