
<template>
  <div style="width: 100%; height: 100%;position: relative;">
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
      item-key="name"
      :items-per-page="4"
      hide-default-footer
    >
      <template v-slot:default="{items, isExpanded, expand}">
          <v-row
            v-for="item in items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card style="width:100%;position: relative;">
              <v-card-title>
                <h4>{{ item.name }}</h4>
              <v-switch
              style="position: absolute;right: 1%;"
              :input-value="isExpanded(item)"
              class="pl-4 mt-0"
              @change="(v) => expand(item, v)"></v-switch>
              </v-card-title>
              <!-- <v-switch
                :input-value="isExpanded(item)"
                :label="isExpanded(item) ? 'Expanded' : 'Closed'"
                class="pl-4 mt-0"
                @change="(v) => expand(item, v)"
              ></v-switch> -->
              <v-divider></v-divider>
              <v-data-table
              v-if="isExpanded(item)"
              :search="search"
              :headers="headers"
              :items="item.sons"
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
<template v-slot:[`item.alarm`]="{item}">
    <v-icon
      small
      class="mr-2"
      @click="openAlarm(item)"
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
      <v-list-item>
        <v-btn text @click="switchAction('编辑任务', index, item)">编辑任务</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text @click="switchAction('删除任务', index, item)">删除任务</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text @click="switchAction('完成任务', index, item)">完成任务</v-btn>
      </v-list-item>
      <v-list-item>
        <v-dialog
          v-model="dialog"
          width="500"
         >
       <template v-slot:activator="{on}">
        <v-btn text v-on="on" @click="switchAction('详细信息', index, item)">详细信息</v-btn>
      </template>
      <v-card>
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

  <v-card-title>{{ temp.name }}</v-card-title>

  <v-card-text>
    <v-row
      align="center"
      class="mx-0"
    >
     <div>{{ temp.state }}</div>

      <div class="grey--text ms-4">
        贡献程度：{{ temp.contribute }}%
      </div>
    </v-row>

    <div class="my-4 text-subtitle-1">
      负责人:{{ temp.man }}
    </div>

    <div>{{ temp.intro }}</div>
  </v-card-text>

  <v-divider class="mx-4"></v-divider>

  <!-- <v-card-title>Tonight's availability</v-card-title> -->
<!-- 
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
  </v-card-text> -->

  <v-card-actions>
    <v-btn
      color="deep-purple lighten-2"
      text
      @click="dialog = false"
    >
      关闭
    </v-btn>
  </v-card-actions>
</v-card>
  </v-dialog>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<template v-slot:foot>
          <!-- <v-text-field
            v-model="calories"
            type="number"
            label="Less than"
          ></v-text-field> -->
          <v-icon
      large
      class="mr-2"
      @click="setupSon = true"
      style="position:absolute;left: 1.5%;top:82%"
    >
    mdi-plus-box
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
          v-model="newSonForm.time"
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
        v-model="newSonForm.time"
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
        v-model = newSonForm.man
        :items="allPerson"
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
          @click="setAlarm()"
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
          v-model="newSonForm.time"
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
        v-model="newSonForm.time"
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
        v-model = newSonForm.man
        :items="allPerson"
      ></v-select>
</el-form>
<span slot="footer" class="dialog-footer">
  <el-button @click="editTask = false">取 消</el-button>
  <el-button type="primary" @click="editSon">确 定</el-button>
</span>
</el-dialog> 

  </div>
</template>

<script>
// import { addTask,showTaskList, notice, addSubTask, modifyTaskContent, watchMyTask, completeTask } from '@/api/user';

export default {
inject: ['user', 'selectedProj'],
created: () => {
  getAll();
},
data: () => ({
  dialog: false,
  temp: {},
  checkMyFlag: false,
  search: '',
  setupFather: false,
  setupSon: false,
  setupAlarm: false,
  detailFlag: false,
  editTask: false,
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
    '罗本',
    '里贝里',
    '石子瑄',
    'zhaohuiya',
    'ghy'
  ],
  newSonForm: {
    name: '',
    time: '',
    contribute: '',
    state: '',
    man: ''
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
        value: 'name',
      },
      { text: '截止时间', value: 'time' },
      { text: "贡献程度(%)", value: "contribute"},
      { text: '状态', value: 'state'},
      { text: '负责人', value: 'man'},
      { text: '', value: "alarm", sortable: false},
      { text: '', value: 'action', sortable: false}
    ],
  tasks: [
    {
      name: '任务一',
      sons: [
          {
              name: '子任务一',
              time: "2022-3-4",
              contribute: "10",
              state: "进行中",
              man: "罗本",
              intro: " 2014年,罗本荣膺荷兰年度最佳运动员。 罗本代表荷兰出战三届世界杯三届欧洲杯,连续三届世界杯取得进球,连续六届大赛取得助攻,是荷兰大赛总助攻王、荷兰世界杯历史第二射手。"
          },
          {
              name: '子任务二',
              time: " 2022-3-4",
              contribute: "10",
              state: "进行中",
              man: "里贝里",
              intro: "内切"
          },
      ]
    },
    {
      name: '任务二',
      sons: [
      {
              name: '子任务一',
              time: "2022-3-4",
              contribute: "10",
              state: "进行中",
              man: "罗本",
              intro: "内切"
          },
          {
              name: '子任务二',
              time: "2022-3-4",
              contribute: "10",
              state: "进行中",
              man: "里贝里",
              intro: "内切"
          },
      ]
    },
  ]
}),

methods: {
  getAll() {
    // showTaskList({userId: this.user.id, projectId: this.selectedProj.id}).then(
    //   res => {

    //   }
    // ) 
  },
  newFather() {
    // newFather()
    this.setupFather = false;
    // addTask({userId: this.user.id, taskName: this.newFatherForm.name, projectId: this.selectedProj.id});
    this.newFatherForm.name = '';
  },
  editSon() {
    this.editTask = false;
    this.newSonForm.contribute = 0;
    this.newSonForm.name = '';
    this.newSonForm.man = '';
    this.newSonForm.time = '';
    // modifyTaskContent(userId: this.user.id, taskId: )
  },
  newSon() {
    // newSon()
    this.setupSon = false;
    // addSubTask(userId: this.user.id, deadline: '', contribute:this.newSonForm.contribute, 
    // managerId: this.newSonForm. )
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
    //watchMyTask
  },
  checkAllTask() {
    this.checkMyFlag = false;
  },
  newAlarm() {
    // notice({taskId: this.temp.id, deadline: });
    console.log(this.newAlarmForm.date);
    console.log(this.newAlarmForm.time);
    this.setupAlarm = false;
    //
  },
  switchAction(action, index, item) {
      this.temp = item
      if (action == "删除任务") {
      this.handleDelete(index);
      } else if (action == "编辑任务") { 
        this.newSonForm.contribute = item['contribute'];
        this.newSonForm.name = item['name'];
        this.newSonForm.time = item['time'];
        this.newSonForm.man = item['man'];
        this.editTask = true;
      } else if (action == "详细信息") {
        // this.detailFlag = true;
      } else {
         this.handleComplete(index);
      }
  },
  handleDelete(index) {
    this.$confirm('此操作将移除该任务, 是否继续?', '提示', {
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
  handleComplete(index) {
    this.$confirm('确定已经完成任务?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$message({
        type: 'success',
        message: '已完成!'
    }).catch(() => {        });
     // deletePerson(row.name);

      this.$message({
        type: 'info',
        message: '已取消'
      });          
    });
  },
  openAlarm(item) {
    this.temp = item;
    this.setupAlarm = true;
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
