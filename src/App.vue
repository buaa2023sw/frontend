<template>
  <v-app id="main_page">

    <v-navigation-drawer
        v-model="drawer"
        app
        :mini-variant="mini"
        :expand-on-hover="mini"
    >
      <v-list>
        <v-list-item class="px-2" link>
          <v-list-item-avatar>
            <v-icon x-large>mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
          <v-list-item-title id="username">
            {{ user.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.email }}
          </v-list-item-subtitle>
          </v-list-item-content>

        </v-list-item>

        <v-divider></v-divider>

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
      <v-app-bar width="100%" color="blue" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>BUAA 2023 SW</v-toolbar-title>
      </v-app-bar>

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
    user: {
      id: 1,
      name: 'TrickEye',
      email: 'trickeye@buaa.edu.cn'
    }
  }),
  provide() {
    return {
      user: computed(() => this.user)
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
