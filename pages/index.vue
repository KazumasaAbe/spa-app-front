/* eslint-disable */
<template>
  <v-app id="app" class="map">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="10"
        >
          <GmapMap
            ref="gmp"
            :center="center"
            :zoom="zoom"
            style="width: 100%; height: 600px"
          >
            <GmapMarker
              v-for="(m, index) in hostDetails"
              :key="index"
              :title="m.name"
              :position="{ lat: parseFloat(m.latitude), lng: parseFloat(m.longitude) }"
              :animation="Number(m.acceptable)"
              :clickable="true"
              :draggable="false"
              :icon="{url: '/img/kappa.png', scaledSize: { width: 40, height: 40, f: 'px', b: 'px' }}"
              @click="onClickMarker(index, m)"
            />
            <GmapInfoWindow
              :options="infoOptions"
              :position="infoWindowPos"
              :opened="infoWinOpen"
              @closeclick="infoWinOpen = false"
            >
              <p style="color: #000">
                {{ marker.name }}
              </p>
            </GmapInfoWindow>
          </GmapMap>
          <v-dialog
            v-model="dialog"
            max-width="800px"
          >
            <v-card>
              <v-card-title>
                <span class="layout justify-center">{{ marker.name }}</span>
                <v-icon
                  large
                  color="darken-2"
                  @click="closeDialog"
                >
                  mdi-backspace-outline
                </v-icon>
              </v-card-title>
              <v-card-text aligin-center>
                <v-col
                  cols="12"
                >
                  <span v-if="marker.acceptable_date">{{ marker.acceptable_date }}</span>
                  <span v-else>情報はありません</span>
                </v-col>
              </v-card-text>
              <v-card-text>
                <v-col
                  cols="12"
                >
                  <span v-if="marker.rate">必要カッパ数：{{ marker.rate }} カッパ</span>
                  <span v-else>必要カッパの情報はありません</span>
                </v-col>
              </v-card-text>
              <v-card-text>
                <v-col
                  cols="12"
                >
                  <span v-if="marker.description">{{ marker.description }}</span>
                  <span v-else>店舗情報はありません</span>
                </v-col>
              </v-card-text>
              <v-card-text>
                <v-col
                  cols="12"
                >
                  <v-btn
                    :href="marker.link"
                    block
                    color="primary"
                    class="layout justify-center"
                  >
                    店舗詳細情報
                  </v-btn>
                </v-col>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  auth: false,
  data () {
    return {
      dialog: false,
      marker: {},
      hostDetails: [],
      center: { lat: 39.33061151045439, lng: 141.53013894672827 },
      zoom: 16,
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
  },
  methods: {
    onClickMarker (index, marker) {
      this.$refs.gmp.panTo({ lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) })
      this.infoWindowPos = { lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) }
      this.marker = marker
      this.infoWinOpen = false
      this.dialog = true
    },
    closeDialog () {
      this.dialog = false
    }
  }
}
</script>

<style scoped>
  .map {
    margin-top:50px;
  }
</style>

/* eslint-enable */
