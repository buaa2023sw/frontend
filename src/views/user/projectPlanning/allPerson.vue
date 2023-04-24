
<template>
   <div v-if="this.selectedProj == null" style="width: 100%; height: 100%;"></div>
  <div v-else style="width: 100%; height: 100%;">
      <div class="one">
          <h1 style="position:absolute;left:5%;top:10%">项目人员列表</h1>
      </div>
      <div class="three">
<v-data-table
  :headers="headers"
  hide-default-header
  :items="personData"
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
    <v-avatar size="60" style="inline-block;position: absolute;top:10%" color="indigo" >
      <span class="white--text text-h5">{{ item.peopleName}}</span>
    </v-avatar>
    <v-p style="position:absolute;top: 5%;left: 10%;font-size: large;font-weight: 500;">{{ item.peopleName }}</v-p>
    <v-chip
        :color="getColor(item.peopleJob)"
        dark
        style="position:absolute;top: 50%;left: 9%"
      >
        {{ classify(item.peopleJob) }}
      </v-chip>
    </div>
  </template>
  <template v-slot:[`item.remove`] ="{item}">
     <v-btn v-if="item.peopleJob != 'C'" depressed @click="handleDelete(item)">
      移除用户
    </v-btn>
  </template>
  <template v-slot:[`item.change`] ="{item}">
     <v-btn v-if="item.peopleJob != 'C'" depressed @click="handleChange(item)">
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
      <el-form :label-position=left label-width="80px">
<el-form-item label="用户id">
  <el-input v-model="newPersonForm.id" style="width: 400px;"></el-input>
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
      <v-radio-group v-model="changeRoleForm.role" style="top:50px;position: absolute;">
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
import { showPersonList, removeMember, modifyRole, addMember } from '@/api/user'
import project_messagesVue from '@/views/manager/project_messages.vue'
export default {
  name: 'AllProject',
  // inject: {user: {default: null},
  //          selectedProj: {default: null}},
  created () {
    if (this.selectedProj == null){
      this.$message({
          type: 'info',
          message: '请在左侧选择项目以继续！'
        });
    } else {
    this.getPersonList();
    }
  },   
  inject: {'user': {defualt: null},
               'selectedProj': {defualt: null}},
  data() {
    return {
      headers: [
        {
          text: "图标",
          align: 'start',
          sortable: false,
          value: 'icon',
        },
        { text: '移除', value: "remove"},
        { text: '更改', value: 'change'},
      ],
      radioGroup: "管理员",
    personData: [],
    //     "icon": '',
    //     'name': '梅西',
    //     "role": '管理员'
    //   },
    //   {
    //     "icon": '',
    //     'name': 'C罗',
    //     "role": '开发人员'
    //   },
    // {
    //   "icon": '', 
    //   "name": '罗本',
    //   'role': '负责人'
    // }],
      search: '',
      setupDialog: false,
      changeDialog: false,
      newPersonForm: {
        id: '',
      },
      idTemp: '',
      changeRoleForm: {
        id: '',
        role: '',
      }
    }
  },
  methods: {
    getPersonList() {
      showPersonList({projectId: this.selectedProj.id, userId: this.user.id}).then(
        res => {
          console.log(res);
          this.personData = res['data']['data'];
        }
      );
    },
    filterName(value, search, item) {
      console.log('123');
      console.log(item);
      return search != null  &&
        item['peopleName'].toString().indexOf(search) !== -1
    },
    handleChange(row) {
      console.log('123');
      this.changeRoleForm.id = row.peopleId;
      this.changeDialog = true;
      console.log(this.changeRoleForm);
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
        removeMember({projectId: this.selectedProj.id, personId: row.peopleId, userId: this.user.id}).then(
          res => {
            console.log(res);
          }
        );
        this.getPersonList();
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
      addMember({projectId: this.selectedProj.id, personId: this.newPersonForm.id, userId: this.user.id}).then(
        res => {
          console.log(res);
          var errorCode = res['data']['errcode'];
          console.log(errorCode);
          if (errorCode === 3) {
            this.$message({
              type: 'info',
              message: '您没有权限邀请成员'});
          } else if (errorCode === 1) {
            this.$message({
              type: 'info',
              message: '用户不存在'});
          } else if (errorCode === 0) {
            this.$message({
              type: 'success',
              message: '邀请成功'});
            this.setupDialog = false;
            this.getPersonList();
            this.newPersonForm.id = '';
          }
        }
      );
    },
    changeRole() {
      if (this.changeRoleForm.role == '开发人员') {
        this.changeRoleForm.role = 'A';
      } else if (this.changeRoleForm.role == '管理员') {
        this.changeRoleForm.role = 'B';
      } 
      console.log(this.changeRoleForm);
      modifyRole({projectId: this.selectedProj.id, userId: this.user.id, role: this.changeRoleForm.role, personId: this.changeRoleForm.id}).then(
        res => {
          console.log(res);
          var errorCode = res['data']['errcode'];
          if (errorCode == 3) {
            this.$message({
              type: 'info',
              message: '您没有权限更改角色'});
          }
          this.getPersonList();
          this.changeDialog = false;
          this.changeRoleForm.id = '';
          this.changeRoleForm.role = '';
        }
      );
    },
    getColor(role) {
      if (role == 'A') {
        return 'orange';
      } else if (role == 'B') {
        return 'green';
      } else {
        return 'blue';
      }
    },
    classify(role) {
      if (role == 'A') {
        return '开发人员'
      } else if (role == 'B') {
        return '管理员'
      } else if (role == 'C') {
        return '负责人'
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
