<template>
  <v-main>
    <v-container>
      <v-row justify="center" align-content="center" class="text-caption">
        <v-col cols="12">
          <v-card>
            <v-card-title>
              ユーザー情報
            </v-card-title>
            <v-card-actions>
              <v-text-field
                v-model="account.email"
                prepend-icon="mdi-account-circle"
                label="email"
                readonly
              />
              <v-icon
                color="primary"
                class="mr-2"
                @click="editEmailItem()"
              >
                mdi-pencil
              </v-icon>
            </v-card-actions>
            <v-card-actions v-if="account.host">
              <v-text-field
                v-model="account.host_name"
                prepend-icon="mdi-home-plus-outline"
                label="店舗"
                readonly
              />
              <v-icon
                color="primary"
                class="mr-2"
                @click="editHostItem()"
              >
                mdi-pencil
              </v-icon>
            </v-card-actions>
            <v-card-actions>
              <v-text-field
                value="*********"
                prepend-icon="mdi-lock"
                label="password"
                readonly
              />
              <v-icon
                color="primary"
                class="mr-2"
                @click="editPasswordItem()"
              >
                mdi-pencil
              </v-icon>
            </v-card-actions>
          </v-card>
          <v-dialog
            v-model="emailDialog"
            persistent
            max-width="800px"
          >
            <v-card>
              <v-card-title>
                編集
              </v-card-title>
              <Notification v-if="errors" :messages="errors" />
              <v-card-text>
                <v-container>
                  <v-card-actions>
                    <v-text-field
                      v-model="editedItem.email"
                      prepend-icon="mdi-account-circle"
                      label="email"
                    />
                  </v-card-actions>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      @click="save()"
                    >
                      保存
                    </v-btn>
                    <v-btn
                      @click="close()"
                    >
                      キャンセル
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="hostDialog"
            persistent
            max-width="800px"
          >
            <v-card>
              <v-card-title>
                編集
              </v-card-title>
              <Notification v-if="errors" :messages="errors" />
              <v-card-text>
                <v-container>
                  <v-card-actions>
                    <v-select
                      v-model="editedItem.host_name"
                      item-text="name"
                      :items="details"
                      prepend-icon="mdi-home-plus-outline"
                      label="店舗"
                      @change="hostSelect()"
                    />
                  </v-card-actions>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      @click="save()"
                    >
                      保存
                    </v-btn>
                    <v-btn
                      @click="close()"
                    >
                      キャンセル
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="passwordDialog"
            persistent
            max-width="800px"
          >
            <v-card>
              <v-card-title>
                編集
              </v-card-title>
              <Notification v-if="errors" :messages="errors" />
              <v-card-text>
                <v-container>
                  <v-card-actions>
                    <v-text-field
                      v-model="editedItem.password"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      prepend-icon="mdi-lock"
                      label="パスワード"
                      @click:append="showPassword = !showPassword"
                    />
                  </v-card-actions>
                  <v-card-actions>
                    <v-text-field
                      v-model="editedItem.password_confirmation"
                      :type="showPasswordConfirmation ? 'text' : 'password'"
                      :append-icon="showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
                      prepend-icon="mdi-lock"
                      label="パスワード再確認"
                      @click:append="showPasswordConfirmation = !showPasswordConfirmation"
                    />
                  </v-card-actions>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      @click="save()"
                    >
                      保存
                    </v-btn>
                    <v-btn
                      @click="close()"
                    >
                      キャンセル
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showPassword: false,
      showPasswordConfirmation: false,
      getUser: {},
      details: [],
      hostDetail: {},
      emailDialog: false,
      hostDialog: false,
      passwordDialog: false,
      account: {},
      errors: null,
      editedItem: {
        email: '',
        host_name: '',
        host_id: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user_information/getUser'
    })
  },
  mounted () {
    this.$axios
      .get('/api/v1/host_details.json')
      .then(response => (this.details = response.data))
    this.$axios
      .get('/api/v1/users/' + this.user.id)
      .then(response => (this.account = response.data))
  },
  methods: {
    editEmailItem () {
      this.editedItem = Object.assign({}, this.account)
      this.emailDialog = true
    },
    editHostItem () {
      this.editedItem = Object.assign({}, this.account)
      this.hostDialog = true
    },
    editPasswordItem () {
      this.editedItem = Object.assign({}, this.account)
      this.passwordDialog = true
    },
    hostSelect () {
      this.detail = this.details.filter(detail => detail.name === this.editedItem.host_name)
      this.editedItem.host_id = this.detail[0].id
      console.log(this.editedItem.host_id)
      console.log(this.editedItem.host_name)
    },
    save () {
      const url = '/api/v1/auth'
      this.$axios.put(url, this.editedItem, {
        headers: {
          'access-token': localStorage.getItem('access-token'),
          uid: localStorage.getItem('uid'),
          client: localStorage.getItem('client')
        }
      })
        .then((response) => {
          this.account = Object.assign({}, this.editedItem)
          this.$store.dispatch('user_information/setUser', this.account)
          // this.$store.commit('user_information/login', this.account)
          localStorage.setItem('access-token', response.headers['access-token'])
          localStorage.setItem('client', response.headers.client)
          localStorage.setItem('uid', response.headers.uid)
          localStorage.setItem('token-type', response.headers['token-type'])
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: '更新しました',
              type: 'success',
              status: true
            },
            { root: true }
          )
          this.close()
        }
        )
        .catch((e) => {
          console.log(e.response.data.errors.full_messages)
          this.errors = e.response.data.errors.full_messages
        })
    },
    close () {
      this.emailDialog = false
      this.hostDialog = false
      this.passwordDialog = false
      this.errors = null
    }
  }
}
</script>
