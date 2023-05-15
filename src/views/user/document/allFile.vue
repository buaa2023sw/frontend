<template>
    <v-card style="position: relative;">
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
        </v-toolbar>

        <v-tabs
          v-model="tab"
          fixed-tabs
          color="primary"
          align-with-title
        >
        <v-tab>
          我的文档
        </v-tab>
        <v-tab>
          收藏夹
        </v-tab>
          <v-tabs-slider color="primary"></v-tabs-slider>
        </v-tabs>

        <v-data-table
        :headers="headers"
        :items="documentData"
        class="elevation-1"
        item-key="doucumentName"
        :search="search"
        :custom-filter="filterOnlyCapsText"
        style="position:absolute;left:3%;width:94%;height: 70%;top:12%"
      >
      <template v-slot:no-data>
        <div style="text-align: center;">
          <img src="../../../assets/search.png" height="150px" width="150px"/>
        </div>
        <div style="font-size:20px;font-weight: bold">
          没有找到数据
        </div>
     <!-- <v-img
      max-height="30%"
      max-width="30%"
      style  src="@/assets/search.png"></v-img>="position:absolute;left:35%;right:35%;top:5%" -->
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
          <div style="width: 100%; height: 10%; position: relative">
            <v-text-field
              v-model="search"
              label="请输入文档名称进行查询"
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
              >创建文档</v-btn
            >
          </div>
        </template>
        <template v-slot:[`item.collect`]="{}">
          <v-icon>mdi-star-outline</v-icon>
        </template>
      </v-data-table>

      <v-dialog v-model="setupDialog" hide-overlay width="1000px">
        <v-card    
        class="mx-auto"
        width="1000px"
        height="1000px"
        style="position: relative;"
        >
        
        <v-card-title>
          共享文档
        </v-card-title>

        <v-icon @click="closeDialog" style="position: absolute;right: 1%;top:1%;">mdi-close</v-icon>

       <v-card-text style="position:relative;">
        <p class="ml-s" style="font-size: medium;">具有权限修改的用户</p>
        <v-list>
          <v-list-item
          v-for="people in peopleCanWrite"
          :key="people.id">
          <v-list-item-avatar>
            <v-avatar color="indigo">
             <span class="white--text text-h5">{{ people.name[0] }}</span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ people.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ people.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
          </v-list-item>
        </v-list>
       </v-card-text>

       <v-divider style="width: 900px;"></v-divider>
       

       <!-- <v-card-text style="position:relative;">
        <p class="ml-s" style="font-size: medium;">添加具有权限修改的用户</p>
        <v-avatar size="60" color="indigo" style="">
          <span class="white--text text-h5">石</span>
        </v-avatar>
        <p class="ml-3" style="position:absolute;left:9%;top:6%;font-size: medium;">{{'石子瑄' + '(您)'}}</p>
        <p class="ml-3" style="position:absolute;left:9%;top:36%;font-size: medium;">2489123692@qq.com</p>
       </v-card-text> -->

       <v-card-text style="position: relative;top:2%">
        <p class="ml-s" style="font-size: medium;">添加具有权限修改的用户</p>
        <v-list>
          <v-list-item
          v-for="people in peopleCanNotWrite"
          :key="people.id">
          <v-list-item-avatar>
            <v-avatar color="indigo">
             <span class="white--text text-h5">{{ people.name[0] }}</span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ people.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ people.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
          </v-list-item>
        </v-list>
       </v-card-text>
        </v-card>
      </v-dialog>
      </v-card>
</template>

<script>
  export default {
    data() {
      return {
      search: '',
      setupDialog: false,
      tab: '',
      headers: [
        {
          text: "名称",
          align: "start",
          sortable: false,
          value: "documentName",
        },
        { text: "格式", value: "format" },
        { text: "所有者", value: "owner"},
        { text: "权限", value: "limit" },
        { text: "最近更改时间", value: "changeTime"},
        { text: "收藏", value: "collect", sortable:false}
      ],
      documentData:[
        {
          'documentName': '共享文档1',
          'format': 'latex',
          'owner': 'szx',
          'limit': 'only read',
          'changeTime': '2023-5-14'
        },
        {
          'documentName': '共享文档2',
          'format': 'latex',
          'owner': 'szx',
          'limit': 'only read',
          'changeTime': '2023-5-14'
        },
        {
          'documentName': '共享文档3',
          'format': 'latex',
          'owner': 'szx',
          'limit': 'only read',
          'changeTime': '2023-5-14'
        }
      ],
      peopleCanWrite: [
        {
          'name':'szx',
          'id': 1,
          'email': '2489123692@qq.com'
        },
        {
          'name':'ghy',
          'id': 2,
          'email': '123'
        },
      ],
      peopleCanNotWrite: [
        {
          'name':'lr',
          'id': 3,
          'email': '123'
        },
        {
          'name':'zhy',
          'id': 4,
          'email': '123'
        },
      ]
      }
    },
    methods:{
      close() {
        this.$emit('close');
      },
      closeDialog() {
        this.setupDialog = false;
      },
      filterOnlyCapsText(value, search, item) {
        console.log(value);
        var s = item["documentName"];
        return (
          s != null &&
          search != null &&
          typeof s === "string" &&
          s.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !==
            -1
      );
    },
    }
  }
</script>
