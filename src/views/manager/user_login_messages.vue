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
          :items="loginMessages"
          :search="search"
      ></v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data () {
    return {
      msg: null,
      data: "{\"managerId\": 1}",
      search: '',
      headers: [
        {
          text: '用户名',
          align: 'start',
          // sortable: false,
          value: 'name',
        },
        { text: '邮箱', value: 'email' },
        { text: '登录时间', value: 'loginTime' },
      ],
      loginMessages: [
        {
          name: 'Frozen Yogurt',
          email: '123@qq.com',
          loginTime: '2023.1.1'
        },
        {
          name: 'aaaa',
          email: '1920@qq.com',
          loginTime: '2023.1.2'
        },
        {
          name: 'hfsak',
          email: '4239@qq.com',
          loginTime: '2023.1.3'
        },
        {
          name: 'Frozen Yogurt',
          email: '123@qq.com',
          loginTime: '2023.1.1'
        },
        {
          name: 'Frozen Yogurt',
          email: '123@qq.com',
          loginTime: '2023.1.1'
        },
      ],
    }
  },
  created() {
    this.showLoginMessages()
  },
  // TODO：传给后端管理员id，如果报错，不显示信息而显示弹窗
  methods: {
    showLoginMessages() {
      /*
      this.axios.get('/api/manager/showUsersLogin', {params: {}})
          .then((response) => {
            console.log(response.data.loginMessages);
            this.loginMessages = response.data.loginMessages
          })
          .catch(function (error) {
            console.log(error);
          });
      */
      //window.alert('您没有查看权限')
      //this.loginMessages = []
      axios.post('/api/manager/showUsersLogin', JSON.parse(this.data))
          .then((response) => {
            if (response.errcode !== 0) {
              window.alert('您没有查看权限');
            } else {
              console.log(response.data.loginMessages);
              this.loginMessages = response.data.loginMessages
            }
          })
    },
  },
}
</script>

<style scoped>

</style>