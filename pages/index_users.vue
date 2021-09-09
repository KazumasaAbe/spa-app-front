<template>
  <v-main>
    <v-container>
      <v-row justify="center" align-content="center" class="text-caption">
        <v-col cols="8">
          <v-card>
            <v-card-title>
              ユーザー一覧
            </v-card-title>
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
                    <v-col
                      cols="12"
                      sm="6"
                      md="5"
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        label="メールアドレス"
                      />
                    </v-col>
                  </v-container>
                </v-card-text>
              </v-card>
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
                  @click="checkForm()"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-dialog>
          </v-card>
          <v-data-table
            :headers="headers"
            :items="users"
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
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  auth: false,
  data () {
    return {
      dialog: false,
      dialogDelete: false,
      formTitle: '編集',
      users: [],
      headers: [
        {
          text: 'メールアドレス',
          align: 'start',
          value: 'email'
        },
        { text: '編集 / 削除', value: 'actions', sortable: false }
      ],
      editedItem: {
        email: ''
      },
      editedIndex: -1
    }
  },
  mounted () {
    this.$axios
      .get('/api/v1/users.json')
      .then(response => (this.users = response.data)
      )
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem () {
      console.log(2)
    },
    checkForm () {
      console.log(1)
    },
    close () {
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
