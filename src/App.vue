<template>
  <v-app id="main_page">
    <v-app-bar app clipped-left color="blue" dark extension-height="36">
      <v-app-bar-nav-icon v-if="user" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>BUAA 2023 SW</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-chip v-if="user" outlined v-bind="attrs" v-on="on">{{ user.name }}</v-chip>
          <v-icon v-if="user" v-bind="attrs" v-on="on">mdi-account</v-icon>
          <v-icon v-else v-bind="attrs" v-on="on">mdi-account-remove</v-icon>
        </template>
        <v-card v-if="user" min-width="200px">
          <v-card-title>欢迎, {{ user.name }}</v-card-title>
          <v-card-subtitle>{{ user.email }}</v-card-subtitle>
          <v-list>
            <v-list-item link to="/user/profile">
              <v-list-item-title>个人信息</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="logoff()">
              <v-list-item-title>退出</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card v-else min-width="200px" link to="/login">
          <v-card-title>Please Login</v-card-title>
          <v-list>
            <v-list-item link to="/register">
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <template v-if="showLabel()" v-slot:extension>
        <v-tabs v-model="routeSelect">
          <v-tab link to="/allProject/">Home</v-tab>
          <v-tab link to="/allProject/allTask/">Plan</v-tab>
          <v-tab link to="/dev/">Dev</v-tab>
          <v-tab link to="/allProject/allPerson">Team</v-tab>
          <!--          <v-tab-->
          <!--                  v-for="project in user.projects"-->
          <!--                  :key="project.id"-->
          <!--                  link :to="'/' + ['proj', 'plan', 'dev'][drawerSelect] + '/' + project.id"-->
          <!--                  @click="selectedProj=project.id"-->
          <!--          >{{ project.name }}</v-tab>-->
          <!--          <v-tab v-for="project in user.projects" :key="project.id" link :to="'/proj/' + project.id">{{ project.name }}</v-tab>-->

          <!--          <v-tab link to="/newproj"><v-icon class="px-1">mdi-plus-circle</v-icon> new project</v-tab>-->
        </v-tabs>
      </template>

    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        :mini-variant="mini"
        :expand-on-hover="mini"
        v-if="user"
    >
      <v-list>
        <v-list-item @click.stop="mini = !mini">
          <v-list-item-icon>
            <v-icon v-if="mini">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-h6">{{ mini ? '展开' : '收回' }}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item-group v-if="user.status==='A'" mandatory>
          <v-list-item link :to="'/allProject/'" @click="selectedProj = null">
            <v-list-item-icon><v-icon>mdi-home-outline</v-icon></v-list-item-icon>
            <v-list-item-title>主页</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="setupDialog = true">
            <v-list-item-icon><v-icon>mdi-plus-circle</v-icon></v-list-item-icon>
            <v-list-item-title>新建项目</v-list-item-title>
          </v-list-item>
          <v-list-item link v-for="project in user.projects" :key="project.id" :to="routeSelect" @click="selectedProj = project">
            <v-list-item-icon><v-icon>mdi-developer-board</v-icon></v-list-item-icon>
            <v-list-item-title>{{project.name}}</v-list-item-title>
          </v-list-item>

          <!--          <v-list-item link :to="'/proj/' + selectedProj">-->
          <!--            <v-list-item-icon>-->
          <!--              <v-icon>mdi-home-outline</v-icon>-->
          <!--            </v-list-item-icon>-->
          <!--            <v-list-item-title class="text-h6">主页</v-list-item-title>-->
          <!--          </v-list-item>-->

          <!--          <v-list-item link :to="'/plan/' + selectedProj">-->
          <!--            <v-list-item-icon>-->
          <!--              <v-icon>mdi-book-edit-outline</v-icon>-->
          <!--            </v-list-item-icon>-->
          <!--            <v-list-item-title class="text-h6">规划</v-list-item-title>-->
          <!--          </v-list-item>-->

          <!--          <v-list-item link :to="'/dev/' + selectedProj">-->
          <!--            <v-list-item-icon>-->
          <!--              <v-icon>mdi-laptop</v-icon>-->
          <!--            </v-list-item-icon>-->
          <!--            <v-list-item-title class="text-h6">开发</v-list-item-title>-->
          <!--          </v-list-item>-->
        </v-list-item-group>
        <v-list-item-group v-if="user.status==='C'">
          <v-list-item link to="/manager">
            <v-list-item-icon><v-icon>mdi-home-outline</v-icon></v-list-item-icon>
            <v-list-item-title>主页</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/manager/userMessages">
            <v-list-item-icon><v-icon>mdi-account-multiple</v-icon></v-list-item-icon>
            <v-list-item-title>用户信息</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/manager/loginMessages">
            <v-list-item-icon><v-icon>mdi-history</v-icon></v-list-item-icon>
            <v-list-item-title>用户登录信息</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/manager/projectMessages">
            <v-list-item-icon><v-icon>mdi-book-edit-outline</v-icon></v-list-item-icon>
            <v-list-item-title>项目信息</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <el-dialog
            title="创建项目"
            :visible.sync="setupDialog"
            width="50%"
            :before-close="handleClose">
        <el-form label-position="left" label-width="80px" :model="form" ref="form">
            <el-form-item label="项目名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动概述">
                <el-input type="textarea" v-model="form.intro"  :autosize="{ minRows: 5, maxRows: 10}"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="setupDialog = false">取 消</el-button>
        <el-button type="primary" @click="setupProject">确 定</el-button>
        </span>
    </el-dialog>

      <v-main>
      <router-view v-if="showRouterView" />
    </v-main>
  </v-app>
</template>

<script>
import Cookies from 'js-cookie'
import { computed } from 'vue'
import {newProject} from "@/api/user";
import axios from "axios";

let user = Cookies.get('user')
console.log(user);
if (user === undefined) {
  console.log('not logged in')
  if (window.location.pathname === '/register') {
  } else if (window.location.pathname !== '/login') {
    window.location.pathname = '/login'
  }
} else {
  user = JSON.parse(user)
}

export default {
  name: 'App',
  // created() {
  //     this.$watch(() => this.drawerIndex, (to, from) => {
  //         console.log('drawerIndex change!')
  //         this.showRouterView = false;
  //         this.$nextTick(() => (this.showRouterView = true));
  //     })
  // },
  watch: {
    selectedProj(n, o) {
      console.log('selectedProj change! from ' + o + ' to ' + n)
      this.showRouterView = false;
      this.$nextTick(() => (this.showRouterView = true));
    }
  },
  data: () => {
    return {
      drawer: true,
      mini: true,
      showRouterView: true,
      user: user,
      drawerIndex: null,
      routeSelect: null,
      selectedProj: null,
      setupDialog: false,
      form: {
          name: '',
          intro: '',
          id: ''
      },
    }
  },
  provide() {
    return {
      user: computed(() => this.user),
      selectedProj: computed(() => this.selectedProj),
      changeSelectedProj: this.changeSelectedProj,
      updateUserProj: this.updateUserProj
    }
  },
  methods: {
    showLabel() {
      return this.user !== null && !window.location.pathname.startsWith('/manager')
    },
    // getSelectedProj() {
    //     let pid = this.$route.params.projid;
    //     if (pid === undefined) return null;
    //     else return pid;
    // },
    // getDrawerSelection() {
    //   let drawerSelection = this.$route.
    // },
    logoff() {
      Cookies.remove('user');
      window.location.href = '/login'
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
            .then(()=> {
                done();
            })
            .catch(() => {});
    },
    setupProject() {
        // console.log(this.search);
        // console.log("submit");
        this.setupDialog = false;
        newProject({projectName: this.form.name, projectIntro: this.form.intro, userId: this.user.id}).then(
            res => {
                console.log(res);
                this.updateUserProj();
            }
        );
        this.form =  {
            name: '',
            intro: ''
        }
    },
    changeSelectedProj(proj) {
      this.selectedProj = proj;
    },
    updateUserProj() {
      axios.post('/api/plan/watchAllProject', {
          userId: this.user.id
      }).then(res => {
          if (res.data.errcode === 0) {
              this.user.projects = res.data.data.map((cur, index, arr) => {
                  return {
                      id: cur.projectId,
                      name: cur.projectName
                  }
              })
              Cookies.set('user', JSON.stringify(this.user))
          } else {
              alert('updateUserProj failure! with non 0 errcode ' + res.data.errcode);
          }
      }).catch(err => {
          alert('updateUserProj failure! with error ' + err);
      })
    }
  }
};
</script>

<style scoped>
#username  {
  font-size: 1.2em;
  line-height: 1.2em;
}
</style>