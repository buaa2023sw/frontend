<template>
  <v-app id="main_page">


    <v-app-bar app clipped-left color="blue" dark extension-height="36">
      <v-app-bar-nav-icon v-if="user" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>BUAA 2023 SW</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-chip v-if="user" outlined v-bind="attrs" v-on="on">{{ user.name }}</v-chip>
          <v-icon v-if="user" v-bind="attrs" v-on="on">mdi-account</v-icon>
          <v-icon v-else v-bind="attrs" v-on="on">mdi-account-remove</v-icon>
        </template>
        <v-card v-if="user" min-width="200px">
          <v-card-title>Hello, {{ user.name }}</v-card-title>
          <v-card-subtitle>{{ user.email }}</v-card-subtitle>
          <v-list>
            <v-list-item link to="">
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="logoff()">
              <v-list-item-title>Log off</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card v-else min-width="200px" link to="/login">
          <v-card-title>Please Login</v-card-title>
          <v-list>
            <v-list-item link to="/register">
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <template v-if="user" v-slot:extension>
        <v-tabs v-model="selectedProj">
          <v-tab>Home</v-tab>
          <v-tab><v-icon class="px-1">mdi-plus-circle</v-icon> new project</v-tab>
        </v-tabs>
      </template>

    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        :mini-variant="mini"
        :expand-on-hover="mini"
        v-if="user"
    >
      <v-list>
        <v-list-item @click.stop="mini = !mini">
          <v-list-item-icon>
            <v-icon v-if="mini">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-h6">{{ mini ? '展开' : '收回' }}</v-list-item-title>
        </v-list-item>

      <v-divider></v-divider>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-home-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-h6">主页</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-book-edit-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-h6">规划</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-laptop</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-h6">开发</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Cookies from 'js-cookie'
import { computed } from 'vue'

let user = Cookies.get('user')
if (user === undefined) {
  console.log('not logged in')
  if (window.location.pathname === '/register') {
  } else if (window.location.pathname !== '/login') {
    window.location.pathname = '/login'
  }
} else {
  user = JSON.parse(user)
}

export default {
  name: 'App',
  data: () => ({
    drawer: true,
    mini: true,
    user: user,
    selectedProj: null
  }),
  provide() {
    return {
      user: computed(() => this.user),
      selectedProj: computed(() => this.selectedProj)
    }
  },
  methods: {
    logoff() {
      Cookies.remove('user');
      window.location.href = '/login'
    }
  }
};
</script>

<style scoped>
#username  {
  font-size: 1.2em;
  line-height: 1.2em;
}
</style>
