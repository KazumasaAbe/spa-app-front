<template>
  <v-main>
    <v-container>
      <v-row justify="center" align-content="center" class="text-caption">
        <v-col cols="8">
          <v-card>
            <!--
              <v-card-title>
              </v-card-title>
            -->
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="name"
                  prepend-icon="mdi-account-circle"
                  label="会員様ID(またはメールアドレス)"
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
      name: '',
      password: ''
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
