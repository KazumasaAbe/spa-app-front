/* eslint-disable */

<template>
  <div class="container py-5">
    <h2>受入店作成</h2>
    <v-form ref="form">
      <v-text-field
        v-model="params.host_detail.name"
        label="店舗名"
      />
      <v-text-field
        v-model="params.host_detail.latitude"
        label="緯度"
      />
      <v-text-field
        v-model="params.host_detail.longitude"
        label="経度"
      />
      <v-text-field
        v-model="params.host_detail.rate"
        label="必要カッパ数"
      />
      <v-text-field
        v-model="params.host_detail.description"
        label="説明"
      />
      <v-text-field
        v-model="params.host_detail.link"
        label="リンク"
      />
      <v-text-field
        v-model="params.host_detail.address"
        label="住所"
      />
      <v-text-field
        v-model="params.host_detail.maximum_acceptability"
        label="最大受入人数"
      />
      <v-text-field
        v-model="params.host_detail.marker_icon"
        label="マーカーアイコンURL"
      />
      <v-text-field
        v-model="params.host_detail.image"
        label="店舗写真URL"
      />
      <v-btn
        depressed
        color="primary"
        @click="save()"
      >
        作成
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      host_detail: {
        name: '',
        latitude: '',
        longitude: '',
        rate: '',
        description: '',
        link: '',
        address: '',
        maximum_acceptability: '',
        marker_icon: '',
        image: '',
        tags_attributes: [
          {
            tag: ''
          }
        ]
      }
    }
  },

  computed: {
    params () {
      return {
        host_detail: {
          name: this.name,
          latitude: this.latitude,
          longitude: this.longitude,
          rate: this.rate,
          description: this.description,
          link: this.link,
          address: this.address,
          maximum_acceptability: this.maximum_acceptability,
          marker_icon: this.marker_icon,
          image: this.image,
          tags_attributes: [
            {
              tag: this.tag
            }
          ]
        }
      }
    }
  },

  methods: {
    save () {
      const url = '/api/v1/host_details'
      this.$axios.post(url, this.params)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          const message = err.response.data
          console.log(message)
        })
    }
  }
}
</script>

/* eslint-enable */
