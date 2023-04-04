<template>
<v-app>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="grey">Home!!!!</h1>
        <p>{{ user.name }}, {{ user.email }}</p>
        <p>{{ selectedProj }}</p>
      </v-col>
    </v-row>
  </v-container>
</v-app>
</template>

<script>
export default {
  name: "Home",
  inject: {
    user: { default: null },
    selectedProj: { default: null }
  }
}
</script>

<style scoped>

</style>