/* eslint-disable */
<template>
  <v-app id="app" class="switching">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
        >
          <h2>受入切替画面 {{ user.host_name }}</h2>
          <h2>データ{{ statusAcceptable() }}</h2>
          <v-col
            cols="4"
          >
            <span v-text="OK" />
            <v-btn
              color="success"
              fab
              x-large
              dark
            >
              <v-icon
                @click="possibleAcceptable()"
              >
                mdi-map-marker-radius
              </v-icon>
            </v-btn>
          </v-col>
          <v-col
            cols="4"
          >
            <span v-text="NG" />
            <v-btn
              color="error"
              fab
              x-large
              dark
            >
              <v-icon
                @click="impossibleAcceptable()"
              >
                mdi-map-marker-remove
              </v-icon>
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      OK: '受入可',
      NG: '受入不可',
      status_message: '',
      type: '',
      detail: {}
    }
  },
  computed: {
    ...mapGetters({
      user: 'user_information/getUser'
    })
  },
  mounted () {
    this.fetchContent()
  },
  methods: {
    fetchContent () {
      this.$axios
        .get('/api/v1/host_details/' + this.user.host_id)
        .then((res) => {
          this.detail = res.data
          console.log(this.detail)
        })
    },
    statusAcceptable () {
      if (this.detail.acceptable === 1) {
        return '営業中'
      } else {
        return '満杯です'
      }
    },
    possibleAcceptable () {
      this.detail.acceptable = 1
      this.change_acceptable()
      this.status_message = '受入可に変更しました'
      this.type = 'success'
    },
    impossibleAcceptable () {
      this.detail.acceptable = 0
      this.change_acceptable()
      this.status_message = '受入不可に変更しました'
      this.type = 'purple'
    },
    change_acceptable () {
      const url = `/api/v1/host_details/${this.detail.id}/update_acceptable`
      this.$axios.patch(url, this.detail)
        .then((res) => {
          this.detail = res.data
          this.$router.push('/')
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: this.status_message,
              type: this.type,
              status: true
            },
            { root: true }
          )
        })
    }
  }
}
</script>
/* eslint-enable */
