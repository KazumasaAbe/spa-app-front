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
                <v-text-field
                  v-model="password_confirmation"
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
export default {
  name: 'SignUp',
  data () {
    return {
      showPassword: false,
      email: '',
      password: '',
      password_confirmation: ''
    }
  },
  methods: {
    registerUser () {
      this.$axios.post('/api/v1/auth', this.user).then((response) => {
        window.location.href = '/'
      })
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
