<template>
    <v-app>
    <v-app-bar clipped-left color="blue" dark extension-height="36" :absolute="true">
    <v-btn icon dark @click="close">
        <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-toolbar-title>共享文档</v-toolbar-title>
    </v-app-bar>

    <v-main style="position: absolute;width:100%;height: 100%;">
        <div style="background-color: aliceblue;position: absolute;left:%0;width:1300px;height: 100%;">
        <v-data-table
        :headers="headers"
        :items="fileData"
        :single-expand="true"
        :items-per-page="5"
        show-expand
        :expanded.sync="expanded"
        class="elevation-1"
        item-key="projectId"
        :search="search"
        :custom-filter="filterOnlyCapsText"
        style="position:absolute;right:0;left:0"
      >
      <template v-slot:no-data>
       <div style="text-align: center;">
          <img src="../../../assets/search.png" height="150px" width="150px"/>
        </div> 
       <div style="font-size:20px;font-weight: bold">
          没有找到数据
        </div>
     <v-img
      max-height="30%"
      max-width="30%"
      style  src="@/assets/search.png"></v-img>
   </template>
      <template v-slot:no-results>
         <div style="text-align: center;">
          <img src="../../../assets/search.png" height="150px" width="150px"/>
        </div> 
         <div style="font-size:20px;font-weight: bold">
          没有找到数据
        </div>
      </template>
        <template v-slot:top>
          <div style="width: 100%; height: 100%; position: relative">
            <v-text-field
              v-model="search"
              label="输入名称"
              class="mx-4"
              style="width: 30%; display: inline-block"
            ></v-text-field>
            <v-btn
              style="
                top: 20%;
                right: 2%;
                height: 60%;
                width: 10%;
                position: absolute;
              "
              depressed
              color="primary"
              @click="setupDialog = true"
              >创建项目</v-btn
            >
          </div>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            {{ item.projectIntro }}
          </td>
        </template>
        <template v-slot:[`item.managerName`]="{ item }">
          <div style="position: relative">
            <v-avatar size="25" color="indigo">
              <span class="white--text text-h6">{{ item.managerName[0] }}</span>
            </v-avatar>
            <div style="position: absolute; left: 20%; bottom: 3%">
              {{ item.managerName }}
            </div>
          </div>
        </template>
        <template v-slot:[`item.projectName`]="{ item }">
          <a @click="getProj(item)">{{ item.projectName }}</a>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="handleEdit(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="handleDelete(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:[`item.state`]="{ item }">
          <v-chip :color="getColor(item.state)" dark @click="handleState(item)">
            {{ transform(item.state) }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
    </v-main>
  <!-- </v-app> 
       <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>共享文档</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-data-table
        :headers="headers"
        :items="fileData"
        :single-expand="true"
        :items-per-page="5"
        show-expand
        :expanded.sync="expanded"
        class="elevation-1"
        item-key="projectId"
        :search="search"
        :custom-filter="filterOnlyCapsText"
      >
      <template v-slot:no-data>
        <div style="text-align: center;">
          <img src="../../../assets/search.png" height="150px" width="150px"/>
        </div>
        <div style="font-size:20px;font-weight: bold">
          没有找到数据
        </div>
     <v-img
      max-height="30%"
      max-width="30%"
      style  src="@/assets/search.png"></v-img>="position:absolute;left:35%;right:35%;top:5%"
     </template> 
      <template v-slot:no-results> 
        <div style="text-align: center;">
          <img src="../../../assets/search.png" height="150px" width="150px"/>
        </div> 
         <div style="font-size:20px;font-weight: bold">
          没有找到数据
        </div>
      </template>
        <template v-slot:top>
          <div style="width: 100%; height: 100%; position: relative">
            <v-text-field
              v-model="search"
              label="输入名称"
              class="mx-4"
              style="width: 30%; display: inline-block"
            ></v-text-field>
            <v-btn
              style="
                top: 20%;
                right: 2%;
                height: 60%;
                width: 10%;
                position: absolute;
              "
              depressed
              color="primary"
              @click="setupDialog = true"
              >创建项目</v-btn
            >
          </div>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            {{ item.projectIntro }}
          </td>
        </template>
        <template v-slot:[`item.managerName`]="{ item }">
          <div style="position: relative">
            <v-avatar size="25" color="indigo">
              <span class="white--text text-h6">{{ item.managerName[0] }}</span>
            </v-avatar>
            <div style="position: absolute; left: 20%; bottom: 3%">
              {{ item.managerName }}
            </div>
          </div>
        </template>
        <template v-slot:[`item.projectName`]="{ item }">
          <a @click="getProj(item)">{{ item.projectName }}</a>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="handleEdit(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="handleDelete(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:[`item.state`]="{ item }">
          <v-chip :color="getColor(item.state)" dark @click="handleState(item)">
            {{ transform(item.state) }}
          </v-chip>
        </template>
      </v-data-table>
      </v-card>  -->
    </v-app>     
</template>
  
  <script>
  // import {
  //   deleteProject,
  //   modifyProject,
  //   newProject,
  //   watchAllProject,
  //   modifyProjectStatus,
  // } from "@/api/user";
  // import Cookies from "js-cookie";
  
  export default {
    // inject: ['user', 'selectedProj'],
    name: "AllProject",
    created() {
      this.get_project();
    },
    inject: {
      user: { defualt: null },
      selectedProj: { defualt: null },
      updateUserProj: { default: null },
    },
    data() {
      return {
        links: ["123", "456"],
        labelPosition: "left",
        headers: [
          {
            text: "名称",
            align: "start",
            sortable: false,
            value: "projectName",
          },
          { text: "文档格式", value: "format" },
          { text: "所有者", value: "owner"},
          { text: "权限", value: "authority" },
          { text: "最近更改时间", value: "changeTime"}
        ],
        fileData: [
          {
            "name": '需求文档1',
            "format": 'markdown',
            "owner": 'szx',
            "authority": "yes",
            "changeTime": '2023-05-06 10.41'
          },
          {
            "name": '需求文档2',
            "format": 'markdown',
            "owner": 'szx',
            "authority": "yes",
            "changeTime": '2023-05-06 10.41'
          },
        ],
        search: "",
        setupDialog: false,
        editDialog: false,
        form: {
          name: "",
          intro: "",
          id: "",
        },
        expanded: [],
      };
    },
    methods: {
        close() {
            console.log("close");
            this.$emit("close");
        },
      // getProj() {
      //   // console.log("getProj");
      //   // console.log(JSON.stringify(project));
      //   // Cookies.set("proj", JSON.stringify(project));
      //   // window.location.href = "/allTask";
      //   // this.proj = Cookies.get(proj);
      // },
      // filterOnlyCapsText(value, search, item) {
      //   console.log(value);
      //   var s = item["projectName"];
      //   return (
      //     s != null &&
      //     search != null &&
      //     typeof s === "string" &&
      //     s.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !==
      //       -1
      //   );
      // },
      // get_project() {
      //   // Cookies.remove("proj");
      //   console.log("get_project");
      //   watchAllProject({ userId: this.user.id }).then((res) => {
      //     this.fileData = res["data"]["data"];
      //     console.log(this.fileData);
      //   });
      // },
      // handleEdit(row) {
      //   this.form.id = row.projectId;
      //   this.form.name = row.projectName;
      //   this.form.intro = row.projectIntro;
      //   this.editDialog = true;
      // },
      // handleClose(done) {
      //   this.$confirm("确认关闭？")
      //     .then(() => {
      //       done();
      //     })
      //     .catch(() => {});
      // },
      // handleDelete(row) {
      //   this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   })
      //     .then(() => {
      //       this.$message({
      //         type: "success",
      //         message: "删除成功!",
      //       });
      //       deleteProject({
      //         projectId: row.projectId,
      //         userId: this.user.id,
      //       }).then(() => {
      //         this.get_project();
      //         this.updateUserProj();
      //       });
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: "info",
      //         message: "已取消删除",
      //       });
      //     });
      // },
      // handleState(item) {
      //   if (item.state == "B") {
      //     this.handleComplete(item);
      //   } else if (item.state == "A") {
      //     this.handleNotComplete(item);
      //   }
      // },
      // handleComplete(row) {
      //   this.$confirm("确定已完成项目?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   })
      //     .then(() => {
      //       this.$message({
      //         type: "success",
      //         message: "项目已完成!",
      //       });
      //       modifyProjectStatus({
      //         projectId: row.projectId,
      //         userId: this.user.id,
      //         status: "A",
      //       }).then((res) => {
      //         console.log(res);
      //         this.get_project();
      //       });
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: "info",
      //         message: "已取消",
      //       });
      //     });
      // },
      // handleNotComplete(row) {
      //   this.$confirm("确定重新进行项目?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   })
      //     .then(() => {
      //       this.$message({
      //         type: "success",
      //         message: "项目已恢复进行!",
      //       });
      //       modifyProjectStatus({
      //         projectId: row.projectId,
      //         userId: this.user.id,
      //         status: "B",
      //       }).then((res) => {
      //         console.log(res);
      //         this.get_project();
      //       });
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: "info",
      //         message: "已取消",
      //       });
      //     });
      // },
      // cancelSetupProject() {
      //   this.setupDialog = false;
      //   this.form = {
      //     name: "",
      //     intro: "",
      //   };
      // },
      // setupProject() {
      //   // console.log(this.search);
      //   // console.log("submit");
      //   if (this.form.name.trim() === "") {
      //     this.$message({
      //       type: "error",
      //       message: "项目名不能为空！",
      //     });
      //     return;
      //   }
      //   for (let i = 0; i < this.fileData.length; i++) {
      //     if (this.form.name === this.fileData[i].projectName) {
      //       this.$message({
      //         type: "error",
      //         message: "已存在同名项目",
      //       });
      //       return;
      //     }
      //   }
      //   this.setupDialog = false;
      //   newProject({
      //     projectName: this.form.name,
      //     projectIntro: this.form.intro,
      //     userId: this.user.id,
      //   }).then((res) => {
      //     console.log(this.user.id);
      //     console.log(res);
      //     this.updateUserProj();
      //     this.get_project();
      //   });
      //   this.form = {
      //     name: "",
      //     intro: "",
      //   };
      // },
      // editProject() {
      //   if (this.form.name.trim() === "") {
      //     this.$message({
      //       type: "error",
      //       message: "项目名不能为空！",
      //     });
      //     return;
      //   }
      //   for (let i = 0; i < this.fileData.length; i++) {
      //     if (
      //       this.form.name === this.fileData[i].projectName &&
      //       this.form.id != this.fileData[i].projectId
      //     ) {
      //       this.$message({
      //         type: "error",
      //         message: "已存在同名项目",
      //       });
      //       return;
      //     }
      //   }
      //   this.editDialog = false;
      //   modifyProject({
      //     projectId: this.form.id,
      //     projectName: this.form.name,
      //     projectIntro: this.form.intro,
      //   }).then(() => {
      //     this.get_project();
      //     this.updateUserProj();
      //   });
      // },
      // transform(state) {
      //   if (state === "A") {
      //     return "已完成";
      //   } else if (state === "B") {
      //     return "进行中";
      //   } else if (state === "C") {
      //     return "未开始";
      //   } else if (state === "D") {
      //     return "不合法";
      //   }
      // },
      getColor(state) {
        if (state === "A") {
          return "blue";
        } else if (state === "B") {
          return "green";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .one {
    height: 10%;
    position: relative;
  }
  .two {
    height: 10%;
  }
  .three {
    position: absolute;
    left: 5%;
    right: 5%;
    height: 80%;
  }
  .xiangmu {
    position: absolute;
    left: 20%;
  }
  </style>
  