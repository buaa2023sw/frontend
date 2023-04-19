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
import util from "@/views/util";

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
      if(!util.trim(this.username) || !util.trim(this.email)
          || !util.trim(this.password) || !util.trim(this.confirmPassword)){
        window.alert('请完整填写所有注册信息');
        return;
      }
      if (this.password !== this.confirmPassword) {
        window.alert("请保证密码和确认密码的一致性")
        return
      }
      axios.post("/api/register", {
        username: this.username,
        email: this.email,
        password: this.password
      })
          .then((response) => {
            console.log(response.data)
            if (response.data.errcode === 1) {
              window.alert('发生未知错误，无法注册，请联系管理员')
            } else if (response.data.errcode === 2) {
              window.alert('该邮箱已被使用')
            } else if (response.data.errcode === 3) {
              window.alert('该用户名已被使用')
            } else {
              window.alert('注册成功')
              window.location.href = '/login'
            }
          })
          .catch((err) => {
            console.error(err)
            window.alert('发生未知错误，无法注册，请联系管理员')
          })
    }
  }
}
</script>

<style scoped>

</style>