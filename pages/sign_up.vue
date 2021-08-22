<template>
  <v-main>
    <v-container>
      <v-row justify="center" align-content="center" class="text-caption">
        <v-col cols="8">
          <v-card>
            <v-card-title>
              新規登録
            </v-card-title>
            <Notification v-if="errors" :messages="errors" />
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="user.email"
                  prepend-icon="mdi-account-circle"
                  label="メールアドレス"
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
  name: 'SignUp',
  components: { Notification },
  auth: false,
  data () {
    return {
      showPassword: false,
      errors: null,
      user: {
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    registerUser () {
      this.$axios.post('/api/v1/auth', this.user)
        .then((response) => {
          this.loginWithAuthModule()
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
          console.log(1)
          this.errors = e.response.data.errors.full_messages
          console.log(1)
          console.log(this.errors)
        })
    },
    loginWithAuthModule () {
      this.$auth
        .loginWith('local', {
          // emailとpasswordの情報を送信
          data: {
            email: this.user.email,
            password: this.user.password
          }
        })
        .then(
          (response) => {
          // レスポンスで返ってきた、認証に必要な情報をlocalStorageに保存
            localStorage.setItem('access-token', response.headers['access-token'])
            localStorage.setItem('client', response.headers.client)
            localStorage.setItem('uid', response.headers.uid)
            localStorage.setItem('token-type', response.headers['token-type'])
            return response
          }
        )
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
