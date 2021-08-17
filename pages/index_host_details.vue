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
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="店舗名"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.description"
                      label="説明"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.latitude"
                      label="緯度"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.longitude"
                      label="経度"
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
                      v-model="editedItem.address"
                      label="住所"
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
                </v-row>
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
    <template #no-data>
      <v-btn color="primary" @click="initialize">
        リセット
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  auth: false,
  async asyncData ({ $axios }) {
    let hostDetails = []
    await $axios.$get('/api/v1/host_details')
      .then(res => (hostDetails = res))
    return {
      hostDetails
    }
  },

  data: () => ({
    dialog: false,
    flashMessage: false,
    headers: [
      {
        text: 'ID',
        value: 'id'
      },
      {
        text: '店舗名',
        align: 'start',
        value: 'name'
      },
      { text: '編集 / 削除', value: 'actions', sortable: false }
    ],
    hostDetails: [],
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
      maximum_acceptability: 0
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
      maximum_acceptability: 0
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

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
    },

    editItem (item) {
      this.editedIndex = this.hostDetails.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.hostDetails.indexOf(item)
      const hostNumber = this.hostDetails.[index].id
      const hostName = this.hostDetails.[index].name
      const url = `/api/v1/host_details/${hostNumber}`
      confirm(`${hostName}を本当に削除してよろしいですか？`) && this.$axios.delete(url)
        .then((res) => {
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: `${hostName}を削除しました`,
              type: 'success',
              status: true
            },
            { root: true }
          )
          // eslint-disable-next-line no-console
          console.log(res)
        })
        .catch((err) => {
          const message = err.response.data
          alert(`${hostName}を削除できませんでした`)
          // eslint-disable-next-line no-console
          console.log(message)
        })
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        const url = '/api/v1/host_details/'
        this.$axios.put(url + this.editedItem.id, this.editedItem)
          .then((res) => {
            location.reload()
            alert('更新しました')
            // eslint-disable-next-line no-console
            console.log(res)
          })
          .catch((err) => {
            const message = err.response.data
            alert('更新失敗')
            // eslint-disable-next-line no-console
            console.log(message)
          })
      } else {
        const url = '/api/v1/host_details'
        this.$axios.post(url, this.editedItem)
          .then((res) => {
            alert('新規登録しました')
            location.reload()
            // eslint-disable-next-line no-console
            console.log(res)
          })
          .catch((err) => {
            const message = err.response.data
            alert('登録失敗')
            // eslint-disable-next-line no-console
            console.log(message)
          })
      }
      this.close()
    }
  }
}
</script>
