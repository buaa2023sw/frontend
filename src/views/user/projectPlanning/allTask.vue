  <template>
    <div v-if="this.selectedProj == null" style="width: 100%; height: 100%;"></div>
    <div v-else style="width: 100%; height: 100%;">
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
      @click="gotoPic"
      >  <v-icon 
       left
    >     mdi-align-vertical-bottom
    </v-icon>
    图表展示</v-btn>
        <v-btn
      depressed
      color="primary"
      style="position:absolute;top:1%;right:17%;height:4%;width:11%;"
      @click="checkMyTask"
      v-if="checkMyFlag === false"
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
    <v-container fluid style="position:relative">
      <v-data-iterator
        style="width:100%;position: absolute;"
        :items="tasks"
        item-key="taskId"
        hide-default-footer
        :single-expand="false"
      >
      <template v-slot:no-data>
        <div style="text-align: center;">
          <img src="../../../assets/notask.png" height="400px" width="325px"/>
        </div>
        <div style="font-size:40px;font-weight: bold;text-align: center;">
          您还没有设置任务
        </div>
      </template>
      <template v-slot:no-results>
        <div style="text-align: center;">
          <img src="../../../assets/notask.png" height="400px" width="325px"/>
        </div>
        <div style="font-size:40px;font-weight: bold;text-align: center;">
          未找到对应任务
        </div>
      </template>
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
                <div>
                <v-card-title>
                  <h4>{{ task.taskName }}</h4>
                   <v-icon size="small" @click="changeTaskName(task)">mdi-pencil</v-icon>
                <v-switch
                style="position: absolute;right: 1%;"
                :input-value="isExpanded(task)"
                class="pl-4 mt-0"
                @change="(v) => expand(task, v)"></v-switch>
                </v-card-title>
              </div>
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
                 item-key='subTaskName'
                 :custom-filter="filterOnlyCapsText"
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
  <template v-slot:no-data>
        <div style="font-size:15px;font-weight: bold;text-align: center;">
          没有子任务
        </div>
      </template>
  <template v-slot:no-results>
        <div style="font-size:15px;font-weight: bold;text-align: center;">
          没有找到对应子任务
        </div>
  </template>
  <template v-slot:[`item.status`]="{ item }">
      <div>{{ transform(item.status) }}</div>
    </template>
    <template v-slot:[`item.managerId`]="{ item }">
      <div>{{ getName(item.managerId) }}</div>
    </template>
    <template v-slot:[`item.contribute`]="{ item }">
      <div>{{ item.contribute }}%</div>
    </template>
    <template v-slot:[`item.start_time`]="{ item }">
      <div>{{ item.start_time.slice(0, 10) }}</div>
    </template>
    <template v-slot:[`item.deadline`]="{ item }">
      <div>{{ item.deadline.slice(0, 10) }}</div>
    </template>
    <template v-slot:[`item.complete_time`]="{ item }">
      <div>{{ item.complete_time.slice(0, 10) === "2050-12-31" ? "---" : item.complete_time.slice(0, 10)}}</div>
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <v-chip
        :color="getColor(item.status)"
        dark
      >
        {{ transform(item.status) }}
      </v-chip>
    </template> 
    <template v-slot:[`item.managerId`] ="{ item }">
    <div style="position:relative;">
    <v-avatar size="25"  color="indigo" >
      <span class="white--text text-h6">{{getName(item.managerId)[0]}}</span>
    </v-avatar>
    <div style="position: absolute;left:40%;bottom: 5%;">{{ getName(item.managerId) }}</div>
  </div>
    </template>
  <template v-slot:[`item.alarm`]="{item}">
      <v-icon
        small
        class="mr-2"
        @click="setAlarm(item)"
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
        >
          <v-btn text @click="switchAction('编辑任务', item, task)">编辑任务</v-btn>
        </v-list-item>
        <v-list-item
        >
          <v-btn text @click="switchAction('删除任务', item, task)">删除任务</v-btn>
        </v-list-item>
        <v-list-item
        >
          <v-btn text @click="switchAction('完成任务', item, task)">完成任务</v-btn>
        </v-list-item>
        <!-- <v-list-item
        >
        <v-dialog
      v-model="dialog"
      width="500"
    >
    <template v-slot:activator="{ on, attrs }">
          <v-btn text
          v-bind="attrs" v-on="on" @click="switchAction('详细信息', index, item)">详细信息</v-btn>
        </template>
        <v-card
    :loading="loading"
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    ></v-img>

    <v-card-title>{{item.subTaskName}}</v-card-title>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        <div class="grey--text ms-4">
          时间:{{item.create_time.slice(0, 10)}} - {{ item.deadline.slice(0, 10) }}
        </div>
      </v-row>
<div class="my-4 text-subtitle-1">
        负责人:{{ getName(item.managerId) }}
      </div> 

      <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>Tonight's availability</v-card-title>

    <v-card-text>
      <v-chip-group
        v-model="selection"
        active-class="deep-purple accent-4 white--text"
        column
      >
        <v-chip>5:30PM</v-chip>

        <v-chip>7:30PM</v-chip>

        <v-chip>8:00PM</v-chip>

        <v-chip>9:00PM</v-chip>
      </v-chip-group>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="deep-purple lighten-2"
        text
        @click="reserve"
      >
        Reserve
      </v-btn>
    </v-card-actions>
  </v-card>
      </v-dialog>
        </v-list-item> -->
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
        :before-close="cancelNewFather">
        <el-form :label-position="labelPosition" label-width="80px" :model="newFatherForm" ref="newFatherForm">
    <el-form-item label="任务名称">
      <el-input v-model="newFatherForm.name"></el-input>
    </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelNewFather">取 消</el-button>
    <el-button type="primary" @click="newFather">确 定</el-button>
  </span>
</el-dialog> 

<el-dialog
        title="修改任务名称"
        :visible.sync="changeTaskNameFlag"
         width="50%"
        :before-close="handleClose">
        <el-form :label-position="labelPosition" label-width="80px">
    <el-form-item label="任务名称">
      <el-input v-model="changeNameForm.name"></el-input>
    </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="changeTaskNameFlag = false">取 消</el-button>
    <el-button type="primary" @click="ctn">确 定</el-button>
  </span>
</el-dialog> 

<el-dialog
        title="创建子任务"
        :visible.sync="setupSon"
         width="50%"
        :before-close="cancelNewSon">
        <el-form label-position="lab" label-iwdth="80px" :model="newSonForm" ref="newSonForm">
    <el-form-item label="子任务名称">
      <el-input v-model="newSonForm.name"></el-input>
    </el-form-item>
    <el-form-item>
      <p>开始时间</p>
      <v-menu
        v-model="menu1"
        :close-on-content-click="false"
        return-value.sync="sad"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="newSonForm.startTime"
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
          v-model="newSonForm.startTime"
          no-title
          scrollabel
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
    </el-form-item>
    <el-form-item>
      <p>预计完成时间</p>
      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        return-value.sync="sad"
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
          scrollabel
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
    <p style="top:5%">负责人</p>
      <v-select
          v-model = "newSonForm.managerName"
          :items="personNameList"
        ></v-select>
</el-form>
<span slot="footer" class="dialog-footer">
    <el-button @click="cancelNewSon">取 消</el-button>
    <el-button type="primary" @click="newSon">确 定</el-button>
  </span>
</el-dialog> 

<el-dialog
        title="设置提醒时间"
        :visible.sync="setupAlarm"
         width="25%"
        :before-close="handleClose">
        <el-form label-position="labelPosition" label-width="80px" :model="newFatherForm" ref="newFatherForm" style="position:relative">
          <v-menu
        v-model="menu3"
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
          scrollabel
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu3 = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="menu3 = false"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>

      <v-menu
        v-model="menu4"
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
            scrollabel
    >
          <v-spacer></v-spacer>
          <v-btn
            tftuext
            color="primary"
            @click="menu4 = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="menu4 = false"
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
        <el-form label-position="labelPosition" label-iwdth="80px" :model="newSonForm" ref="newSonForm">
    <el-form-item label="子任务名称">
      <el-input v-model="editSonForm.name"></el-input>
    </el-form-item>
    <el-form-item>
      <p>开始时间</p>
      <v-menu
        v-model="menu3"
        :close-on-content-click="false"
        return-value.sync="sad"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="editSonForm.startTime"
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
          v-model="editSonForm.startTime"
          no-title
          scrollabel
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu3 = false"
          >
            确定
          </v-btn>
        </v-date-picker>
      </v-menu>
    </el-form-item>
    <el-form-item>
      <p>预计完成时间</p>
      <v-menu
        v-model="menu4"
        :close-on-content-click="false"
        return-value.sync="sad"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="editSonForm.endTime"
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
          v-model="editSonForm.endTime"
          no-title
          scrollabel
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu4 = false"
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
      v-model="editSonForm.contribute"
      style="position:relative;bottom:-5px"
    ></v-slider>
    </el-form-item>
    <p style="top:5%">负责人</p>
      <v-select
          v-model ="editSonForm.managerName"
          :items="personNameList"
        ></v-select>
</el-form>
<span slot="footer" class="dialog-footer">
    <el-button @click="editTask = false">取 消</el-button>
    <el-button type="primary" @click="editSubTask">确 定</el-button>
  </span>
</el-dialog> 

    </div>
  </template>

<script>
import {showTaskList, addTask, notice, addSubTask, modifyTaskContent, watchMyTask, completeTask, removeTask, showPersonList} from '@/api/user.js'

export default {
  name: "allTask",
  created() {
    if (this.selectedProj == null){
      this.$message({
          type: 'info',
          message: '请在左侧选择项目以继续！'
        });
    } else {
    this.getTaskList();
    this.getPersonList();
    }
  },
  inject: {'user': {default: null},
            'selectedProj': {default: null}},
  data: () => ({
    personNameList: [],
    personIdList: [],
    checkMyFlag: false,
    changeTaskNameFlag: false,
    search: '',
    setupFather: false,
    setupSon: false,
    setupAlarm: false,
    detailFlag: false,
    editTask: false,
    labelPosition: "left",
    allowed_hours: "allowedHours",
    allowed_minutes: "allowedMinutes",
    menu: false,
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
    sonContribute: 0,
    myName: "罗本",
    tempItem: '',
    showPencil: {},
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
    editSonForm: {
      name: '',
      startTime: '', 
      endTime: '', 
      contribute: '', 
      managerName: '',
      fatherTaskId: ''
    },
    newSonForm: {
      name: '',
      startTime: '',
      endTime: '',
      contribute: '',
      managerName: '',
      fatherTaskId: ''
    },
    newAlarmForm: {
        taskId: '',
        date: '',
        time: ''
      },
      changeNameForm: {
        name: '',
        id: ''
      },
    headers: [
        {
          text: "名称",
          align: 'start',
          sortable: false,
          value: 'subTaskName',
        },
        { text: '开始时间', value: 'start_time' },
        { text: '预计完成时间', value: 'deadline' },
        { text: '实际完成时间', value: 'complete_time' },
        { text: "贡献程度", value: "contribute"},
        { text: '状态', value: 'status'},
        { text: '负责人', value: 'managerId'},
        { text: '', value: "alarm", sortable: false},
        { text: '', value: 'action', sortable: false}
      ],
    tasks: [
      // {
      //   name: '任务一',
      //   time: "2022-3-1 to 2022-3-4",
      //   contribute: "30%",
      //   status: "进行中",
      //   sons: [
      //       {
      //           name: '子任务一',
      //           startTime: "2022-3-1",
      //           endTime: "2022-3-4",
      //           contribute: "10%",
      //           status: "进行中",
      //           man: "罗本"
      //       },
      //       {
      //           name: '子任务二',
      //           startTime: "2022-3-1",
      //           endTime: "2022-3-25",
      //           contribute: "10%",
      //           status: "进行中",
      //           man: "里贝里"
      //       },
      //   ]
      // },
      // {
      //   name: '任务二',
      //   time: "2022-4-1 to 2022-4-4",
      //   contribute: "30%",
      //   status: "进行中",
      //   sons: [
      //   {
      //           name: '子任务一',
      //           startTime: "2022-3-1",
      //           endTime: "2022-3-4",
      //           contribute: "10%",
      //           status: "进行中",
      //           man: "罗本"
      //       },
      //       {
      //           name: '子任务二',
      //           startTime: "2022-3-5",
      //           endTime: "2022-3-8",
      //           contribute: "10%",
      //           status: "进行中",
      //           man: "里贝里"
      //       },
      //   ]
      // },
    ]
  }),
  methods: {
    mouseenter(task) {
      console.log("mouseenter");
      console.log(task.taskId);
      this.showPencil[task.taskId] = true;
      console.log(this.showPencil);
    },
    mouseleave(task) {
      console.log("mouseleave");
      console.log(task.taskId);
      this.showPencil[task.taskId] = false;
      console.log(this.showPencil);
    },
    getPersonList() {
      showPersonList({projectId:this.selectedProj.projectId, userId: this.user.id}).then(
        res => {
          console.log(res);
          console.log(res['data']['data']);
          for (let i=0;i < res['data']['data'].length;i++) {
            this.personIdList.push(res['data']['data'][i]['peopleId']);
            this.personNameList.push(res['data']['data'][i]['peopleName']);
          }
        }
      )
    },
    getTaskList() {
      showTaskList({userId: this.user.id, projectId: this.selectedProj.projectId}).then(
         res => {
          console.log("showTaskList");
          console.log(res);
          this.tasks = res['data']['data'];
          console.log(this.tasks);
        }
      );
    },
    changeTaskName(task) {
      this.changeTaskNameFlag = true;
      this.changeNameForm.name = task.taskName;
      this.changeNameForm.id = task.taskId;
    },
    ctn() {
      if (this.changeNameForm.name.trim() === "") {
        this.$message({
          type: 'error',
          message: '任务名不可为空！'
        });
        return;
      }
      for (let i=0;i<this.tasks.length;i++) {
        if (this.tasks[i].taskName === this.changeNameForm.name && this.tasks[i].taskId != this.changeNameForm.id) {
          this.$message({
          type: 'error',
          message: '已存在同名任务！'
        });
        return;
        }
      }
      modifyTaskContent({userId: this.user.id, taskId: this.changeNameForm.id, 
        start_time: "2023-4-23", deadline:"2023-4-23", contribute: 0, taskName:this.changeNameForm.name, 
      managerId: 1}).then(
        res => {
          console.log(res);
        }
      );
      this.changeTaskNameFlag = false;
      this.getTaskList();
    },
    cancelNewFather() {
      this.setupFather = false;
      this.newFatherForm.name = '';
    },
    newFather() {
      // newFather()
      if (this.newFatherForm.name .trim() === "") {
        this.$message({
          type: 'error',
          message: '任务名不可为空！'
        });
        return;
      }
      for (let i=0;i<this.tasks.length;i++) {
        if (this.tasks[i].taskName === this.newFatherForm.name) {
          this.$message({
          type: 'error',
          message: '已存在同名任务！'
        });
        return;
        }
      }
      this.setupFather = false;
      addTask({userId: this.user.id, taskName: this.newFatherForm.name, projectId: this.selectedProj.projectId}).then(
        res => {
          console.log(res);
          this.newFatherForm.name = '';
          this.getTaskList();
        }
      )
    },
    gotoPic() {
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
          this.getTaskList();
        }
      )
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
    cancelNewSon() {
      this.setupSon = false;
      this.newSonForm.contribute = 0;
      this.newSonForm.fatherTaskId = '';
      this.newSonForm.startTime = '';
      this.newSonForm.endTime = '';
      this.newSonForm.managerName = '';
      this.newSonForm.name = '';
    },
    filterOnlyCapsText(value, search, item) {
      console.log(value);
      var s = item["subTaskName"];
      return (
        s != null &&
        search != null &&
        typeof s === "string" &&
        s.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !==
          -1
      );
    },
    newSon() {
      if (this.newSonForm.name.trim() === "") {
        this.$message({
                type: "error",
                message: '任务名不能为空'
              })
              return;
      }
      if (this.newSonForm.startTime.trim() === "") {
        this.$message({
                type: "error",
                message: '开始时间不能为空'
              })
              return;
      }
      if (this.newSonForm.endTime.trim() === "") {
        this.$message({
                type: "error",
                message: '预计完成时间不能为空'
              })
              return;
      }
      if (this.newSonForm.contribute == 0) {
        this.$message({
                type: "error",
                message: '贡献程度不能为0！'
              })
              return;
      }
      if (this.newSonForm.managerName === "") {
        this.$message({
                type: "error",
                message: '请指定一个负责人！'
              })
              return;
      }
      for (let i=0;i<this.tasks.length;i++) {
        if (this.tasks[i].taskId == this.newSonForm.fatherTaskId) {
          for (let j=0;j < this.tasks[i].subTaskList.length;j++) {
            if (this.tasks[i].subTaskList[j].subTaskName === this.newSonForm.name) {
              this.$message({
                type: "error",
                message: '已存在同名子任务'
              })
              return;
            }
          }
        }
        break;
      }
      if (this.newSonForm.startTime >= this.newSonForm.endTime) {
        this.$message(
          {
            type: 'error',
            message: '开始时间不能超过结束时间！'
          }
        )
        return;
      }
      let managerId = this.personIdList[this.personNameList.indexOf(this.newSonForm.managerName)];
      addSubTask({userId: this.user.id, start_time: this.newSonForm.startTime, deadline: this.newSonForm.endTime, contribute: this.newSonForm.contribute, 
        managerId: managerId, fatherTaskId: this.newSonForm.fatherTaskId, projectId: this.selectedProj.projectId, 
        subTaskName: this.newSonForm.name}).then(
          res => {
            console.log(res);
            this.getTaskList();
          }
        );
      this.setupSon = false;
      this.newSonForm.contribute = 0;
      this.newSonForm.fatherTaskId = '';
      this.newSonForm.startTime = '';
      this.newSonForm.endTime = '';
      this.newSonForm.managerName = '';
      this.newSonForm.name = '';
    },
    handleSetupTaskClose() {
      this.newFatherForm.name = "";
      this.handleClose();
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
      watchMyTask({userId: this.user.id, projectId: this.selectedProj.projectId}).then(
        res => {
          console.log(res);
          this.tasks = res['data']['data'];
          console.log(this.tasks);
        }
      );
    },
    setAlarm(item) {
      this.setupAlarm = true;
      this.newAlarmForm.taskId = item.subTaskId;
      this.newAlarmForm.time = '';
      this.newAlarmForm.date = '';
    },
    checkAllTask() {
      this.getTaskList();
      this.checkMyFlag = false;
    },
    newAlarm() {
      this.setupAlarm = false;
      notice({taskId: this.newAlarmForm.taskId, deadline: this.newAlarmForm.date + '-' + this.newAlarmForm.time.replace(':', '-')}).then(
        res => {
          console.log(res);
          this.$message({
          type: 'success',
          message: '设置成功!'
        });
        }
      )
      // console.log(this.newAlarmForm.date);
      // console.log(this.newAlarmForm.time);
      // console.log(this.newAlarmForm.date + '-' + this.newAlarmForm.time.replace(':', '-'));
      //
    },
    switchAction(action, item, task) {
        if (action === "删除任务") {
        this.handleDelete(item);
        } else if (action === "编辑任务") {
          this.handleEdit(item, task);
        } else if (action === "完成任务") {
          this.handleComplete(item);
        }
    },
    handleEdit(item, task) {
      this.editSonForm.name = item.subTaskName;
      this.editSonForm.startTime = item.start_time.slice(0, 10);
      this.editSonForm.endTime = item.deadline.slice(0, 10);
      this.editSonForm.contribute = item.contribute;
      this.editSonForm.managerName = this.personNameList[this.personIdList.indexOf(item.managerId)];
      this.editSonForm.fatherTaskId = task.taskId;
      this.editSonForm.subTaskId = item.subTaskId;
      this.editTask = true;
    },
    handleComplete(item) {
      completeTask({taskId: item.subTaskId, userId: this.user.id}).then(
        res => {
          this.$message({
          type: 'success',
          message: '提交成功!'
        });
          this.getTaskList();
          console.log(res);
        }
      );
    },
    handleDelete(item) {
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
         removeTask({taskId: item.subTaskId, userId: this.user.id}).then(
        res => {
          console.log(res);
          this.getTaskList();
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
      if (this.editSonForm.name.trim() === "") {
        this.$message(
          {
            type: 'error',
            message: '任务名不能为空！'
          }
        )
        return;
      }
      for (let i=0;i<this.tasks.length;i++) {
        if (this.tasks[i].taskId == this.editSonForm.fatherTaskId) {
          for (let j=0;j < this.tasks[i].subTaskList.length;j++) {
            if (this.tasks[i].subTaskList[j].subTaskName === this.editSonForm.name && 
            this.tasks[i].subTaskList[j].subTaskId !== this.editSonForm.subTaskId) {
              this.$message({
                type: "error",
                message: '已存在同名子任务'
              })
              return;
            }
          }
        }
        break;
      }
      if (this.editSonForm.contribute == 0) {
        this.$message(
          {
            type: 'error',
            message: '贡献程度不能为0！'
          }
        )
        return;
      }
      if (this.editSonForm.startTime >= this.editSonForm.endTime) {
        this.$message(
          {
            type: 'error',
            message: '开始时间不能超过结束时间！'
          }
        )
        return;
      }
      modifyTaskContent({userId: this.user.id, taskId: this.editSonForm.subTaskId, start_time:this.editSonForm.startTime, deadline:this.editSonForm.endTime, contribute:this.editSonForm.contribute, 
      taskName: this.editSonForm.name, managerId: this.personIdList[this.personNameList.indexOf(this.editSonForm.managerName)]}).then(
        res => {
          console.log(res);
          this.getTaskList();
        }
      )
      this.editTask = false;
    },
    transform(status) {
  //     COMPLETED = 'A'
  // INPROGRESS = 'B'
  // NOTSTART = 'C' 延期已完成D 延期未完成E
      if (status === 'A') {
        return '已完成';
      } else if (status === 'B') {
        return '进行中';
      } else if (status === 'C') {
        return '未开始';
      } else if (status === 'D') {
        return '延期已完成';
      }  else if (status === 'E') {
        return '延期未完成';
      } 
  },
  getColor(status) {
    if (status === 'A') {
        return 'green';
      } else if (status === 'B') {
        return 'orange';
      } else if (status === 'C') {
        return 'blue';
      } else if (status === 'D') {
        return 'red';
      } else if (status === 'E') {
        return 'yellow';
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
    position:relative;
    height: 30px;
    width: 30px;
  }
</style>