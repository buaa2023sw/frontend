<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="3" class=""></v-col>
        <v-col cols="6">
          <v-text-field label="Email" v-model="inputUserEmail"></v-text-field>
          <v-text-field label="Password" type="password" v-model="inputUserPwd"></v-text-field>
          <v-text-field label="Confirm Password" type="password" v-model="confirmUserPwd"></v-text-field>
        </v-col>
        <v-col cols="3" class=""></v-col>
      </v-row>
      <v-row class="">
        <v-col cols="3"></v-col>
        <v-col cols="2">
          <v-btn block @click="register()">register</v-btn>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="2">
          <v-btn block link to="/login">have account?</v-btn>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>
    </v-container>

  </v-app>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      inputUserEmail: '',
      inputUserPwd: '',
      confirmUserPwd: ''
    }
  },
  methods: {
    register() {
      console.log('ok, I know your email is ' + this.inputUserEmail +
          ' and your user pwd is ' + this.inputUserPwd +
          ' and your confirm pwd is ' + this.confirmUserPwd)
      console.log('but I dont want to process it now.')
      console.log('Go back!')
      window.location.href = '/login'
    }
  }
}
</script>

<style scoped>

</style>