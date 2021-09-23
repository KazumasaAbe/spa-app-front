/* eslint-disable */
<template>
  <v-app id="app" class="map">
    <v-container>
      <v-row justify="center">
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
            :icon="{url: markerIcon(m.marker_icon),
                    scaledSize: { width: 30, height: 30, f: 'px', b: 'px' }}"
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
        <v-row>
          <v-btn-toggle
            v-model="toggle_exclusive"
            color="primary"
            multiple
          >
            <v-col cols="12">
              <v-btn
                v-for="(tag, i) in tags"
                :key="i"
                class="ma-1"
                color="success"
                @click="
                  activeCheck(tag, i)
                "
              >
                {{ tag.tag }}
              </v-btn>
            </v-col>
          </v-btn-toggle>
          <span>{{ toggle_exclusive }}</span>
          <v-btn
            @click="selectTag()"
          >
            check
          </v-btn>
        </v-row>
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
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  auth: false,
  data () {
    return {
      anyTags: {},
      manyTags: [],
      tag_name: '',
      selectDetails: [],
      selectTags: [],
      toggle_exclusive: [],
      tag_index: {},
      selectedTemplate: false,
      selectedItem: false,
      color: null,
      dialog: false,
      tags: {},
      marker: {},
      hostDetails: [],
      selecetDetails: [],
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
  computed: {
    ...mapGetters({
      user: 'user_information/getUser'
    })
  },
  mounted () {
    this.$axios
      .get('/api/v1/host_details.json')
      .then(response => (this.hostDetails = response.data)
      )
    this.serchDetails = this.hostDetails
    this.$axios
      .get('/api/v1/tags')
      .then(response => (this.tags = response.data)
      )
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
    },
    markerIcon (i) {
      if (i === '') {
        return '/img/kappa.png'
      } else {
        return i
      }
    },
    activeCheck (tag, i) {
      this.selectedTemplate = tag
      this.selectedIndex = i
    },
    colorCheck (tag, i) {
      return this.selectedTemplate && i === this.selectedIndex ? 'warning' : null
    },
    selectTag () {
      this.selectTags = []
      this.toggle_exclusive.forEach((val) => {
        this.method2(val)
      })
    },
    method2 (i) {
      this.selectTags.push(this.tags[i])
      console.log(this.selectTags)
      this.method4()
    },
    method4 () {
      if (this.toggle_exclusive.length === 0) {
        this.serchDetails = this.hostDetails
      } else {
        this.serchDetails = []
        this.selectTags.forEach((item) => {
          this.tag_name = item
          this.method3()
        })
      }
    },
    method3 () {
      this.hostDetails.forEach((item) => {
        this.manyTags = item.tags
        this.anyTags = this.manyTags[0]
        console.log(this.anyTags)
        if (item.tags.includes(this.tag_name)) {
          this.serchDetails.push(this.item)
          console.log(this.serchDetails)
        } else {
          console.log(false)
        }
      })
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
