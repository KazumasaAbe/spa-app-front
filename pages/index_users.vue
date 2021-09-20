<template>
  <v-main>
    <v-container>
      <v-row justify="center" align-content="center" class="text-caption">
        <v-col cols="10">
          <v-card>
            <v-tabs
              v-model="tab"
              color="cyan"
            >
              <v-tabs-slider color="cyan" />
              <v-tab
                v-for="tabname in tabsName"
                :key="tabname"
              >
                {{ tabname }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat>
                  <v-data-table
                    :headers="host_headers"
                    :items="hostUsers"
                    :ites-per-page="10"
                    class="elevation-1"
                  >
                    <template #[`item.actions`]="{ item }">
                      <v-icon
                        color="teal"
                        class="mr-2"
                        @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        color="error"
                        @click="deleteItem(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-data-table
                    :headers="general_headers"
                    :items="gengeralUsers"
                    :ites-per-page="10"
                    class="elevation-1"
                  >
                    <template #[`item.actions`]="{ item }">
                      <v-icon
                        color="teal"
                        class="mr-2"
                        @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        color="error"
                        @click="deleteItem(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
            <v-dialog
              v-model="dialog"
              max-width="800px"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <Notification v-if="errors" :messages="errors" />
                    <v-col
                      cols="12"
                      sm="6"
                      md="5"
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        prepend-icon="mdi-account-circle"
                        label="メールアドレス"
                      />
                    </v-col>
                    <span v-if="editedItem.host_name !== null">
                      <v-col
                        cols="12"
                        sm="6"
                        md="5"
                      >
                        <v-select
                          v-model="editedItem.host_name"
                          item-text="name"
                          item-value="value"
                          :items="details"
                          label="店舗"
                          prepend-icon="mdi-home-plus-outline"
                          @change="hostSelect()"
                        />
                      </v-col>
                    </span>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close()"
                      >
                        Cancel
                      </v-btn>

                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save()"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialogDelete"
              max-width="500px"
            >
              <v-card>
                <div class="pop-up">
                  削除してもよろしいですか？
                </div>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="closeDelete">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                    OK
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>1
    </v-container>
  </v-main>
</template>

<script>
import Notification from '../components/Notification.vue'
import TutorialVue from '../components/Tutorial.vue'
export default {
  auth: false,
  components: { Notification },
  data () {
    return {
      dialog: false,
      errors: null,
      dialogDelete: false,
      formTitle: '編集',
      tab: null,
      details: [],
      users: [],
      host_users: [],
      general_users: [],
      host_headers: [
        {
          text: 'メールアドレス',
          align: 'start',
          value: 'email'
        },
        {
          text: '店舗名',
          align: 'start',
          value: 'host_name'
        },
        { text: '編集 / 削除', value: 'actions', sortable: false }
      ],
      general_headers: [
        {
          text: 'メールアドレス',
          align: 'start',
          value: 'email'
        },
        { text: '編集 / 削除', value: 'actions', sortable: false }
      ],
      editedItem: {
        email: '',
        host_name: '',
        host_id: ''
      },
      defaultItem: {
        email: '',
        host_name: '',
        host_id: ''
      },
      editedIndex: -1,
      tabsName: [
        '店舗側ユーザー', '一般ユーザー'
      ],
      text: 'abe'
    }
  },
  computed: {
    hostUsers () {
      return this.users.filter(user => user.host === true)
    },
    gengeralUsers () {
      return this.users.filter(user => user.host === false && user.admin === false)
    }
  },
  mounted () {
    this.$axios
      .get('/api/v1/users.json')
      .then(response => (this.users = response.data)
      )
    this.$axios
      .get('/api/v1/host_details.json')
      .then(response => (this.details = response.data))
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = TutorialVue
    },
    deleteItemConfirm () {
      const url = '/api/v1/users/'
      this.$axios.delete(url + this.editedItem.id)
        .then(() => {
          this.users.splice(this.editedIndex, 1)
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: '削除しました',
              type: 'success',
              status: true
            }
          )
          this.closeDelete()
        })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      const url = '/api/v1/users/'
      this.$axios.patch(url + this.editedItem.id, this.editedItem)
        .then(() => {
          Object.assign(this.users[this.editedIndex], this.editedItem)
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: '更新しました',
              type: 'success',
              status: true
            }
          )
          this.close()
        })
        .catch((e) => {
          console.log(e.response.data)
          this.errors = e.response.data
        })
    },
    close () {
      this.dialog = false
      this.errors = null
    },
    hostSelect () {
      this.detail = this.details.filter(detail => detail.name === this.editedItem.host_name)
      this.editedItem.host_id = this.detail[0].id
    }
  }
}
</script>

<style scoped>

</style>
