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
          :items="projectMessages"
          :search="search"
      >
        <template #item.changeStatus="{item}">
          <v-btn class="ml-1" small outlined @click="openChangeProjectStatusDialog(item)">修改项目状态</v-btn>
        </template>
        <template #item.projectDetail="{item}">
          <v-btn class="ml-1" small outlined @click="gotoProjectDetailPage(item)">项目详细信息</v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="showChangeProjectStatus" width="300">
      <template>
        <v-container class="pa-0">
          <v-card>
            <v-card-title class="headline font-weight text-left"> 修改项目状态 </v-card-title>
            <v-card-text> 项目名:{{ dialogMessage.name }} / 创建人:{{ dialogMessage.leader }}</v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-radio-group v-model="selectedStatus">
                <v-radio v-for="i in statusList" :key="i.value" :label="i.label" :value="i.value"></v-radio>
              </v-radio-group>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="closeChangeProjectStatusDialog">取消</v-btn>
              <v-btn color="blue" text @click="changeStatus">确认修改</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </template>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: '项目名',
          align: 'start',
          // sortable: false,
          value: 'name',
        },
        { text: '创建人', value: 'leader' },
        { text: '创建人邮箱', value: 'email' },
        { text: '创建时间', value: 'createTime' },
        { text: '完成进度', value: 'progress' },
        { text: '状态', value: 'status' },
        {
          text: '',
          sortable: false,
          value: 'changeStatus'
        },
        {
          text: '',
          sortable: false,
          value: 'projectDetail'
        },
      ],
      projectMessages: [
        {
          name: 'project1',
          projectId: 0,
          leader: '123',
          email: '123@qq.com',
          createTime: '2023.1.1',
          progress: 80,
          status: 'A',
        },
        {
          name: 'faskfl',
          projectId: 1,
          leader: '432gsdf',
          email: 'gers@qq.com',
          createTime: '2023.2.1',
          progress: '60',
          status: 'B',
        },
        {
          name: 'project3',
          projectId: 2,
          leader: '435',
          email: '53@qq.com',
          createTime: '2023.3.1',
          progress: '100',
          status: 'A',
        },
      ],
      showChangeProjectStatus: false,
      dialogMessage: '',
      selectedStatus: '',
      statusList: [
        {
          label: '未完成',
          value: 'A'
        },
        {
          label: '进行中',
          value: 'B'
        },
        {
          label: '已完成',
          value: 'C'
        },
        {
          label: '非法',
          value: 'D'
        },
      ],
    }
  },
  created() {
    this.showProjectMessages()
  },
  // TODO：传给后端管理员id，如果报错，不显示信息而显示弹窗
  methods: {
    showProjectMessages() {

    },
    // 打开修改项目状态窗口，并显示当前状态
    openChangeProjectStatusDialog(item) {
      console.log(item)
      this.dialogMessage = item
      this.selectedStatus = item.status
      this.showChangeProjectStatus = true
    },
    // 关闭修改项目状态窗口
    closeChangeProjectStatusDialog() {
      this.showChangeProjectStatus = false
    },
    // 修改项目状态
    changeStatus() {
      console.log(this.selectedStatus)
      this.showChangeProjectStatus = false
    },
    // 跳转到项目详情页面
    gotoProjectDetailPage(item) {

    }
  },
}
</script>

<style scoped>

</style>