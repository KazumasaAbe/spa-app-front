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
              :key="index"
              :title="m.name"
              :position="{ lat: parseFloat(m.latitude), lng: parseFloat(m.longitude) }"
              :animation="Number(m.acceptable)"
              :clickable="true"
              :draggable="false"
              :optimized="false"
              :z-index="1"
              :icon="{url: markerIcon(m.marker_icon),
                      scaledSize: { width: 35, height: 35, f: 'px', b: 'px' },
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
      <v-row
        justify="center"
        class="ma-2"
      >
        <v-btn-toggle
          v-model="toggle_exclusive"
          color="primary"
          multiple
        >
          <v-col cols="12" class="tags_select">
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
        <!-- <v-select
          v-model="toggle_exclusive"
          item-text="tag"
          :items="tagsIndex"
          :menu-props="{ maxHeight: '200' }"
          label="タグを選択してください"
          multiple
          hint="Pick your Detail"
          persistent-hint
        />-->
      </v-row>
      <!-- selectverの時抜く-->
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
        <v-col>
          <v-divider class="mb-3" />
          <h3>地図上に表示されているお店</h3>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          cols="2"
          xs="1"
          sm="2"
          md="1"
          xl="1"
          class="pr-3"
        >
          <img src="/img/kappa.png" width="100%">
        </v-col>
        <v-col
          cols="10"
          sm="7"
        >
          <div class="balloon1">
            <p>お店クリックで地図上で確認できるッパ</p>
          </div>
        </v-col>

        <v-spacer />

        <v-col
          cols="12"
          sm="3"
          md="3"
          xl="2"
          class="pt-6"
        >
          <v-btn
            block
            color="#001F47"
            dark
            @click="filterReset()"
          >
            filterリセット
          </v-btn>
        </v-col>
      </v-row>
      <!-- selectverの時抜く-->
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
        <v-col cols="12" sm="12" xs="12">
          <v-data-table
            :headers="headers"
            :items="setDetails()"
            sort-by="name"
            class="elevation-1"
            @click:row="clickRow"
          >
            <template #[`item.tags`]="{ item }">
              <v-btn
                v-for="(tag,i) in item.tags"
                :key="i"
                sm
                disabled
                class="ma-1"
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
          <v-card color="rgb(241, 248, 200)">
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
                cols="10"
                offset="2"
              >
                <v-img
                  max-height="80%"
                  max-width="80%"
                  :src="setImage()"
                />
              </v-col>
              <v-col>
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
                  target="_blank"
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
      select: [],
      select_host_check: 0,
      select_host: [],
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
          text: '店名',
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
    setImage () {
      if (this.marker.image) {
        return this.marker.image
      } else {
        return '/img/kappa.png'
      }
    },
    filterReset () {
      console.log(this.select)
      this.select_host_check = 0
    },
    clickRow (row) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      this.select_host_check = 1
      this.select_host = []
      this.select_host.push(row)
      console.log(this.select_host_check)
    },
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
      this.method3()
    },
    method2 (i) {
      this.selectTags.push(this.tagsIndex[i])
      // selectver this.selectTags.push(i)
    },
    method3 () {
      this.serch = []
      this.selectTags.forEach((item) => {
        this.sample = this.tagsAll.filter(tag => tag.tag === item.tag)
        // selectver this.sample = this.tagsAll.filter(tag => tag.tag === item)
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
      if (this.finish_host[0] && this.select_host_check === 0) {
        return this.finish_host
      } else if (!this.finish_host[0] && this.select_host_check === 0) {
        return this.hostDetails
      } else if (this.select_host_check === 1) {
        console.log(this.select_host)
        return this.select_host
      }
    }
  }
}
</script>

<style scoped>
  .map {
    margin-top:20px;
  }
  .balloon {
    font-size: 12px;
  }
  .balloon::before {
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -15px;
    border: 15px solid transparent;
    border-top: 15px solid #164a94;
  }
  .balloon1 {
    position: relative;
    display: inline-block;
    margin: 0;
    padding: 15px 15px;
    min-width: 120px;
    max-width: 100%;
    color: #fff;
    font-size: 16px;
    background: #64cc44;
    border-radius: 15px;
  }
  .balloon1:before {
    content: "";
    position: absolute;
    top: 30%;
    left: -1%;
    margin-left: -15px;
    border: 10px solid transparent;
    border-right: 10px solid #64cc44;
  }
  .balloon1 p {
    margin: 0;
    padding: 0;
  }
  .tags_select {
    background-color: rgb(241, 248, 200);
    border-radius: 10px;
  }
</style>
