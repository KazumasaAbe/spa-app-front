<template>
  <v-main>
    <v-container>
      <v-row justify="center" align-content="center" class="text-caption">
        <v-col cols="8">
          <v-card>
            <v-card-title>
              ログイン
            </v-card-title>
            <Notification v-if="errors" :messages="errors" />
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="email"
                  prepend-icon="mdi-account-circle"
                  label="メールアドレス"
                />
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  prepend-icon="mdi-lock"
                  label="パスワード"
                  @click:append="showPassword = !showPassword"
                />
              </v-form>
              <v-card-actions>
                <v-btn
                  color="info"
                  block
                  @click="loginWithAuthModule"
                >
                  ログイン
                </v-btn>
              </v-card-actions>
              <v-layout justify-right>
                <v-card-actions>
                  <nuxt-link to="/sign_up">
                    会員登録がまだの方はこちら
                  </nuxt-link>
                </v-card-actions>
              </v-layout>
              <v-divider />
              <!--Googleでログイン-->
              <v-card-actions>
                <v-btn
                  class="text-capitalize
                          white--text"
                  color="deep-orange"
                  block
                  @click.stop="authenticate"
                >
                  <v-icon>mdi-google</v-icon>
                  <v-spacer />
                  Googleでログイン
                  <v-spacer />
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
export default {
  name: 'SignUp',
  data () {
    return {
      message: '新規登録です',
      showPassword: false,
      email: '',
      password: '',
      errors: null
    }
  },
  methods: {
    // loginメソッドの呼び出し
    async loginWithAuthModule () {
      await this.$auth
        .loginWith('local', {
          // emailとpasswordの情報を送信
          data: {
            email: this.email,
            password: this.password
          }
        })
        .then(
          (response) => {
          // レスポンスで返ってきた、認証に必要な情報をlocalStorageに保存
            localStorage.setItem('access-token', response.headers['access-token'])
            localStorage.setItem('client', response.headers.client)
            localStorage.setItem('uid', response.headers.uid)
            localStorage.setItem('token-type', response.headers['token-type'])
            this.$router.push('/')
            this.$store.dispatch(
              'flashMessage/showMessage',
              {
                message: 'ログインしました.',
                type: 'success',
                status: true
              },
              { root: true }
            )
            // console.log(localStorage.getItem('access-token'))
            return response
          }
        )
        .catch((e) => {
          this.errors = e.response.data.errors
          console.log(this.errors)
        })
    },
    authenticate () {
      this.$auth.loginWith('app')
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
