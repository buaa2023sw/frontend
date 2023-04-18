<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="blue lighten-5" style="min-height: calc(100vh - 64px);">
      <v-col cols="12" sm="8" md="6" lg="4" class="d-flex justify-center">
        <v-card class="elevation-12" style="max-width: 500px;">
          <v-card-text class="mt-4 mb-4">
            <v-form @submit.prevent="login">
              <v-row>
                <v-col cols="12" class="mb-3">
                  <v-text-field label="用户名" v-model="inputUserName" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-text-field label="密码" v-model="inputUserPwd" outlined dense type="password"></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-btn :disabled="busy" color="blue darken-2" class="white--text" block @click="login">登录</v-btn>
                </v-col>
                <v-col cols="12" class="text-center">
                  <span class="caption grey--text text--darken-1">没有账号？</span>
                  <v-btn :disabled="busy" color="transparent" class="grey--text text--darken-1" text @click="$router.push('/register')">注册</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cookies from 'js-cookie'
import axios from "axios";

if (Cookies.get('user') !== undefined) {
  alert('您已处于登录状态');
  window.location.href = '/home';
}

export default {
  name: "login",
  data() {
    return {
      busy : false,
      inputUserName: null,
      inputUserPwd: null
    }
  },
  methods: {
    async login() {
      // this.busy = true
      console.log(JSON.stringify({
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
      let inputUserName = this.inputUserName
      let inputUserPwd = this.inputUserPwd
      let data = "{\"username\":" + inputUserName + ", \"password\":" + inputUserPwd + "}"
      console.log(data)
      axios.post("/api/management/showUsers", JSON.parse(data))
          .then((response) => {
            console.log(response)
            this.userMessages = response.data.users
          })
          .catch((err) => {
            console.error(err);
            this.userMessages = null
          })



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