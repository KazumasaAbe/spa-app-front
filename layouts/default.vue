<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      :style="{ background: $vuetify.theme.themes.light.background }"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <router-link to="/">
        <v-img
          :src="image"
          max-height="50"
          max-width="200"
        />
      </router-link>
      <v-spacer />
      <v-layout justify-center>
        <span v-if="$auth.loggedIn">
          <v-btn
            class="text-capitalize
                      white--text"
            color="deep-orange"
            @click="logout()"
          >
            ログアウト
          </v-btn>
        </span>
      </v-layout>
    </v-app-bar>
    <v-main>
      <v-container>
        <FlashMessage />
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
      style="background: #001f47"
      class="white--text"
    >
      <span>&copy; {{ new Date().getFullYear() }}</span> Tono Natural Life Network, All Rights Reserved.
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-map-marker-radius',
          title: 'マップ',
          to: '/'
        },
        {
          icon: 'mdi-account-box-multiple',
          title: '受入店一覧',
          to: '/index_host_details'
        },
        {
          icon: 'mdi-nintendo-switch',
          title: '受入切替画面',
          to: '/switching'
        },
        {
          icon: 'mdi-login',
          title: 'ログイン',
          to: '/login'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      image: require('@/assets/image/logo_h.png')
    }
  },
  methods: {
    logout () {
      console.log(localStorage.getItem('uid'))
      console.log(localStorage.getItem('access-token'))
      console.log(localStorage.getItem('client'))
      this.$axios.delete('/api/v1/auth/sign_out', {
        headers: {
          uid: localStorage.getItem('uid'),
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client')
        }
      })
        .then((res) => {
          this.$auth.logout()
          localStorage.removeItem('uid')
          localStorage.removeItem('access-token')
          localStorage.removeItem('client')
          this.$router.push('/')
          this.$store.dispatch(
            'flashMessage/showMessage',
            {
              message: 'ログアウトしました',
              type: 'success',
              status: true
            },
            { root: true }
          )
        })
    }
  }
}
</script>
