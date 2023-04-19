<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="搜索"
            single-line
            hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="userMessages"
          :search="search"
      >
        <template #item.resetPassword="{item}">
          <v-btn class="ml-1" small outlined @click="openResetPasswordDialog(item)">重置用户密码</v-btn>
        </template>
        <template #item.changeStatus="{item}">
          <v-btn class="ml-1" small outlined @click="openChangeUserStatusDialog(item)">修改用户状态</v-btn>
        </template>
        <template #item.userProfile="{item}">
          <v-btn class="ml-1" small outlined @click="openUserProfileDialog(item)">用户个人信息</v-btn>
        </template>
        <template #item.userProject="{item}">
          <v-btn class="ml-1" small outlined @click="gotoUserProjectPage(item)">用户所在项目</v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="showResetPassword" width="300">
      <template>
        <v-container class="pa-0">
          <v-card>
            <v-card-title class="headline font-weight text-left"> 重置用户{{ userResetPasswordDialogMessage.name }}的密码 </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="closeResetPasswordDialog">取消</v-btn>
              <v-btn color="blue" text @click="resetPassword">确认</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </template>
    </v-dialog>
    <v-dialog v-model="showChangeUserStatus" width="300">
      <template>
        <v-container class="pa-0">
          <v-card>
            <v-card-title class="headline font-weight text-left"> 修改用户{{userStatusDialogMessage.name}}的状态 </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-radio-group v-model="selectedStatus">
                <v-radio v-for="i in statusList" :key="i.value" :label="i.label" :value="i.value"></v-radio>
              </v-radio-group>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="closeChangeUserStatusDialog">取消</v-btn>
              <v-btn color="blue" text @click="changeStatus">确认修改</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </template>
    </v-dialog>
    <v-dialog v-model="showUserProfile" width="500">
      <template>
        <v-container class="pa-0">
          <v-card>
            <v-card-title class="headline font-weight text-left"> 用户{{userProfileDialogMessage.name}}的个人信息 </v-card-title>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="closeUserProfileDialog">关闭</v-btn>
              <v-btn color="blue" text @click="saveProfile">确认修改</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </template>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data () {
    return {
      msg: null,
      search: '',
      headers: [
        {
          text: '用户名',
          align: 'start',
          // sortable: false,
          value: 'name',
        },
        { text: '邮箱', value: 'email' },
        { text: '注册时间', value: 'registerTime' },
        { text: '状态', value: 'status' },
        {
          text: '',
          sortable: false,
          value: 'resetPassword'
        },
        {
          text: '',
          sortable: false,
          value: 'changeStatus'
        },
        {
          text: '',
          sortable: false,
          value: 'userProfile'
        },
        {
          text: '',
          sortable: false,
          value: 'userProject'
        },
      ],
      userMessages: [
        {
          name: 'user1',
          id: '1',
          email: '123@qq.com',
          registerTime: '2023.1.1',
          status: 'A',
        },
        {
          name: 'faskfl',
          id: '2',
          email: 'gers@qq.com',
          registerTime: '2023.2.1',
          status: 'B',
        },
        {
          name: 'saga',
          id: '3',
          email: '53@qq.com',
          registerTime: '2023.3.1',
          status: 'A',
        },
      ],
      // 重置用户密码dialog相关信息
      showResetPassword: false,
      userResetPasswordDialogMessage: '',
      // 用户状态dialog相关信息
      showChangeUserStatus: false,
      userStatusDialogMessage: '',
      selectedStatus: '',
      statusList: [
        {
          label: '正常',
          value: 'A'
        },
        {
          label: '禁用',
          value: 'B'
        },
      ],
      // 用户个人信息dialog相关信息
      showUserProfile: false,
      userProfileDialogMessage: '',
    }
  },
  created() {
    this.showUserMessages()
  },
  // TODO：传给后端管理员id，如果报错，不显示信息而显示弹窗
  methods: {
    // 显示用户信息
    showUserMessages() {
      let data = JSON.stringify({managerId: 1})
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
    },
    // 打开重置用户密码窗口
    openResetPasswordDialog(item) {
      this.userResetPasswordDialogMessage = item
      console.log("111")
      console.log(this.userResetPasswordDialogMessage)
      this.showResetPassword = true
    },
    // 关闭重置用户密码窗口
    closeResetPasswordDialog() {
      this.showResetPassword = false
      this.userResetPasswordDialogMessage = ''
    },
    // 重置用户密码
    resetPassword() {
      let userId = this.userResetPasswordDialogMessage.id
      let data = JSON.stringify({managerId: 1, userId: userId})
      console.log(data)
      axios.post("/api/management/resetUserPassword", JSON.parse(data))
          .then((response) => {
            console.log(response.data)
            window.alert("成功将用户" + response.data.name + "的密码修改为" + response.data.resetPassword)
          })
          .catch((err) => {
            console.error(err);
          })
      this.showResetPassword = false
      this.userResetPasswordDialogMessage = ''
    },
    // 打开修改用户状态窗口，并显示当前状态
    openChangeUserStatusDialog(item) {
      console.log(item)
      this.userStatusDialogMessage = item
      this.selectedStatus = item.status
      this.showChangeUserStatus = true
    },
    // 关闭修改用户状态窗口
    closeChangeUserStatusDialog() {
      this.showChangeUserStatus = false
      this.userStatusDialogMessage = ''
      this.selectedStatus = ''
    },
    // 修改用户状态
    changeStatus() {
      console.log(this.selectedStatus)
      this.showChangeUserStatus = false
    },
    // 打开用户个人信息窗口
    openUserProfileDialog(item) {
      console.log(item)
      this.userProfileDialogMessage = item
      this.showUserProfile = true
    },
    // 关闭用户个人信息窗口
    closeUserProfileDialog(item) {
      this.showUserProfile = false
      this.userProfileDialogMessage = ''
    },
    // 保存用户个人信息的修改
    saveProfile() { // TODO
      this.showUserProfile = false
    },
    // 跳转到用户所在项目页面
    gotoUserProjectPage(item) {

    }
  },
}
</script>

<style scoped>

</style>