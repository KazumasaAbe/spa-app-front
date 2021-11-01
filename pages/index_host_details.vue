<template>
  <v-data-table
    :headers="headers"
    :items="hostDetails"
    sort-by="name"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat color="white">
        <v-toolbar-title>受入店一覧</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
        <v-spacer />
        <v-dialog v-model="dialog" max-width="1000px">
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              新規追加
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="validate_form">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="店舗名"
                        :rules="nameRules"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.address"
                        label="住所"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn color="blue" outlined @click="addressSearch">
                        住所から緯度経度を検索
                      </v-btn>
                      <v-btn v-if="lat">
                        緯度：{{ lat }}
                      </v-btn>
                      <v-btn v-if="lng">
                        経度：{{ lng }}
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.latitude"
                        label="緯度"
                        :rules="Rules"
                        counter="11"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.longitude"
                        label="経度"
                        :rules="Rules"
                        counter="11"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.rate"
                        label="必要カッパ数"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.link"
                        label="リンク"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.maximum_acceptability"
                        label="最大受入人数"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.marker_icon"
                        label="マーカーアイコン"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.image"
                        label="店舗画像"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.description"
                        label="説明"
                      />
                    </v-col>
                    <v-col
                      cols="10"
                      sm="6"
                    >
                      タグ
                      <div
                        v-for="(tags, index) in editedItem.tags"
                        :key="index"
                      >
                        <v-text-field
                          v-model="tags.tag"
                        >
                          <template #append-outer>
                            <v-icon
                              color="error"
                              class="pill"
                              @click="deleteTag(tags, index)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                        </v-text-field>
                      </div>
                      <v-icon
                        color="teal"
                        x-large
                        class="mt-3"
                        @click="addTag()"
                      >
                        mdi-plus-circle
                      </v-icon>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="close">
                キャンセル
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                保存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon
        class="mr-2"
        color="teal"
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
</template>

<script>
export default {
  middleware: 'redirect',
  auth: false,
  success: false,
  async asyncData ({ $axios }) {
    let hostDetails = []
    await $axios.$get('/api/v1/host_details.json')
      .then(res => (hostDetails = res))
    return {
      hostDetails
    }
  },

  data: () => ({
    lat: '',
    lng: '',
    geocoder: {},
    address: '',
    tagsUpdateUrl: '/api/v1/tags/',
    dialog: false,
    show: false,
    flashMessage: false,
    Rules: [
      v => !!v || '必ず入力してください',
      v => v.length <= 11 || '11文字以内で入力してください'
    ],
    nameRules: [
      v => !!v || '必ず入力してください'
    ],
    lengthRules: [
      v => v.length <= 11 || '11文字以内で入力してください'
    ],
    headers: [
      {
        text: '店舗名',
        align: 'start',
        value: 'name'
      },
      { text: '編集 / 削除', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      latitude: 0,
      longitude: 0,
      rate: 0,
      description: '',
      link: '',
      address: '',
      marker_icon: '',
      image: '',
      maximum_acceptability: 0,
      tags: {
        tag: ''
      }
    },
    defaultItem: {
      name: '',
      latitude: 0,
      longitude: 0,
      rate: 0,
      description: '',
      link: '',
      address: '',
      marker_icon: '',
      image: '',
      maximum_acceptability: 0,
      tags: {
        tag: ''
      }
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新規作成' : '編集'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  mounted () {
    const google = window.google
    this.$gmapApiPromiseLazy().then(() => {
      this.geocoder = new google.maps.Geocoder()
    })
  },

  methods: {
    addressSearch () {
      const google = window.google
      this.geocoder = new google.maps.Geocoder()
      this.geocoder.geocode({
        address: this.editedItem.address
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.lat = results[0].geometry.location.lat()
          this.lng = results[0].geometry.location.lng()
          this.editedItem.latitude = this.lat
          this.editedItem.longitude = this.lng
        }
      })
    },

    deleteTag (tags, i) {
      this.editedItem.tags.splice(i, 1)
    },

    addTag () {
      const additionalForm = {
        tag: ''
      }
      this.editedItem.tags.push(additionalForm)
    },

    editItem (item) {
      this.editedIndex = this.hostDetails.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.hostDetails.indexOf(item)
      const hostNumber = this.hostDetails[index].id
      const hostName = this.hostDetails[index].name
      const url = `/api/v1/host_details/${hostNumber}`
      confirm(`${hostName}を本当に削除してよろしいですか？`) && this.hostDetails.splice(index, 1) && this.$axios.delete(url)
        .then(() => {
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: `${hostName}を削除しました`,
              type: 'success',
              status: true
            }
          )
        })
        .catch(() => {
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: `${hostName}を削除できませんでした`,
              type: 'error',
              status: false
            }
          )
        })
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.lng = ''
        this.lat = ''
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.$refs.validate_form.validate()) {
        this.success = true
        if (this.editedIndex > -1) {
          const url1 = '/api/v1/host_details/'
          const url2 = `/api/v1/host_details/${this.editedItem.id}/tags`
          Object.assign(this.hostDetails[this.editedIndex], this.editedItem)
          this.$axios.put(url1 + this.editedItem.id, this.editedItem)
            .then(() => {
              this.$store.dispatch(
                'flashMessage/showMessage',
                {
                  message: '更新しました',
                  type: 'success',
                  status: true
                }
              )
            })
            .catch(() => {
              this.$store.dispatch(
                'flashMessage/showMessage',
                {
                  message: '更新できませんでした',
                  type: 'error',
                  status: false
                }
              )
            })
          this.$axios.post(url2, this.editedItem)
            .then(() => {
              this.$store.dispatch(
                'flashMessage/showMessage',
                {
                  message: '更新しました',
                  type: 'success',
                  status: true
                }
              )
            })
        } else {
          const url = '/api/v1/host_details'
          this.hostDetails.push(this.editedItem)
          this.$axios.post(url, this.editedItem)
            .then(() => {
              this.$store.dispatch(
                'flashMessage/showMessage',
                {
                  message: '新規登録しました',
                  type: 'success',
                  status: true
                }
              )
            })
            .catch(() => {
              this.$store.dispatch(
                'flashMessage/showMessage',
                {
                  message: '新規登録に失敗しました',
                  type: 'error',
                  status: false
                }
              )
            })
        }
        this.close()
      } else {
        this.success = false
      }
    }
  }
}
</script>

<style>
  .pill {
    display: inline-block;
    margin: 0 5px;
    padding: 6px 12px;
    border-radius: 20px;
    background: #eee;
    color: #777;
    letter-spacing: 1px;
    font-weight: bold;
    cursor: pointer;
  }
</style>
