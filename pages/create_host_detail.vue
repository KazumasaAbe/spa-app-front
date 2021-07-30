/* eslint-disable */

<template>
  <div class="container py-5">
    <h2>受入店作成</h2>
    <v-form ref="form">
      <v-text-field
        v-model="host_detail.name"
        label="店舗名"
      />
      <v-text-field
        v-model="host_detail.latitude"
        label="緯度"
      />
      <v-text-field
        v-model="host_detail.longitude"
        label="経度"
      />
      <v-text-field
        v-model="host_detail.acceptable_date"
        label="受入時間"
      />
      <v-text-field
        v-model="host_detail.rate"
        label="必要カッパ数"
      />
      <v-text-field
        v-model="host_detail.description"
        label="説明"
      />
      <v-text-field
        v-model="host_detail.link"
        label="リンク"
      />
      <v-text-field
        v-model="host_detail.address"
        label="住所"
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
        name: "",
        latitude: "",
        longitude: "",
        acceptable_date: "",
        rate: "",
        description: "",
        link: "",
        address: ""
      }
    }
  },
  computed: {
    params () {
      return {
        hostDetail: {
          name: this.name,
          latitude: this.latitude,
          longitude: this.longitude,
          acceptable_date: this.acceptable_date,
          rate: this.rate,
          description: this.description,
          link: this.link,
          address: this.address
        }
      }
    }
  },

  mounted () {
    this.fetchContents()
  },

  methods: {
    fetchContents () {
      const url = '/api/v1/host_details'
      this.$axios.get(url)
        .then((res) => {
          this.hostDetail = res.data.hostDetail
        })
    },

    save () {
      // 保存処理
      const url = '/api/v1/host_details'
      this.$axios.post(url, this.params)
        .then((res) => {
          // eslint-disable-next-line no-console
          console.log(res)
          this.name = ''
          this.fetchContents()
          this.$bvToast.toast(res.data, {
            title: '成功',
            variant: 'success'
          })
        })
        .catch((err) => {
          const message = err.response.data
          this.$bvToast.toast(message, {
            title: 'エラー',
            variant: 'danger'
          })
        })
    }
  }
}
</script>

/* eslint-enable */
