<template>
  <v-app dark>
    <v-container>
      <v-row>
        <v-col class="text-center" cols="12">
          <p v-if="error.statusCode === 404">
            {{ pageNotFound1 }}<br>
            {{ pageNotFound2 }}<br>
            {{ pageNotFound3 }}<br>
          </p>
          <p v-else>
            {{ otherError }}
          </p>
        </v-col>
        <v-col class="text-center" cols="12">
          <NuxtLink to="/">
            ホームに戻る
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound1: '404 Not Found',
      pageNotFound2: 'お探しのページが見つかりません。',
      pageNotFound3: 'URLに間違いがないかご確認ください。',
      otherError: 'エラーが発生しました。'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>
