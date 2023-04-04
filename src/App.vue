<template>
  <v-app id="main_page">


    <v-app-bar app clipped-left color="blue" dark extension-height="36">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>BUAA 2023 SW</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-account</v-icon>
        </template>
        <v-card min-width="200px">
          <v-card-title>Hello, {{ user.name }}</v-card-title>
          <v-card-subtitle>{{ user.email }}</v-card-subtitle>
          <v-list>
            <v-list-item link to="">
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item link to="">
              <v-list-item-title>Log off</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <template v-slot:extension>
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
import { computed } from 'vue'
export default {
  name: 'App',
  data: () => ({
    drawer: true,
    mini: true,
    loggedIn: false,
    user: {
      id: 1,
      name: 'TrickEye',
      email: 'trickeye@buaa.edu.cn'
    },
    selectedProj: null
  }),
  provide() {
    return {
      user: computed(() => this.user),
      selectedProj: computed(() => this.selectedProj)
    }
  },
  methods: {
  }
};
</script>

<style scoped>
#username  {
  font-size: 1.2em;
  line-height: 1.2em;
}
</style>
