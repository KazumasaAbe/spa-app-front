<template>
  <v-main>
    <v-container>
      <v-row justify="center" align-content="center" class="text-caption">
        <v-col cols="10">
          <v-card>
            <v-card-title>
              店舗側新規登録
            </v-card-title>
            <Notification v-if="errors" :messages="errors" />
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="user.email"
                  prepend-icon="mdi-account-circle"
                  label="メールアドレス"
                />
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
                <v-text-field
                  v-model="user.password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  prepend-icon="mdi-lock"
                  label="パスワード"
                  @click:append="showPassword = !showPassword"
                />
                <v-text-field
                  v-model="user.password_confirmation"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  prepend-icon="mdi-lock"
                  label="パスワード再確認"
                  @click:append="showPassword = !showPassword"
                />
              </v-form>
              <v-card-actions>
                <v-btn
                  color="info"
                  block
                  @click="registerUser"
                >
                  新規登録
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Notification from '../components/Notification.vue'
export default {
  name: 'HostSignUp',
  components: { Notification },
  middleware: 'redirect',
  auth: false,
  data () {
    return {
      showPassword: false,
      errors: null,
      details: [],
      hostDetail: {},
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
    this.$axios
      .get('/api/v1/host_details.json')
      .then(response => (this.details = response.data))
  },
  methods: {
    registerUser () {
      this.$axios.post('/api/v1/auth', this.user)
        .then((response) => {
          this.$router.push('/')
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: '新規登録しました',
              type: 'success',
              status: true
            },
            { root: true }
          )
        })
        .catch((e) => {
          this.errors = e.response.data.errors.full_messages
        })
    },
    hostSelect () {
      console.log(this.$auth.user)
      this.user.host_name = this.hostDetail.name
      this.user.host_id = this.hostDetail.id
    }
  }
}
</script>

<style scoped>
p {
  font-size: 2em;
}
.v-divider {
  margin: 30px;
  border-width:medium;
}
.v-icon {
  float:left;
}
</style>
