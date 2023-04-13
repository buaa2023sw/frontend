<template>
  <div style="width: 100%; height: 100%;">
      <div class="one">
          <h1 style="position:absolute;left:5%;top:10%">项目人员列表</h1>
      </div>
      <div class="three">
<v-data-table
  :headers="headers"
  hide-default-header
  :items="projectData"
  :items-per-page="5"
  class="elevation-1"
  item-key='name'
  :search = search
  :custom-filter="filterName"
  height=""
>
<template v-slot:top>
  <div style="width: 100%; height: 100%;position: relative;">
      <v-text-field
        v-model="search"
        label="输入名称"
        class="mx-4"
        style="width:30%;display: inline-block"
      ></v-text-field>
      <v-btn
      style="top:20%;right:2%;height:60%;width:10%;position: absolute"
    depressed
    color="primary"
    @click="setupDialog = true"
    >添加成员
    <v-icon
          dark
          right
        >
          mdi-account-plus
        </v-icon></v-btn>
  </div>
</template>
    <template v-slot:[`item.icon`] ="{item}">
      <div style="height: 70px;position: relative;width:900px;">
    <v-avatar size="60" style="inline-block;position: absolute;top:10%" >
      <img
        src="https://cdn.vuetifyjs.com/images/john.jpg"
        alt="John"
      >
    </v-avatar>
    <v-p style="position:absolute;top: 5%;left: 10%;font-size: large;font-weight: 500;">{{ item.name }}</v-p>
    <v-chip
        :color="getColor(item.role)"
        dark
        style="position:absolute;top: 50%;left: 9%"
      >
        {{ item.role }}
      </v-chip>
    </div>
  </template>
  <template v-slot:[`item.remove`] ="{item}">
     <v-btn depressed @click="handleDelete(item)">
      移除用户
    </v-btn>
  </template>
  <template v-slot:[`item.change`] ="{item}">
     <v-btn depressed @click="handleChange(item)">
      更改角色
    </v-btn>
  </template>
</v-data-table>
      </div>

    <el-dialog
      title="添加成员"
      :visible.sync="setupDialog"
       width="50%"
      :before-close="handleClose"
      style="position:relative">
      <el-form :label-position=left label-width="80px" :model="form" ref="form">
<el-form-item label="用户id">
  <el-input v-model="this.form.id" style="width: 400px;"></el-input>
</el-form-item>
</el-form>
<span slot="footer" class="dialog-footer">
  <el-button @click="setupDialog = false">取 消</el-button>
  <el-button type="primary" @click="setupPerson">确 定</el-button>
</span>
</el-dialog> 

<el-dialog
      :visible.sync="changeDialog"
       width="40%"
       height="30"
      :before-close="handleClose"
      style="position:relative">
      <template v-slot:title>
        <div>请选择你要为该成员分配的<strong>角色</strong></div>
      </template>
      <v-radio-group v-model="this.form.role" style="top:50px;position: absolute;">
      <v-radio value="管理员">
        <template v-slot:label>
          <div> <strong class="success--text">管理员</strong></div>
        </template>
      </v-radio>
      <v-radio value="开发人员">
        <template v-slot:label>
          <div><strong class="orange--text">开发人员</strong></div>
        </template>
      </v-radio>
    </v-radio-group>
    <span slot="footer" class="dialog-footer">
    <el-button @click="changeDialog = false">取 消</el-button>
    <el-button type="primary" @click="changeRole">确 定</el-button>
  </span>
</el-dialog>    
</div>
</template>

<script>
// import newProject from '@/api/user.js'
// import getProject from '@/api/user.js'
// import deleteProject from '@/api/user.js'

export default {
  name: 'AllProject',
  created () {
    this.get_project()
  },
  data() {
    return {
      headers: [
        {
          text: "图标",
          align: 'start',
          sortable: false,
          value: 'icon',
        },
        { text: '介绍', value: 'people' },
        { text: '移除', value: "remove"},
        { text: '更改', value: 'change'},
      ],
    projectData: [{
        "icon": '',
        'name': '梅西',
        "role": '管理员'
      },
      {
        "icon": '',
        'name': 'C罗',
        "role": '开发人员'
      }],
      search: '',
      setupDialog: false,
      changeDialog: false,
      form: {
        id: '',
        role: ''
      }
    }
  },
  methods: {
    filterName(value, search, item) {
      console.log('123');
      return  item == item && value != null &&
        search != null &&
        typeof value === 'string' &&
        item.name.toString().indexOf(search) !== -1
    },
    get_project() {
      // getProject().then(res => {
      //   // this.projectData = res;
      // })
    },
    handleChange(row) {
      this.form.id = row.id;
      this.changeDialog = true;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(()=> {
          done();
        })
        .catch(() => {});
    },
    handleDelete(row) {
      this.$confirm('此操作将移除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
       // deletePerson(row.name);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    setupPerson() {
      //setupPerson(this.form.id);
      this.setupDialog = false;
    },
    changeRole() {
      //changeRole(this.form);
      this.changeDialog = false;
    },
    getColor(role) {
      if (role == '开发人员') {
        return 'orange';
      } else {
        return 'green';
      }
    }
  }
}
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
      left:5%;
      right: 5%;
      height: 80%;    
  }
  .xiangmu {
      position: absolute;
      left:20%;
  }
</style>