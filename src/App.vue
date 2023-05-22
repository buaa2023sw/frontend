<template>
  <v-app id="main_page">
    <v-app-bar app clipped-left ref="appBar" color="blue" dark extension-height="36" :absolute="true">
      <v-toolbar-title style="font-weight: bold">JiHub</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-icon v-if="false" style="right: 1%">mdi-bell</v-icon>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-if="existUser()" icon color="white" v-bind="attrs" v-on="on" @click="gotoHomePage">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>主页</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-if="existManager()" icon color="white" v-bind="attrs" v-on="on" @click="gotoManagerPage">
            <v-icon>mdi-link-variant</v-icon>
          </v-btn>
        </template>
        <span>管理端</span>
      </v-tooltip>

      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-chip v-if="user" outlined v-bind="attrs" v-on="on">{{
            user.name
          }}</v-chip>
          <v-icon v-if="user" v-bind="attrs" v-on="on">mdi-account</v-icon>
          <v-icon v-else v-bind="attrs" v-on="on">mdi-account-remove</v-icon>
        </template>
        <v-card v-if="user" min-width="200px">
          <v-card-title>欢迎, {{ user.name }}</v-card-title>
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
          <v-card-title>请登录</v-card-title>
          <v-list>
            <v-list-item link to="/register">
              <v-list-item-title>注册</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <template v-if="showLabel()" v-slot:extension>
        <v-tab link to="/allProject/">
          <v-icon middle>mdi-home-outline</v-icon>
          主页
        </v-tab>
        <v-menu
            transition="scroll-y-transition"
            v-if="user.projects.length"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                v-bind="attrs"
                v-on="on"
              >
                项目
                <v-icon v-if="attrs['aria-expanded'] === 'false'" right>
                  mdi-menu-down
                </v-icon>
                <v-icon v-else>
                  mdi-menu-up
                </v-icon>
              </v-btn>
            </template>

            <v-card min-width="200px">
              <v-list nav rounded class="grey lighten-3">
                <v-subheader>最近项目</v-subheader>
                <v-list-item-group color="primary">
                  <v-list-item
                      two-line
                      v-for="item in user.projects.slice(0, 5)"
                      :key="item.id"
                      @click="getProj(item)"
                  >
                    <v-list-item-avatar>
                      <v-avatar size="40" color="indigo" >
                        <span class="white--text text-h5">{{ item.projectName[0] }}</span>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title style="font-weight: bold">{{ item.projectName }}</v-list-item-title>
                      <v-list-item-subtitle> {{item.projectIntro === '' ? '暂无简介' : item.projectIntro }} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>

              <v-divider></v-divider>

              <v-list class="grey lighten-3">
                <v-list-item-group
                    color="primary"
                >
                  <v-list-item>
                    <router-link :to="{path: '/allProject/'}" custom v-slot="{ navigate }">
                      <button @click="navigate" @keypress.enter="navigate" role="link">查看所有项目</button>
                    </router-link>
                  </v-list-item>
                  <v-list-item @click.stop="setupDialog = true" link>
                    新建项目
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>

          </v-menu>
        <!-- <v-tabs v-model="routeSelect"> -->
          <!-- <v-tab link to="/allProject/">项目</v-tab> -->
          <!-- <v-tab link to="/allProject/allTask/">Plan</v-tab>
          <v-tab link to="/dev/">Dev</v-tab>
          <v-tab link to="/allProject/allPerson">Team</v-tab> -->
          <!--          <v-tab-->
          <!--                  v-for="project in user.projects"-->
          <!--                  :key="project.id"-->
          <!--                  link :to="'/' + ['proj', 'plan', 'dev'][drawerSelect] + '/' + project.id"-->
          <!--                  @click="selectedProj=project.id"-->
          <!--          >{{ project.name }}</v-tab>-->
          <!--          <v-tab v-for="project in user.projects" :key="project.id" link :to="'/proj/' + project.id">{{ project.name }}</v-tab>-->

          <!--          <v-tab link to="/newproj"><v-icon class="px-1">mdi-plus-circle</v-icon> new project</v-tab>-->
        <!-- </v-tabs> -->
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      permanent
      v-if="((user && proj && showLabel()) || (user && user.status === 'C')) && (this.$refs.appBar === undefined || this.$refs.appBar.isScrollingUp)"
    >
      <!-- <div style="background-color: aqua;width: 100%;">

      </div> -->
      <v-list v-if="user.status !== 'C'">
        <v-list-item two-line class="px-2">
          <v-avatar size="40" color="indigo" >
            <span class="white--text text-h5">{{ this.proj.projectName[0] }}</span>
          </v-avatar>
          <v-list-item-content class="px-3">
              <!-- <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img> -->
            <v-list-item-title class="text-h5" style="font-weight: bold">
              {{this.proj.projectName}}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{this.proj.projectIntro == '' ? '暂无简介' : this.proj.projectIntro}}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{this.proj.managerName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{this.user.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list subheader v-if="user.status !== 'C'">
      <v-subheader>规划</v-subheader>
      <v-list-item  link :to="'/allTask'">
        <v-list-item-avatar>
          <v-icon>mdi-ballot-outline</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>任务列表</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link :to="'/allPerson'">
        <v-list-item-avatar>
          <v-icon>mdi-account-outline</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>人员列表</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="gotoPic">
        <v-list-item-avatar>
          <v-icon>mdi-align-vertical-bottom</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>图表展示</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader>开发</v-subheader>
      <v-list-item link :to="'/dev'">
        <v-list-item-avatar>
          <v-icon>mdi-align-vertical-center</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>代码</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link :to="'/user/ai/diagnosis'">
        <v-list-item-avatar>
          <v-icon>mdi-palette-outline</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>代码诊断</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-subheader>沟通</v-subheader>
          <v-dialog
          width="1300"
          v-model="dialog"
          fullscreen
          transition="dialog-bottom-transition"
          hide-overlay>
          <template v-slot:activator="{on, attrs}">
          <v-list-item>
            <v-list-item-avatar>
          <v-icon>mdi-file-document-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-bind="attrs" v-on="on">共享文档</v-list-item-title>
        </v-list-item-content>
        </v-list-item>
        </template>
        <AllFile @close="closeDocument"></AllFile>
          </v-dialog>
      <v-list-item link :to="'/user/todo'">
        <v-list-item-avatar>
          <v-icon>mdi-account-group-outline</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>讨论室</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

      <v-list subheader v-if="user.status === 'C'">
        <v-list-item link to="/manager/home">
          <v-list-item-icon><v-icon>mdi-home-outline</v-icon></v-list-item-icon>
          <v-list-item-title>主页</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/manager/userMessages">
          <v-list-item-icon
          ><v-icon>mdi-account-multiple</v-icon></v-list-item-icon
          >
          <v-list-item-title>用户信息</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/manager/loginMessages">
          <v-list-item-icon><v-icon>mdi-history</v-icon></v-list-item-icon>
          <v-list-item-title>用户登录信息</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/manager/projectMessages">
          <v-list-item-icon
          ><v-icon>mdi-book-edit-outline</v-icon></v-list-item-icon
          >
          <v-list-item-title>项目信息</v-list-item-title>
        </v-list-item>
      </v-list>
<!--        <v-list>-->
<!--        <v-list-item-group v-if="user.status === 'C'">-->
<!--          <v-list-item link to="/manager">-->
<!--            <v-list-item-icon-->
<!--              ><v-icon>mdi-home-outline</v-icon></v-list-item-icon-->
<!--            >-->
<!--            <v-list-item-title>主页</v-list-item-title>-->
<!--          </v-list-item>-->
<!--          <v-list-item link to="/manager/userMessages">-->
<!--            <v-list-item-icon-->
<!--              ><v-icon>mdi-account-multiple</v-icon></v-list-item-icon-->
<!--            >-->
<!--            <v-list-item-title>用户信息</v-list-item-title>-->
<!--          </v-list-item>-->
<!--          <v-list-item link to="/manager/loginMessages">-->
<!--            <v-list-item-icon><v-icon>mdi-history</v-icon></v-list-item-icon>-->
<!--            <v-list-item-title>用户登录信息</v-list-item-title>-->
<!--          </v-list-item>-->
<!--          <v-list-item link to="/manager/projectMessages">-->
<!--            <v-list-item-icon-->
<!--              ><v-icon>mdi-book-edit-outline</v-icon></v-list-item-icon-->
<!--            >-->
<!--            <v-list-item-title>项目信息</v-list-item-title>-->
<!--          </v-list-item>-->
<!--        </v-list-item-group>-->
<!--      </v-list>-->
    </v-navigation-drawer>

    <el-dialog
      title="创建项目"
      :visible.sync="setupDialog"
       width="50%"
      :before-close="handleClose">
      <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
      <el-form-item label="项目名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动概述">
        <el-input type="textarea" v-model="form.intro"  :autosize="{ minRows: 5, maxRows: 10}"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSetupProject">取 消</el-button>
        <el-button type="primary" @click="setupProject">确 定</el-button>
      </span>
      </el-dialog>

    <v-main>
      <router-view v-if="showRouterView"/>
    </v-main>
  </v-app>
</template>

<script>
import Cookies from "js-cookie"
import { computed } from "vue"
import { newProject, showTaskList, watchAllProject, getEmail} from "@/api/user"
import axios from "axios"
import AllTask from "@/views/user/projectPlanning/allTask.vue"
import AllFile from "@/views/user/document/allFile.vue"
// import allTask from "@/views/user/projectPlanning/allTask"

let user = Cookies.get("user");
console.log(user);
if (user === undefined) {
  console.log("not logged in");
  if (window.location.pathname === "/register") {
  } else if (window.location.pathname !== "/login") {
    window.location.href = '/login'
  }
} else {
  console.log("logged in");
  user = JSON.parse(user);
  console.log(window.location.pathname);
  if (window.location.pathname === "/") {
  window.location.href = "/allProject/";
  }
}

export default {
  name: "App",
  // created() {
  //     this.$watch(() => this.drawerIndex, (to, from) => {
  //         console.log('drawerIndex change!')
  //         this.showRouterView = false;
  //         this.$nextTick(() => (this.showRouterView = true));
  //     })
  // }
  created() {
    this.updateUserProj();
  },
  components:{
    AllTask,
    AllFile,
  },
  watch: {
    selectedProj(n, o) {
      console.log("selectedProj change! from " + o + " to " + n);
      this.showRouterView = false;
      this.$nextTick(() => (this.showRouterView = true));
    },
  },
  data: () => {
    return {
      labelPosition: "left",
      drawer: true,
      mini: true,
      showRouterView: true,
      user: user,
      proj: null,
      drawerIndex: null,
      routeSelect: null,
      selectedProj: null,
      setupDialog: false,
      selectedItem: null,
      dialog: false,
      form: {
        name: "",
        intro: "",
        id: "",
      },
      projectData: [],
      tasks: []
    };
  },
  beforeUpdate() {
    // this.drawer = user && proj && showLabel();
    console.log("beforeUpdate");
    console.log(window.location.pathname);
    this.showLabel();
    let proj = undefined;
    if (user !== undefined) {
      if (user.status !== 'C') {
      proj = Cookies.get("proj");
      console.log(proj);
      if (proj === undefined && window.location.pathname !== '/allFile') {
        console.log("not choose project");
        if (
        window.location.pathname === "/register" ||  window.location.pathname === "/user/profile" ||
        window.location.pathname === "/login" || window.location.pathname === "/manager"
         ) {
         } else if (window.location.pathname !== "/allProject/") {
          window.location.href = "/allProject/";
        }
      } else {
      proj = JSON.parse(proj);
      console.log("proj not undefined");
      console.log(proj);
      console.log(proj.projectId);
      }
    }
  }
  this.proj = proj;
  },
  provide() {
    return {
      user: computed(() => this.user),
      proj: computed(() => this.proj),
      selectedProj: computed(() => this.proj),
      changeSelectedProj: this.changeSelectedProj,
      updateUserProj: this.updateUserProj,
      updateUser: this.updateUser
      // reload:this.reload
    };
  },
  methods: {
    updateUser() {
      var userCookie = Cookies.get("user")
      if (userCookie !== undefined) {
        this.user = JSON.parse(userCookie)
      }
    },
    closeDocument() {
      this.dialog = false;
    },
    getEmail(id) {
      getEmail({id: id}).then(
        res => {
          console.log("getEmail");
          console.log(res);
          console.log(id);
          return res['data']['data'];
        }
      )
    },
    get_project() {
      Cookies.remove("proj");
      console.log("get_project");
      watchAllProject({userId: this.user.id}).then(
        res => {
          this.projectData = res['data']['data'];
          console.log(this.projectData);
          }
      )
    },
    getTaskList() {
      console.log(this.user.id);
      console.log(this.selectedProj);
      showTaskList({userId: this.user.id, projectId: this.proj.projectId}).then(
         res => {
          console.log("getTaskList");
          console.log(res);
          this.tasks = res['data']['data'];
          console.log(this.tasks);
        }
      );
    },
    gotoPic() {
      this.getTaskList();
      let projectItem = [];
      let projectItemStart = [];
      let projectItemEnd = [];
      let workloads = [];
      let expectedDates = [];
      let actualDates = [];
      let projectState = [];
      console.log(this.tasks);
      for(let i=0;i < this.tasks.length;i++) {
        for (let j=0;j < this.tasks[i].subTaskList.length;j++) {
          projectItem.push(this.tasks[i].subTaskList[j].subTaskName);
          projectItemStart.push(this.tasks[i].subTaskList[j].start_time.slice(0, 10));
          projectItemEnd.push(this.tasks[i].subTaskList[j].deadline.slice(0, 10));
          workloads.push(parseInt(this.tasks[i].subTaskList[j].contribute));
          expectedDates.push(this.tasks[i].subTaskList[j].deadline.slice(0, 10));
          actualDates.push(this.tasks[i].subTaskList[j].complete_time.slice(0, 10));
          projectState.push(this.tasks[i].subTaskList[j].status);
        }
      }
      console.log(projectItem);console.log(projectItemStart);console.log(projectItemEnd);
      if (projectItem.length == 0) {
        this.$message({
          type: 'info',
          message: '您还没有任务!'
        });
      } else {
      this.$router.push({path:'/picture'
      , query: {
        projectItem: projectItem, projectItemStart: projectItemStart, projectItemEnd: projectItemEnd,
        workloads: workloads, expectedDates: expectedDates, actualDates: actualDates, projectState: projectState
      }});
    }
    },
    getProj(item) {
      console.log("getProj");
      console.log(item);
      console.log(JSON.stringify(item));
      Cookies.set('proj', JSON.stringify(item));
      window.location.href = '/allTask';
      this.proj = Cookies.get(proj);
    },
    existManager() {
      return Cookies.get("manager");
    },
    existUser() {
      console.log("111111")
      console.log(Cookies.get("user"))
      let tmp = JSON.parse(Cookies.get("user"))
      return tmp.status === 'A'
    },
    gotoHomePage() {
      window.location.href = '/allProject'
    },
    gotoManagerPage() {
      Cookies.set("user", Cookies.get("manager"))
      Cookies.remove("manager");
      Cookies.remove("proj");
      console.log("user")
      console.log(Cookies.get("user"))
      console.log("manager")
      console.log(Cookies.get("manager"))
      window.location.href = '/manager/userMessages'
    },
    showLabel() {
      if (this.user === undefined || this.user.status === 'C') {
        return false;
      }
      console.log("showLabel");
      console.log(this.proj);
      console.log(this.user);
      console.log(this.$route.path);

      console.log(   this.user !== null && this.proj !== undefined &&
        !window.location.pathname.startsWith("/manager") &&
        this.$route.path !== "/allProject/" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register"));

      return (
        this.user !== null && this.proj !== undefined &&
        !window.location.pathname.startsWith("/manager") &&
        this.$route.path !== "/allProject/" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      );
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
      Cookies.remove("user");
      Cookies.remove("manager");
      window.location.href = "/login";
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    cancelSetupProject() {
      this.setupDialog = false;
      this.form =  {
        name: '',
        intro: ''
      }
    },
    setupProject() {
      // console.log(this.search);
      // console.log("submit");
      watchAllProject({userId: this.user.id}).then(
        res => {
          this.projectData = res['data']['data'];
          console.log(this.projectData);
          }
      )
      if (this.form.name.trim() === "") {
        this.$message({
          type: 'error',
          message:'项目名不能为空！'
        });
        return;
      }
      for (let i=0;i<this.projectData.length;i++) {
        if (this.form.name === this.projectData[i].projectName) {
          this.$message({
          type: 'error',
          message:'已存在同名项目'
        });
        return;
        }
      }
      this.setupDialog = false;
      newProject({projectName: this.form.name, projectIntro: this.form.intro, userId: this.user.id}).then(
        res => {
          console.log(this.user.id);
          console.log(res);
          this.updateUserProj();
          this.get_project();
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
      if (this.user !== undefined) {
      axios
        .post("/api/plan/watchAllProject", {
          userId: this.user.id,
        })
        .then((res) => {
           console.log("updateProj");
           console.log(res);
          if (res.data.errcode === 0) {
            this.user.projects = res['data']['data'];
            Cookies.set("user", JSON.stringify(this.user));
          } else {
            alert(
              "updateUserProj failure! with non 0 errcode " + res.data.errcode
            );
          }
        })
        .catch((err) => {
          alert("updateUserProj failure! with error " + err);
        });
    }},
  },
};
</script>

<style scoped>
#username {
  font-size: 1.2em;
  line-height: 1.2em;
}
</style>