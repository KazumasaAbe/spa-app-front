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
          v-for="(item, i) in setItem()"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.name" />
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
      <span v-if="$store.$auth.loggedIn">
        aaaaaa
      </span>
      <v-spacer />
      <v-toolbar-items v-if="user">
        <v-menu offset-y>
          <template #activator="{on}">
            <v-btn text v-on="on">
              <v-icon>mdi-account-circle</v-icon>{{ user.data.email }}
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-subheader>get help</v-subheader>
            <v-list-item
              v-for="(menu, i) in menus"
              :key="i"
              :to="menu.to"
              @click="menuActionClick(menu.action)"
            >
              <v-list-item-icon>
                <v-icon>{{ menu.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="menu.name" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
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
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      admin_items: [
        {
          icon: 'mdi-map-marker-radius',
          name: 'マップ',
          to: '/'
        },
        {
          icon: 'mdi-home-plus-outline',
          name: '店舗登録',
          to: '/create_host_detail'
        },
        {
          icon: 'mdi-account-plus',
          name: '新規登録',
          to: '/host_sign_up'
        },
        {
          icon: 'mdi-account-plus',
          name: 'ユーザー一覧',
          to: '/index_users'
        }
      ],
      default_items: [
        {
          icon: 'mdi-map-marker-radius',
          name: 'マップ',
          to: '/'
        },
        {
          icon: 'mdi-account-box-multiple',
          name: '受入店一覧',
          to: '/index_host_details'
        },
        {
          icon: 'mdi-login',
          name: 'ログイン',
          to: '/login'
        }
      ],
      host_items: [
        {
          icon: 'mdi-map-marker-radius',
          name: 'マップ',
          to: '/'
        },
        {
          icon: 'mdi-account-box-multiple',
          name: '受入店一覧',
          to: '/index_host_details'
        },
        {
          icon: 'mdi-nintendo-switch',
          name: '受入切替画面',
          to: '/switching'
        },
        {
          icon: 'mdi-login',
          name: 'ログイン',
          to: '/login'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      image: require('@/assets/image/logo_h.png'),
      menus: [
        {
          name: 'アカウント設定',
          icon: 'mdi-vuetify',
          to: '/account_setting',
          action: 'false'
        },
        {
          name: 'ログアウト',
          icon: 'mdi-vuetify',
          action: 'logout'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'user_information/getUser'
    })
  },
  methods: {
    menuActionClick (action) {
      if (action === 'logout') {
        this.logout()
      }
    },
    logout () {
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
          this.$store.commit('user_information/logout')
        })
    },
    setItem () {
      if (this.user == null) {
        return this.default_items
      } else if (this.user.data.admin) {
        return this.admin_items
      } else if (!this.user.data.admin && !this.user.data.host) {
        return this.default_items
      } else if (this.user.data.host) {
        return this.host_items
      }
    }

  }
}
</script>
