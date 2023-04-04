<template>
<v-app>
  <v-container>
    <v-row @click="say(user)">
      <v-col cols="12">
        <h1 class="grey">Home!!!!</h1>
        <p>{{ user }}</p>
        <p>{{ selectedProj }}</p>
      </v-col>
    </v-row>
  </v-container>
</v-app>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: "Home",
  inject: {
    user: { default: null },
    selectedProj: { default: null }
  },
  methods: {
    say(what) {
      console.log(what)
      console.log(Cookies.get('user'))
    }
  }
}
</script>

<style scoped>

</style>