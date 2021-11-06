<template>
  <v-app id="app" class="switching">
    <v-container>
      <h2 class="my-5">
        <span
          class="main-title"
        >
          管理者用受入切替画面
        </span>
      </h2>
      <v-row
        justify="center"
        class="mb-5"
      >
        <v-col
          cols="12"
          sm="4"
          class="mt-5"
        >
          <v-select
            v-model="hostDetail"
            item-text="name"
            item-value="value"
            :items="hostDetails"
            label="店舗選択"
            hint="店舗を選択してください"
            prepend-icon="mdi-home-plus-outline"
            persistent-hint
            return-object
            outlined
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          class="pt-6"
        >
          <v-btn
            color="success"
            x-large
            dark
            outlined
            class="mx-5 mt-2 elevation-3 font-weight-bold"
            @click="possibleAcceptable()"
          >
            受入可能
          </v-btn>
          <v-btn
            color="error"
            x-large
            dark
            outlined
            class="ml-5 mt-2 elevation-3 font-weight-bold"
            @click="impossibleAcceptable()"
          >
            受入不可
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="hostDetails"
        class="elevation-3"
      >
        <template #[`item.acceptable`]="{ item }">
          <v-chip
            :color="getColor(item.acceptable)"
            dark
          >
            <span v-if="item.acceptable === 1">受入可</span>
            <span v-else>受入否</span>
          </v-chip>
        </template>
      </v-data-table>
    </v-container>
  </v-app>
</template>

<script>
export default {
  middleware: 'redirect',
  auth: false,
  data () {
    return {
      OK: '受入可',
      NG: '受入不可',
      status_message: '',
      type: '',
      hostDetails: [],
      hostDetail: {},
      headers: [
        {
          text: '店舗名',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        { text: '受入可否状態', value: 'acceptable', sortable: false }
      ]
    }
  },
  mounted () {
    this.fetchContent()
  },
  methods: {
    getColor (acceptable) {
      if (acceptable === 1) {
        return 'green'
      } else {
        return 'red'
      }
    },
    fetchContent () {
      this.$axios
        .get('/api/v1/host_details/')
        .then((res) => {
          this.hostDetails = res.data
        })
    },
    statusAcceptable () {
      if (this.hostDetail.acceptable === 1) {
        return '営業中'
      } else {
        return '満杯です'
      }
    },
    possibleAcceptable () {
      this.hostDetail.acceptable = 1
      this.change_acceptable()
      this.status_message = '受入可に変更しました'
      this.type = 'success'
    },
    impossibleAcceptable () {
      this.hostDetail.acceptable = 0
      this.change_acceptable()
      this.status_message = '受入不可に変更しました'
      this.type = 'purple'
    },
    change_acceptable () {
      const url = `/api/v1/host_details/${this.hostDetail.id}/update_acceptable`
      this.$axios.patch(url, this.hostDetail)
        .then((res) => {
          this.hostDetail = res.data
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: this.status_message,
              type: this.type,
              status: true
            }
          )
        })
    }
  }
}
</script>

<style scope>
  .main-title {
    color: #444444;
    padding-bottom: 5px;
    border-bottom: solid;
    border-color: #C0C0C0;
    border-width: 2px;
  }
</style>
