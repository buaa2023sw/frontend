<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="blue lighten-5" style="min-height: calc(100vh - 64px);">
      <v-col cols="12" sm="8" md="6" lg="4" class="d-flex justify-center">
        <v-card class="elevation-12" style="max-width: 500px;">
          <v-card-text class="mt-4 mb-4">
            <v-form @submit.prevent="login">
              <v-row>
                <v-col cols="12" class="mb-3">
                  <v-text-field label="用户名或邮箱" v-model="userNameOrEmail" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-text-field label="密码" v-model="password" outlined dense type="password"></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-btn color="blue darken-2" class="white--text" block @click="login">登录</v-btn>
                </v-col>
                <v-col cols="12" class="text-center">
                  <span class="caption grey--text text--darken-1">没有账号？</span>
                  <v-btn color="transparent" class="grey--text text--darken-1" text @click="$router.push('/register')">前往注册</v-btn>
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
import util from './util'
import Cookies from 'js-cookie'
import axios from "axios"
import { sha256 } from 'js-sha256'

if (Cookies.get('user') !== undefined) {
  // alert('您已处于登录状态');
  window.location.href = '/allProject';
}

export default {
  name: "login",
  data() {
    return {
      userNameOrEmail: '',
      password: '',
    }
  },
  methods: {
    async login() {
      if(!util.trim(this.userNameOrEmail) || !util.trim(this.password)){
        this.$message({
          type: 'error',
          message: "用户名或邮箱、密码不能为空"
        });
        return;
      }
      // console.log(this.userNameOrEmail)
      // console.log(this.password)
      // console.log({
      //   userNameOrEmail: this.userNameOrEmail,
      //   password: this.password
      // })
      let secretpassword = sha256(this.password)
      console.log(secretpassword)
      axios.post("/api/login", {
        userNameOrEmail: this.userNameOrEmail,
        password: secretpassword
      })
          .then((response) => {
            console.log(response.data)
            if (response.data.errcode === 1) {
              this.$message({
                type: 'error',
                message: "用户不存在"
              });
            } else if (response.data.errcode === 2) {
              this.$message({
                type: 'error',
                message: "密码错误"
              });
            } else if (response.data.errcode === 3) {
              this.$message({
                type: 'error',
                message: "您的账户目前已被禁用"
              });
            } else {
              Cookies.set('user', JSON.stringify(response.data.data))
              this.$message({
                type: 'success',
                message: "登录成功"
              });
              if (response.data.data.status === 'C') {
                window.location.href = '/manager/home'
              } else {
                window.location.href = '/allProject'
              }
            }
          })
          .catch((err) => {
            console.error(err);
          })
    }
  }
}
</script>

<style scoped>

</style>