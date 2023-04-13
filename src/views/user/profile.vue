<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card class="mx-auto" width="800" height="300" padding="16">
          <v-card-title class="headline font-weight text-left">查看个人信息</v-card-title>
          <v-divider></v-divider>
          <v-row align="center">
            <v-col cols="3" class="text-center">
              <v-avatar size="100">
                <img :src="userInfo.avatar" alt="avatar">
              </v-avatar>
              <div> {{ showedUserName }} </div>
            </v-col>
            <v-col cols="8">
              <v-text-field label="用户名" v-model="userInfo.username" outlined dense></v-text-field>
              <v-text-field label="邮箱" v-model="userInfo.email" outlined dense></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="openChangePasswordDialog">修改密码</v-btn>
            <v-btn color="primary" text @click="save">保存</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showChangePassword" width="500">
      <template>
        <v-container class="pa-0">
          <v-card>
            <v-card-title class="headline font-weight text-left">修改密码</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="4"><div class="input-label">原密码：</div></v-col>
                <v-col cols="8"><div class="input-field"><v-text-field v-model="oldPassword" outlined dense></v-text-field></div></v-col>
              </v-row>
              <v-row>
                <v-col cols="4"><div class="input-label">新密码：</div></v-col>
                <v-col cols="8"><div class="input-field"><v-text-field v-model="newPassword" outlined dense></v-text-field></div></v-col>
              </v-row>
              <v-row>
                <v-col cols="4"><div class="input-label">确认新密码：</div></v-col>
                <v-col cols="8"><div class="input-field"><v-text-field v-model="confirmNewPassword" outlined dense></v-text-field></div></v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="closeChangePasswordDialog">取消</v-btn>
              <v-btn color="blue" text @click="changePassword">确认修改</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </template>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "profile",
  data() {
    return {
      // 用户信息
      showedUserName: "aaa", // 显示在头像下方的用户名
      userInfo: {
        username: "John Doe",
        email: "johndoe@example.com",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      },
      // 修改密码对话框的显示
      showChangePassword: false,
      // 修改密码相关变量
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };
  },
  created() {
    this.showProfile()
  },
  methods: {
    showProfile() {
      // 调用后端接口获取用户信息
      this.axios.get('/api/user') // TODO
          .then(response => {
            this.showedUserName = response.data.userInfo.username
            this.userInfo = response.data.userInfo
          })
          .catch(error => {
            console.log(error)
          })
    },
    // 保存用户信息
    save() {
      // 获取用户修改后的用户名和邮箱
      const username = this.userInfo.username
      const email = this.userInfo.email

      // 调用后端接口保存用户信息
      this.axios.put('/api/user', { username, email }) // TODO:用户名已被使用等提示信息
          .then(response => {
            // 保存成功，弹出提示框
            this.$toast.success('保存成功')
          })
          .catch(error => {
            // 保存失败，弹出提示框
            this.$toast.error('保存失败')
            console.log(error)
          })
    },
    // 修改密码
    async changePassword() {
      if (this.newPassword !== this.confirmNewPassword) {
        window.alert('请保证新密码和确认新密码内容一致')
      }
      if (this.newPassword === "") {
        window.alert('新密码不能为空')
      }
      await this.axios.get('edit_password/', // TODO
          {
            params: {
              old_password: this.oldPassword,
              new_password: this.newPassword,
              user_id: this.$store.state.userId // TODO
            }
          })
          .catch(function (error) {
            console.log(error);
            window.alert('请重新确认原密码')
          })
          .then((response) => {
            if (response.data.errcode !== 0) { // TODO
              this.res = false
              console.log(response.data.msg);
              window.alert('请重新确认原密码')
              return
            }
            this.showChangePassword = false;
            window.alert('密码修改成功')
          })
    },
    openChangePasswordDialog() {
      this.showChangePassword = true;
    },
    closeChangePasswordDialog() {
      this.showChangePassword = false;
    }
  },
};
</script>

<style scoped>
.v-text-field {
  margin: 16px;
}

.v-card-actions {
  margin-top: 8px;
}
.v-card-text {
  margin-top: 24px !important;
}
.input-label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 48px;
  font-size: 16px;
}
.input-field {
  display: flex;
  align-items: center;
  height: 48px;
}
/*
.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.input-label {
  width: 120px;
  text-align: right;
  margin-right: 16px;
  font-weight: bold;
}
.input-field {
  flex: 1;
}
*/
</style>
