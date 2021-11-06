<template>
  <v-app id="app" class="switching">
    <v-container>
      <v-row>
        <v-col
          cols="12"
        >
          <h2 class="my-5">
            <span class="main-title">受入切替画面</span>
          </h2>
          <h4 class="host-info">
            店舗名：{{ user.host_name }}
          </h4>
          <h4 class="host-info">
            現在の状態：
            <span v-if="detail.acceptable === 1">
              <v-btn
                color="success"
                dark
                outlined
                class="elevation-3 font-weight-bold"
              >
                <span v-text="OK" />
              </v-btn>
            </span>
            <span else>
              <v-btn
                color="error"
                dark
                outlined
                class="elevation-3 font-weight-bold"
              >
                <span v-text="NG" />
              </v-btn>
            </span>
          </h4>
        </v-col>
      </v-row>
      <v-row
        justify="center"
        aligin="center"
      >
        <v-col
          cols="5"
        >
          <v-btn
            color="success"
            x-large
            dark
            outlined
            class="elevation-3 font-weight-bold"
            @click="possibleAcceptable()"
          >
            <span v-text="OK" />
          </v-btn>
        </v-col>
        <v-col
          cols="5"
        >
          <v-btn
            color="error"
            x-large
            dark
            outlined
            class="elevation-3 font-weight-bold"
            @click="impossibleAcceptable()"
          >
            <span v-text="NG" />
          </v-btn>
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
      OK: '受入可能',
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
        })
    },
    statusAcceptable () {
      if (this.detail.acceptable === 1) {
        return '営業中'
      } else {
        return '満杯'
      }
    },
    gerColor () {
      if (this.detail.acceptable === 1) {
        return 'green'
      } else {
        return 'red'
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

<style scope>
  .main-title {
    color: #444444;
    padding-bottom: 5px;
    border-bottom: solid;
    border-color: #C0C0C0;
    border-width: 2px;
  }
  .host-info {
    color: #444444;
    margin: 30px 0px;
  }
</style>
