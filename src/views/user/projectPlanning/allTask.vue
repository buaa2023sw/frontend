  <template>
    <div style="width: 100%; height: 100%;">
      <div class="one">
          <h1 style="position:absolute;left:5%;top:10%">任务列表</h1>
      </div>
    <div class="three">
      <v-text-field
          v-model="search"
            label="搜索任务"
            style="width:400px"
        ></v-text-field>
        <v-btn
      depressed
      color="primary"
      style="position:absolute;top:1%;right:30%;height:4%;width:10%;"
      @click="setupDialog = true"
      >  <v-icon
      left
    >     mdi-align-vertical-bottom
    </v-icon>
    图表展示</v-btn>
        <v-btn
      depressed
      color="primary"
      style="position:absolute;top:1%;right:17%;height:4%;width:10%;"
      @click="checkMyTask"
      v-if="checkMyFlag == false"
      >查看我的任务</v-btn>
      <v-btn
      depressed
      color="primary"
      style="position:absolute;top:1%;right:17%;height:4%;width:10%;"
      @click="checkAllTask"
      v-else
      >查看全部任务</v-btn>
        <v-btn
      depressed
      color="primary"
      style="position:absolute;top:1%;right:1%;height:4%;width:10%;"
      @click="setupFather = true"
      >创建任务</v-btn>
    <v-container fluid style="position:relative" class="grey lighten-5">
      <v-data-iterator
        style="width:100%;position: absolute;"
        :items="tasks"
        item-key="taskId"
        hide-default-footer
        :single-expand="false"
      >
        <template v-slot:default="{items, isExpanded, expand}">
            <v-row
              v-for="task in items"
              :key="task.taskId"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card style="width:100%;position: relative;">
                <v-card-title>
                  <h4>{{ task.taskName }}</h4>
                <v-switch
                style="position: absolute;right: 1%;"
                :input-value="isExpanded(task)"
                class="pl-4 mt-0"
                @change="(v) => expand(task, v)"></v-switch>
                </v-card-title>
                <!-- <v-switch
                  :input-value="isExpanded(item)"
                  :label="isExpanded(item) ? 'Expanded' : 'Closed'"
                  class="pl-4 mt-0"
                  @change="(v) => expand(item, v)"
                ></v-switch> -->
                <v-divider></v-divider>
                <v-data-table
                v-if="isExpanded(task)"
                :search="search"
                :headers="headers"
                :items="task.subTaskList"
                :items-per-page="5"
                class="elevation-1"
                 item-key='name'
                >
<!--    
  <template v-slot:[`item.remove`] ="{item}">
     <v-btn depressed @click="handleDelete(item)">
      移除用户
    </v-btn>
  </template>
  <template v-slot:[`item.change`] ="{item}">
     <v-btn depressed @click="handleChange(item)">
      更改角色
    </v-btn>
  </template> -->
  <template v-slot:[`item.state`]="{ item }">
      <div>{{ transform(item.state) }}</div>
    </template>
    <template v-slot:[`item.managerId`]="{ item }">
      <div>{{ getName(item.managerId) }}</div>
    </template>
    <template v-slot:[`item.contribute`]="{ item }">
      <div>{{ item.contribute }}%</div>
    </template>
    <template v-slot:[`item.deadline`]="{ item }">
      <div>{{ item.deadline.slice(0, 10) }}</div>
    </template>
  <template v-slot:[`item.alarm`]="{item}">
      <v-icon
        small
        class="mr-2"
        @click="setupAlarm = true"
      >
      mdi-alarm
      </v-icon>
  </template>
  <template v-slot:[`item.action`]="{item, index}">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
        small
        class="mr-2"
        v-bind="attrs"
        v-on= on
      >
      mdi-dots-horizontal
      </v-icon>
      </template>
      <v-list>
        <v-list-item
          v-for="(option) in options"
          :key="option.name"
        >
          <v-btn text @click="switchAction(option, index, item)">{{ option }}</v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>
  <template v-slot:foot="{item}">
            <!-- <v-text-field
              v-model="calories"
              type="number"
              label="Less than"
            ></v-text-field> -->
            <v-icon
        large
        class="mr-2"
        @click="setupNewSon(task)"
        style="position:absolute;left: 1.5%;top:82%"
      >
      mdi-plus-box
      </v-icon>
      <v-icon
                  large
                   style="position: absolute;left: 6%;top:82%"
                   @click="deleteTask(task)"
                   >
                   mdi-delete
                </v-icon>
      </template>
</v-data-table>
              </v-card>
              <div class="divider"></div>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
    </div>

    <el-dialog
        title="创建任务"
        :visible.sync="setupFather"
         width="50%"
        :before-close="handleClose">
        <el-form :label-position=left label-width="80px" :model="newFatherForm" ref="newFatherForm">
    <el-form-item label="任务名称">
      <el-input v-model="newFatherForm.name"></el-input>
    </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setupFather = false">取 消</el-button>
    <el-button type="primary" @click="newFather">确 定</el-button>
  </span>
</el-dialog> 

<el-dialog
        title="创建子任务"
        :visible.sync="setupSon"
         width="50%"
        :before-close="handleClose">
        <el-form :label-position=left label-iwdth="80px" :model="newSonForm" ref="newSonForm">
    <el-form-item label="子任务名称">
      <el-input v-model="newSonForm.name"></el-input>
    </el-form-item>
    <el-form-item>
      <p1>完成时间</p1>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="sad"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="newSonForm.endTime"
            chips
            small-chips
            label="请选择日期"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-combobox>
        </template>
        <v-date-picker
          v-model="newSonForm.endTime"
          no-title
          scrollable 
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </el-form-item>
    <el-form-item label="贡献程度">
      <v-slider
      int="Im a hint"
      max="100"
      min="0"
      step="1"
      thumb-label
      v-model="newSonForm.contribute"
      style="position:relative;bottom:-5px"
    ></v-slider>
    </el-form-item>
    <p1 style="top:5%">负责人</p1>
      <v-select
          v-model = "newSonForm.managerName"
          :items="personNameList"
        ></v-select>
</el-form>
<span slot="footer" class="dialog-footer">
    <el-button @click="setupSon = false">取 消</el-button>
    <el-button type="primary" @click="newSon">确 定</el-button>
  </span>
</el-dialog> 

<el-dialog
        title="设置提醒时间"
        :visible.sync="setupAlarm"
         width="25%"
        :before-close="handleClose">
        <el-form :label-position=left label-width="80px" :model="newFatherForm" ref="newFatherForm" style="poition:relative">
          <v-menu
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
          style="width:100%;"
            v-model="newAlarmForm.date"
            chips
            small-chips
            label="请选择日期"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-combobox>
        </template>
        <v-date-picker
          v-model="newAlarmForm.date"
          no-title
          scrollable 
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu1 = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="menu1 = false"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>

      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
        style="width:100%;"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox    
          style="width:100%;"
            v-model="newAlarmForm.time"
            chips
            small-chips
            label="请选择时间"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-combobox>
        </template>
        <v-time-picker
            v-model="newAlarmForm.time"
            :allowed-hours="allowedHours"
            :allowed-minutes="allowedMinutes"
            class="mt-4"
            format="24hr"
            scrollable
    >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu2 = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="menu2 = false"
          >
            OK
          </v-btn>
        </v-time-picker>
      </v-menu>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setupAlarm = false">取 消</el-button>
    <el-button type="primary" @click="newAlarm">确 定</el-button>
  </span>
</el-dialog> 

<el-dialog
        title="编辑子任务"
        :visible.sync="editTask"
         width="50%"
        :before-close="handleClose">
        <el-form :label-position=left label-iwdth="80px" :model="newSonForm" ref="newSonForm">
    <el-form-item label="子任务名称">
      <el-input v-model="newSonForm.name"></el-input>
    </el-form-item>
    <el-form-item>
      <p1>完成时间</p1>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="sad"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="newSonForm.endTime"
            chips
            small-chips
            label="请选择日期"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-combobox>
        </template>
        <v-date-picker
          v-model="newSonForm.endTime"
          no-title
          scrollable 
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="editSubTask"
          >
            确定
          </v-btn>
        </v-date-picker>
      </v-menu>
    </el-form-item>
    <el-form-item label="贡献程度">
      <v-slider
      int="Im a hint"
      max="100"
      min="0"
      step="1"
      thumb-label
      v-model="newSonForm.contribute"
      style="position:relative;bottom:-5px"
    ></v-slider>
    </el-form-item>
    <p1 style="top:5%">负责人</p1>
      <v-select
          v-model = newSonForm.managerId
          :items="personNameList"
        ></v-select>
</el-form>
<span slot="footer" class="dialog-footer">
    <el-button @click="editTask = false">取 消</el-button>
    <el-button type="primary" @click="newSon">确 定</el-button>
  </span>
</el-dialog> 

<el-dialog
        no-title
        :visible.sync="detailFlag"
         width="50%"
        :before-close="handleClose">
      <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-card-text>
      <div>Word of the Day</div>
      <p class="text-h4 text--primary">
        be•nev•o•lent
      </p>
      <p>adjective</p>
      <div class="text--primary">
        well meaning and kindly.<br>
        "a benevolent smile"
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="deep-purple accent-4"
      >
        Learn More
      </v-btn>
    </v-card-actions>
  </v-card>
</el-dialog> 

    </div>
  </template>

<script>
import {showTaskList, addTask, notice, addSubTask, modifyTaskContent, watchMyTask, completeTask, removeTask, showPersonList} from '@/api/user.js'

export default {
  created() {
    this.getTaskList();
    this.getPersonList();
  },
  data: () => ({
    personNameList: [],
    personIdList: [],
    user: {
      id: 1
    },
    selectedProj: {
      id: 1
    },
    checkMyFlag: false,
    search: '',
    setupFather: false,
    setupSon: false,
    setupAlarm: false,
    detailFlag: false,
    editTask: false,
    menu: false,
    menu1: false,
    menu2: false,
    sonContribute: 0,
    myName: "罗本",
    options: ['删除任务', "编辑任务", "详细信息", "完成任务"],
    picker: 
    (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    newFatherForm: {
      name: ''
    },
    allPerson: [
      '石子瑄',
      'zhaohuiya',
      'ghy'
    ],
    newSonForm: {
      name: '',
      endTime: '',
      contribute: '',
      managerName: '',
      fatherTaskId: ''
    },
    newAlarmForm: {
        taskID: '',
        date: '',
        time: ''
      },
    headers: [
        {
          text: "名称",
          align: 'start',
          sortable: false,
          value: 'taskName',
        },
        { text: '开始时间', value: '' },
        { text: '完成时间', value: 'deadline' },
        { text: "贡献程度", value: "contribute"},
        { text: '状态', value: 'state'},
        { text: '负责人', value: 'managerId'},
        { text: '', value: "alarm", sortable: false},
        { text: '', value: 'action', sortable: false}
      ],
    tasks: [
      // {
      //   name: '任务一',
      //   time: "2022-3-1 to 2022-3-4",
      //   contribute: "30%",
      //   state: "进行中",
      //   sons: [
      //       {
      //           name: '子任务一',
      //           startTime: "2022-3-1",
      //           endTime: "2022-3-4",
      //           contribute: "10%",
      //           state: "进行中",
      //           man: "罗本"
      //       },
      //       {
      //           name: '子任务二',
      //           startTime: "2022-3-1",
      //           endTime: "2022-3-25",
      //           contribute: "10%",
      //           state: "进行中",
      //           man: "里贝里"
      //       },
      //   ]
      // },
      // {
      //   name: '任务二',
      //   time: "2022-4-1 to 2022-4-4",
      //   contribute: "30%",
      //   state: "进行中",
      //   sons: [
      //   {
      //           name: '子任务一',
      //           startTime: "2022-3-1",
      //           endTime: "2022-3-4",
      //           contribute: "10%",
      //           state: "进行中",
      //           man: "罗本"
      //       },
      //       {
      //           name: '子任务二',
      //           startTime: "2022-3-5",
      //           endTime: "2022-3-8",
      //           contribute: "10%",
      //           state: "进行中",
      //           man: "里贝里"
      //       },
      //   ]
      // },
    ]
  }),

  methods: {
    getPersonList() {
      showPersonList({projectId:this.selectedProj.id, userId: this.user.id}).then(
        res => {
          console.log(res['data']['data']);
          for (let i=0;i < res['data']['data'].length;i++) {
            this.personIdList.push(res['data']['data'][i]['peopleId']);
            this.personNameList.push(res['data']['data'][i]['peopleName']);
          };
        }
      )
    },
    getTaskList() {
      showTaskList({userId: this.user.id, projectId: this.selectedProj.id}).then(
         res => {
          this.tasks = res['data']['data'];
          console.log(this.tasks);
        }
      );
    },
    newFather() {
      // newFather()
      this.setupFather = false;
      console.log(this.user.id);
      console.log(this.newFatherForm.name);
      addTask({userId: this.user.id, taskName: this.newFatherForm.name, projectId: this.selectedProj.id}).then(
        res => {
          console.log(res);
        }
      )
      this.getTaskList();
    },
    deleteTask(task) {
      this.$confirm('此操作将移除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        removeTask({taskId: task.taskId, userId: this.user.id}).then(
        res => {
          console.log(res);
        }
      )
      this.getTaskList();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    setupNewSon(item) {
      this.setupSon = true;
      this.newSonForm.fatherTaskId = item.taskId;
    },
    newSon() {
      console.log(this.newSonForm.endTime);
      let managerId = this.personIdList[this.personNameList.indexOf(this.newSonForm.managerName)];
      addSubTask({userId: this.user.id, deadline: this.newSonForm.endTime, contribute: this.newSonForm.contribute, 
        managerId: managerId, fatherTaskId: this.newSonForm.fatherTaskId, projectId: this.selectedProj.id, 
        subTaskName: this.newSonForm.name}).then(
          res => {
            console.log(res);
          }
        );
      console.log(this.newSonForm);
      this.setupSon = false;
      this.newSonForm.contribute = 0;
      this.newSonForm.fatherTaskId = '';
      this.newSonForm.endTime = '';
      this.newSonForm.managerName = '';
      this.newSonForm.name = '';
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(()=> {
          done();
        })
        .catch(() => {});
    },
    checkMyTask() {
      //checkMyTask
      console.log(this.checkMyFlag);
      this.checkMyFlag = true;
      watchMyTask({userId: this.user.id, projectId: this.selectedProj.id}).then(
        res => {
          this.tasks = res['data']['data'];
        }
      );
    },
    checkAllTask() {
      this.getTaskList();
      this.checkMyFlag = false;
    },
    newAlarm() {
      this.setupAlarm = false;
      //
    },
    switchAction(action, index, item) {
        if (action == "删除任务") {
        this.handleDelete(index, item);
        } else if (action == "编辑任务") { 
          this.editTask = true;
        } else if (action == "详细信息") {
          this.detailFlag = true;
        } else if (actino == "完成任务") {
          handleComplete();
        }
    },
    handleComplete() {
      //completeTask
    },
    handleDelete(index, item) {
      this.$confirm('此操作将移除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        console.log(item);
      removeTask({taskId: item.taskId, userId: this.user.id}).then(
        res => {
          console.log(res);
        }
      );
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    editSubTask() {
      
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
  },
  getName(id) {
    console.log(this.personIdList);
    console.log(this.personNameList);
    return this.personNameList[this.personIdList.indexOf(id)];
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
  .divider {
    postion:relative;
    height: 30px;
    width: 30px;
  }
</style>