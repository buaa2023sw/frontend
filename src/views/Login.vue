<template>
<v-app>
  <v-container>
    <v-row>
      <v-col cols="3" class=""></v-col>
      <v-col cols="6">
        <v-text-field label="Email" v-model="inputUserEmail"></v-text-field>
        <v-text-field label="Password" type="password" v-model="inputUserPwd"></v-text-field>
      </v-col>
      <v-col cols="3" class=""></v-col>
    </v-row>
    <v-row class="">
      <v-col cols="3"></v-col>
      <v-col cols="2">
        <v-btn :disabled="busy" block @click="login()">login</v-btn>
      </v-col>
      <v-col cols="2"></v-col>
      <v-col cols="2">
        <v-btn :disabled="busy" block link to="/register">register</v-btn>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
  </v-container>

</v-app>
</template>

<script>
import Cookies from 'js-cookie'

if (Cookies.get('user') !== undefined) {
  alert('already logged in!');
  window.location.href = '/home';
}

export default {
  name: "login",
  data() {
    return {
      busy : false,
      inputUserEmail: null,
      inputUserPwd: null
    }
  },
  methods: {
    async login() {
      this.busy = true
      let inputUserEmail = this.inputUserEmail
      let inputUserPwd = this.inputUserPwd
      this.inputUserPwd = null
      setTimeout(() => {
        this.busy = false
        if (inputUserEmail === 'trickeye@buaa.edu.cn') {
          Cookies.set('user', JSON.stringify({
            id: 1,
            name: 'TrickEye',
            email: 'trickeye@buaa.edu.cn',
            projects: [{
              id: 1,
              name: 'Project1'
            }, {
              id: 2,
              name: 'Project2'
            }]
          }))
          window.location.href = '/home'
        } else if (inputUserEmail === '20373866@buaa.edu.cn') {
          Cookies.set('user', JSON.stringify({
            id: 1,
            name: '20373866',
            email: '20373866@buaa.edu.cn',
            projects: [{
              id: 1,
              name: 'Project1'
            }, {
              id: 3,
              name: 'Project3'
            }]
          }))
          window.location.href = '/home'
        } else {
          alert('wrong!')
        }
      }, 1500)
    }
  }
}
</script>

<style scoped>

</style>