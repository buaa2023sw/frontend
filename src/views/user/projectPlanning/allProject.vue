
<template>
  <div style="width: 100%; height: 100%;">
      <div class="one">
          <h1 style="position:absolute;left:5%;top:10%">项目</h1>
      </div>
      <div class="three">
<v-data-table
  :headers="headers"
  :items="projectData"
  :single-expand="true"
  :items-per-page="5"
  show-expand
  :expanded.sync="expanded"
  class="elevation-1"
  item-key="projectId"
  :search = search
  :custom-filter="filterOnlyCapsText"
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
    >创建项目</v-btn>
  </div>
</template>
    <template v-slot:expanded-item="{ headers, item }">
    <td :colspan="headers.length">
      {{ item.projectIntro }}
    </td>
  </template>
    <template v-slot:[`item.actions`] ="{ item }">
    <v-icon
      small
      class="mr-2"
      @click="handleEdit(item)"
    >
      mdi-pencil
    </v-icon>
    <v-icon
      small
      @click="handleDelete(item)"
    >
      mdi-delete
    </v-icon>
  </template>
  <template v-slot:[`item.state`] ="{ item }">
    {{ transform(item.state )}}
  </template>
</v-data-table>
      </div>

    <el-dialog
      title="创建项目"
      :visible.sync="setupDialog"
       width="50%"
      :before-close="handleClose">
      <el-form :label-position=left label-width="80px" :model="form" ref="form">
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



<el-dialog
      title="编辑项目"
      :visible.sync="editDialog"
       width="50%"
      :before-close="handleClose">
      <el-form :label-position=left label-width="80px" :model="form" ref="form">
<el-form-item label="项目名称">
  <el-input v-model="form.name"></el-input>
</el-form-item>
<el-form-item label="活动概述">
  <el-input type="textarea" v-model="form.intro"  :autosize="{ minRows: 5, maxRows: 10}"></el-input>
</el-form-item>
</el-form>
<span slot="footer" class="dialog-footer">
  <el-button @click="editDialog = false">取 消</el-button>
  <el-button type="primary" @click="editProject">确 定</el-button>
</span>
</el-dialog>    
</div>
</template>

<!-- <script>
import { getGameList } from '../../api'
export default {
created () {
 this.get_game()
},
methods: {
 jump: function (index) {
   this.$router.push({path: '/main/boxscore', query: {id: index['id']}})
 },
 get_game () {
   getGameList().then(res => {
     res['game_details'].forEach(element => {
       // console.log(element)
       let temp = []
       temp['time'] = element['time'].slice(0, 10) + '-' + element['time'].slice(11, 16)
       temp['score'] = element['host_score'] + ' : ' + element['guest_score']
       temp['host'] = element['host_name_cn']
       temp['guest'] = element['guest_name_cn']
       temp['location'] = element['host_gym']
       temp['id'] = element['id']
       this.gamedata.push(temp)

       this.factGameData = this.gamedata
       if (!this.teamNames.includes(temp['host'])) {
         this.teamNames.push(temp['host'])
         this.options.push({value: temp['host'], label: temp['host']})
       }
       if (!this.teamNames.includes(temp['guset'])) {
         this.teamNames.push(temp['guest'])
         this.options.push({value: temp['guest'], label: temp['guest']})
       }
       if (!this.hostTeamNames.includes(temp['host'])) {
         this.hostTeamNames.push(temp['host'])
         this.hostTeams.push({text: temp['host'], value: temp['host']})
       }
       if (!this.guestTeamNames.includes(temp['guest'])) {
         this.guestTeamNames.push(temp['guest'])
         this.guestTeams.push({text: temp['guest'], value: temp['guest']})
       }
       if (!this.dates.includes(temp['time'])) {
         this.dates.push({text: temp['time'], value: temp['time']})
       }
     })
   })
   this.options.push({value: 'null', label: '默认'})
   console.log(this.options)
 },
 filterHandler (value, row, column) {
   this.clearFilter()
   const property = column['property']
   return row[property] === value
 },
 clearFilter () {
   this.$refs.filterTable.clearFilter()
 },
 demo (value) {
   if (value === 'null') {
     this.factGameData = this.gamedata
   } else {
     this.factGameData = []
     for (var i = 0; i < this.gamedata.length; i++) {
       if (this.gamedata[i]['host'] === value || this.gamedata[i]['guest'] === value) {
         this.factGameData.push(this.gamedata[i])
       }
     }
   }
 }
}, -->


<script>
import { watchAllProject,  newProject, modifyProject, deleteProject} from '@/api/user'


export default {
  // inject: ['user', 'selectedProj'],
  name: 'AllProject',
  created () {
    this.get_project()
  },
  data() {
    return {
      inject: {'user': {defualt: null},
               'selectedProj': {defualt: null}},
      headers: [
        {
          text: '名称',
          align: 'start',
          sortable: false,
          value: 'projectName',
        },
        { text: '状态', value: 'state' },
        { text: '创建时间', value: 'deadline', sortable: true},
        { text: '负责人', value: 'managerName' },
        { text: '', value: 'actions', sortable: false},
        { text: '', value: 'data-table-expand' },
      ],
    projectData: [
      // {
      //   "name": 'ppppp1',
      //   "state": '进行中',
      //   "time": "2002-12-18",
      //   "owner": 'szx',
      //   "intro": 'very good'
      // },
      // {
      //   "name": 'ppppp2',
      //   "state": '进行中',
      //   "time": "2002-12-17",
      //   "owner": 'szx',
      //   'intro': 'very bad'
      // }
    ],
      search: '',
      setupDialog: false,
      editDialog: false,
      form: {
        name: '',
        intro: '',
        id: ''
      },
      expanded: []
    }
  },
  methods: {
    filterOnlyCapsText (value, search, item) {
      console.log(value);
      var s = item['projectName'];
        return s != null &&
      search != null &&
      typeof s=== 'string' &&
      s.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1
    },
    get_project() {
      console.log("get_project");
      watchAllProject({userId: this.user.id}).then(
        res => {
          var arr = res['data']['data'];
          this.projectData = arr;
          console.log(this.projectData);
          }
      )
    },
    handleEdit(row) {
      this.form.id = row.projectId;
      this.form.name = row.projectName;
      this.form.intro = row.projectIntro;
      this.editDialog = true;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(()=> {
          done();
        })
        .catch(() => {});
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        deleteProject({projectId: row.projectId, userId: this.user.id});
        this.get_project();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    setupProject() {
      // console.log(this.search);
      // console.log("submit");
      this.setupDialog = false;
      newProject({projectName: this.form.name, projectIntro: this.form.intro, userId: this.user.id}).then(
        res => {
          console.log(res);
        }
      );
      this.form =  {
        name: '',
        intro: ''
      }
    },
    editProject() {
      this.editDialog = false;
      modifyProject({projectId: this.form.id, projectName: this.form.name, projectIntro: this.form.intro});
      this.get_project();
      // editProject(this.form);
    }, 
    transform(state) {
      if (state == 'A') {
        return '已完成';
      } else if (state == 'B') {
        return '进行中';
      } else if (state == 'C') {
        return '未开始';
      } else if (state == 'D') {
        return '不合法';
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
