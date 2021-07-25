/* eslint-disable */
<template>
  <div class="map">
    <GmapMap
      :center="center"
      :zoom="zoom"
      style="width: 100%; height: 600px"
    >
      <GmapMarker
        v-for="(m, index) in markers"
        :key="index"
        :title="m.title"
        :position="m.position"
        :animation="m.animation"
        :icon="m.pinicon"
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
      },
      markers: [
        {
          title: '遠野市役所',
          position: { lat: 39.33065351795713, lng: 141.5314473040145 },
          animation: 1,
          pinicon: {
            url: '/img/kappa.png',
            scaledSize: { width: 40, height: 40, f: 'px', b: 'px' }
          }
        },
        {
          title: '遠野旅の産地直売所',
          position: { lat: 39.33159282407645, lng: 141.53075750707873 },
          animation: 1,
          pinicon: {
            url: '/img/kappa.png',
            scaledSize: { width: 40, height: 40, f: 'px', b: 'px' }
          }
        }
      ]
    }
  }

}
</script>

/* eslint-enable */
