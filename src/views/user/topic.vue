<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card class="mx-auto" width="500" height="350" padding="16">
          <v-card-title class="headline font-weight text-left">主题设置</v-card-title>
          <v-divider></v-divider>
<!--          <v-row align="center">-->
<!--            <v-col cols="3" class="text-center">-->

<!--            </v-col>-->
<!--            <v-col cols="8">-->

<!--            </v-col>-->
<!--          </v-row>-->
          <v-card-text>
            <v-radio-group v-model="selectedTopic">
              <v-radio v-for="i in topicList" :key="i.value" :label="i.label" :value="i.value" :color="i.color"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="save">保存主题</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
<!--  <v-container class="pa-0">-->
<!--    <v-card>-->
<!--      <v-card-title class="headline font-weight text-left"> 用户{{userProfileDialogMessage.name}}的个人信息 </v-card-title>-->
<!--      <v-divider></v-divider>-->

<!--      <v-card-actions>-->
<!--        <v-spacer></v-spacer>-->
<!--        <v-btn color="red" text @click="closeUserProfileDialog">关闭</v-btn>-->
<!--        <v-btn color="blue" text @click="saveProfile">确认修改</v-btn>-->
<!--      </v-card-actions>-->
<!--    </v-card>-->
  </v-container>
</template>

<script>
export default {
  name: "topic",
  inject: {
    user: { default: null },
    updateTopic: {default: null},
  },
  data () {
    return {
      selectedTopic: 'D',
      topicList: [
        {
          label: '红色系',
          value: 'A',
          color: 'red'
        },
        {
          label: '橙色系',
          value: 'B',
          color: 'orange'
        },
        {
          label: '绿色系',
          value: 'C',
          color: 'green'
        },
        {
          label: '蓝色系',
          value: 'D',
          color: 'blue'
        },
        {
          label: '紫色系',
          value: 'E',
          color: 'purple'
        },
      ],
    }
  },
  methods: {
    save() {
      this.updateTopic(this.selectedTopic)
    }
  },
}
</script>

<style scoped>

</style>