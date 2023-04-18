<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="3" class=""></v-col>
        <v-col cols="6">
          <v-text-field label="用户名" v-model="username"></v-text-field>
          <v-text-field label="邮箱" v-model="email"></v-text-field>
          <v-text-field label="密码" type="password" v-model="password"></v-text-field>
          <v-text-field label="确认密码" type="password" v-model="confirmPassword"></v-text-field>
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
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  },
  methods: {
    register() {
      let data = JSON.stringify({
        username: this.username,
        email: this.email,
        password: this.password
      })
      // console.log(data)
      axios.post("/api/register", JSON.parse(data))
          .then((response) => {
            console.log(response)
            this.userMessages = response.data.users
          })
          .catch((err) => {
            console.error(err);
            this.userMessages = null
          })
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