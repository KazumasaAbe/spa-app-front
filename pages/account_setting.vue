<template>
  <v-main>
    <v-container>
      <v-row justify="center" align-content="center" class="text-caption">
        <v-col cols="8">
          <v-card>
            <v-card-title>
              ユーザー情報
            </v-card-title>
            <v-card-actions>
              <v-text-field
                v-model="user.data.email"
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
            <v-card-actions v-if="user.data.host">
              <v-text-field
                v-model="user.data.host_name"
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
            max-width="800px"
          >
            <v-card>
              <v-card-title>
                編集
              </v-card-title>
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
                      @click="emailSave()"
                    >
                      保存
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="hostDialog"
            max-width="800px"
          >
            <v-card>
              <v-card-title>
                編集
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-card-actions>
                    <v-select
                      v-model="editedItem.host_name"
                      item-text="name"
                      :items="details"
                      prepend-icon="mdi-home-plus-outline"
                      label="店舗"
                    />
                  </v-card-actions>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                    >
                      保存
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="passwordDialog"
            max-width="800px"
          >
            <v-card>
              <v-card-title>
                編集
              </v-card-title>
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
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      prepend-icon="mdi-lock"
                      label="パスワード再確認"
                      @click:append="showPassword = !showPassword"
                    />
                  </v-card-actions>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                    >
                      保存
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
      getUser: {},
      details: [],
      emailDialog: false,
      hostDialog: false,
      passwordDialog: false,
      account: null,
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
  },
  methods: {
    editEmailItem () {
      this.editedItem = Object.assign({}, this.user.data)
      this.emailDialog = true
    },
    editHostItem () {
      this.editedItem = Object.assign({}, this.user.data)
      this.hostDialog = true
    },
    editPasswordItem () {
      this.passwordDialog = true
    },
    emailSave () {
      console.log(1)
      const url = '/api/v1/users/'
      this.$axios.patch(url + this.editedItem.id, this.editedItem)
        .then((response) => {
          this.account = response.data
          // this.$store.commit('user_information/login', this.account)
          this.close()
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
