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
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-layout justify-center>
        <span v-if="$auth.loggedIn">
          <v-btn
            class="text-capitalize
                      white--text"
            color="deep-orange"
            @click="$auth.logout()"
          >
            ログアウト
          </v-btn>
        </span>
      </v-layout>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
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
          icon: 'mdi-apps',
          title: 'マップ',
          to: '/'
        },
        {
          title: '受入店作成',
          to: '/create_host_detail'
        },
        {
          title: '受入店一覧',
          to: '/index_host_details'
        },
        {
          title: '受入店詳細',
          to: '/host_detail'
        },
        {
          title: '受入切替画面',
          to: '/switching'
        },
        {
          title: 'ログイン',
          to: '/login'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '遠野旅の産地直売所'
    }
  }
}
</script>
