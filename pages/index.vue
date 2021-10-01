/* eslint-disable */
<template>
  <v-app id="app" class="map">
    <v-container>
      <v-row justify="center">
        <v-col cols="12">
          <GmapMap
            ref="gmp"
            :center="center"
            :zoom="zoom"
            style="width: 100%; height: 600px"
          >
            <GmapMarker
              v-for="(m, index) in setDetails()"
              :key="m.name"
              :title="m.name"
              :position="{ lat: parseFloat(m.latitude), lng: parseFloat(m.longitude) }"
              :animation="Number(m.acceptable)"
              :clickable="true"
              :draggable="false"
              :optimized="false"
              :z-index="0"
              :icon="{url: markerIcon2(m.marker_icon),
                      scaledSize: { width: 80, height: 80, f: 'px', b: 'px' },
                      anchor: { x:25, y:18}}"
              @click="onClickMarker(index, m)"
            />
            <GmapMarker
              v-for="(m, index) in setDetails()"
              :key="index"
              :title="m.name"
              :position="{ lat: parseFloat(m.latitude), lng: parseFloat(m.longitude) }"
              :animation="Number(m.acceptable)"
              :clickable="true"
              :draggable="false"
              :optimized="false"
              :z-index="1"
              :icon="{url: markerIcon(m.marker_icon),
                      scaledSize: { width: 30, height: 30, f: 'px', b: 'px' },
                      anchor: { x:0, y:0}}"
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
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-btn-toggle
          v-model="toggle_exclusive"
          color="primary"
          multiple
        >
          <v-col cols="12">
            <v-btn
              v-for="(tag, i) in tagsIndex"
              :key="i"
              class="ma-1"
              color="#001F47"
              dark
              @click="
                activeCheck(tag, i)
              "
            >
              {{ tag.tag }}
            </v-btn>
          </v-col>
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col cols="12">
          <ul>
            <li
              v-for="(name, i) in selectTags"
              :key="i"
            >
              {{ name.tag }}
            </li>
          </ul>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="setDetails()"
            sort-by="name"
            class="elevation-1"
          >
            <template #[`item.tags`]="{ item }">
              <v-btn
                v-for="(tag,i) in item.tags"
                :key="i"
                class="ma-1"
                sm
                disabled
              >
                {{ tag.tag }}
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
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
      finish_host: [],
      finish: [],
      result: [],
      serch: [],
      sample: [],
      selectTags: [],
      tagsAll: [],
      tagsIndex: [],
      toggle_exclusive: [],
      tag_index: {},
      selectedTemplate: false,
      selectedItem: false,
      color: null,
      dialog: false,
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
      },
      headers: [
        {
          text: '地図上に表示されているお店名',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        {
          text: 'タグ',
          value: 'tags'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'user_information/getUser'
    })
  },
  watch: {
    toggle_exclusive (val, old) {
      this.selectTag()
    }
  },
  mounted () {
    this.$axios
      .get('/api/v1/host_details.json')
      .then(response => (this.hostDetails = response.data)
      )
    this.$axios
      .get('/api/v1/tags')
      .then((res) => {
        this.tagsAll = res.data.tags
        this.tagsIndex = res.data.select_tags
      })
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
    markerIcon2 (i) {
      return '/img/bloon1.png'
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
      this.method3()
    },
    method2 (i) {
      this.selectTags.push(this.tagsIndex[i])
    },
    method3 () {
      this.serch = []
      this.selectTags.forEach((item) => {
        this.sample = this.tagsAll.filter(tag => tag.tag === item.tag)
        this.method5()
      })
      this.method6()
      this.method7()
    },
    method5 () {
      if (this.sample) {
        this.sample.forEach((item) => {
          this.serch.push(item)
        })
      } else {
        console.log(5)
      }
    },
    method6 () {
      this.result = this.serch.filter((element, index, self) =>
        self.findIndex(e => e.host_detail_id === element.host_detail_id) === index
      )
    },
    method7 () {
      this.finish_host = []
      this.result.forEach((item) => {
        this.finish = this.hostDetails.filter(h => h.id === item.host_detail_id)
        this.method8()
      })
    },
    method8 () {
      if (this.finish[0]) {
        this.finish_host.push(this.finish[0])
      } else {
        console.log(6)
      }
    },
    setDetails () {
      if (this.finish_host[0]) {
        console.log(1)
        return this.finish_host
      } else {
        console.log(2)
        return this.hostDetails
      }
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
