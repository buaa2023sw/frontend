<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="blue lighten-5" style="min-height: calc(100vh - 64px);">
      <v-col cols="12" sm="8" md="6" lg="4" class="d-flex justify-center">
        <v-card class="elevation-12" style="max-width: 500px;">
          <v-card-text class="mt-4 mb-4">
            <v-form @submit.prevent="register">
              <v-row>
                <v-col cols="12" class="mb-3">
                  <v-text-field label="用户名" v-model="username" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-text-field label="邮箱" v-model="email" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-text-field label="密码" v-model="password" outlined dense type="password"></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-text-field label="确认密码" v-model="confirmPassword" outlined dense type="password"></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-btn color="blue darken-2" class="white--text" block @click="register">注册账号</v-btn>
                </v-col>
                <v-col cols="12" class="text-center">
                  <span class="caption grey--text text--darken-1">已有账号？</span>
                  <v-btn color="transparent" class="grey--text text--darken-1" text @click="$router.push('/login')">前往登录</v-btn>
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
        this.$message({
          type: 'error',
          message: "请完整填写所有注册信息"
        });
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.$message({
          type: 'error',
          message: "请保证密码和确认密码的一致性"
        });
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
              this.$message({
                type: 'error',
                message: "发生未知错误，无法注册，请联系管理员"
              });
            } else if (response.data.errcode === 2) {
              this.$message({
                type: 'error',
                message: "该邮箱已被使用"
              });
            } else if (response.data.errcode === 3) {
              this.$message({
                type: 'error',
                message: "该用户名已被使用"
              });
            } else {
              this.$message({
                type: 'success',
                message: "注册成功"
              });
              console.log("??????????")
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