<template>
  <v-app id="app" class="switching">
    <v-container>
      <v-col
        cols="12"
        class="text-center"
      >
        <h4>管理者用受入可否切替画面</h4>
      </v-col>
      <v-row
        justify="center"
        class="mt-10"
      >
        <v-col
          cols="6"
        >
          <v-select
            v-model="hostDetail"
            item-text="name"
            item-value="value"
            :items="details"
            label="店舗選択"
            hint="店舗を選択してください"
            prepend-icon="mdi-home-plus-outline"
            persistent-hint
            return-object
            @change="hostSelect()"
          />
        </v-col>
      </v-row>
      <v-row
        align="center"
        class="mt-10"
      >
        <v-col
          cols="6"
          class="text-center"
        >
          受入できる場合に押してください→
        </v-col>
        <v-row>
          <v-col
            cols="12"
            class="text-center mt-5 pt-5"
          >
            <v-btn
              color="success"
              fab
              x-large
              dark
            >
              <v-icon
                @click="possibleAcceptable()"
              >
                mdi-home-outline
              </v-icon>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            class="text-center"
          >
            <div v-text="OK" />
          </v-col>
        </v-row>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="6"
          class="text-center"
        >
          受入できない場合に押してください→
        </v-col>
        <v-row>
          <v-col
            cols="12"
            class="text-center mt-5 pt-5"
          >
            <v-btn
              color="error"
              fab
              x-large
              dark
            >
              <v-icon
                @click="impossibleAcceptable()"
              >
                mdi-home-remove
              </v-icon>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            class="text-center"
          >
            <div v-text="NG" />
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      OK: '受入可',
      NG: '受入不可',
      status_message: '',
      type: '',
      details: [],
      hostDetail: {},
      detail: {},
      user: {
        email: '',
        detail: '',
        password: '',
        password_confirmation: '',
        host: 1,
        host_name: '',
        host_id: ''
      }
    }
  },
  mounted () {
    this.fetchContent()
  },
  methods: {
    hostSelect () {
      this.user.host_name = this.hostDetail.name
      this.user.host_id = this.hostDetail.id
    },
    fetchContent () {
      this.$axios
        .get('/api/v1/host_details/')
        .then((res) => {
          this.details = res.data
          console.log(this.details)
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
      const url = `/api/v1/host_details/${this.user.host_id}/update_acceptable`
      this.$axios.patch(url, this.user.host_id)
        .then((res) => {
          this.detail = res.data
          this.$router.push('/')
          console.log(this.user.host_id)
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
