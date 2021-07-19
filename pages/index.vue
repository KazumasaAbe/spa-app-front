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

/* eslint-disable */

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
          animation: Animation.BOUNCE
        },
        {
          title: '遠野旅の産地直売所',
          position: { lat: 39.33159282407645, lng: 141.53075750707873 }
        }
      ]
    }
  }

}

</script>

/* eslint-enable */
