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
        :expanded.sync="expanded"
        show-expand
        item-key="documentId"
        :search="search"
        :custom-filter="filterOnlyCapsText"
        style="position:absolute;left:3%;width:94%;height: 70%;top:14%"
      >
      <template v-slot:[`item.documentName`] = "{item}" >
         <a @click="dialog3=true">{{ item.documentName }}</a>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        {{ item.intro }}
      </td>
    </template>
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
              @click="dialog1 = true"
              >创建文档</v-btn
            >
          </div>
        </template>
        <template v-slot:[`item.collect`]="{item}">
          <v-icon @click="item.collect = true" v-if="!item.collect">mdi-star-outline</v-icon>
          <v-icon @click="item.collect = false" v-else>mdi-star</v-icon>
          <v-icon @click="editStart(item)">mdi-pencil-outline</v-icon>
          <v-icon @click="handleDelete(item)">mdi-delete-outline</v-icon>
        </template>
        <template v-slot:[`item.limit`]="{item}">
          <v-icon v-if="item.limit !== 'only read'">mdi-check-bold</v-icon>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog1" hide-overlay width="1000px">
        <v-card    
        width="1000px"
        style="position: relative;"
        >
        
        <v-card-title>
          共享文档
        </v-card-title>

        <v-icon @click="dialog1 = false" style="position: absolute;right: 1%;top:1%;">mdi-close</v-icon>

        <v-card-text>
        <v-form>
    <v-text-field
      v-model="newDocumentForm.name"
      :counter="10"
      label="文档名称"
      style="width:80%;position: relative;left:2%"
      prepend-icon="mdi-map-marker"
    ></v-text-field>

     <v-textarea
          class="mx-2"
          label="文档简介"
          prepend-icon="mdi-comment"
          v-model="newDocumentForm.intro"
          style="width:80%;position: relative;left:1%"
        ></v-textarea>
        </v-form>
      </v-card-text>
       <v-card-actions style="position:absolute;right:0%;bottom: 0%;">
       <v-btn
         text
         color="primary"
         width="70px"
         @click="dialog1 = false;dialog2 = true"
         >
        下一步
      </v-btn>
    </v-card-actions>
        </v-card>
      </v-dialog>

    <v-dialog v-model="dialog2" hide-overlay width="1000px" style="height: 600px;">
        <v-card    
        width="1000px"
        height="600px"
        style="position: relative;"
        >
        
        <v-card-title>
          共享文档
        </v-card-title>
        <v-text-field
            v-model="search"
            label="请输入用户名称进行查找"
            style="position:absolute;right:10%;top:3%;height:100%;width: 25%;"
          ></v-text-field>
        <v-icon @click="dialog2 = false" style="position: absolute;right: 1%;top:1%;">mdi-close</v-icon>
       <v-card-text style="position:relative;">
        <v-row no-gutters>
      <v-col
        md="2"
      >
        <h3>具有权限的用户</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        md="2"
        style="position: relative;"
      >
      <v-icon style="position: absolute;right:15.5%;">mdi-minus-box-outline</v-icon>
      </v-col>
    </v-row>
        <v-list  shaped >
          <v-list-item-group
            v-model="deleteGroup"
            multiple
            color="indigo"
          >
          <v-list-item
          v-for="people in filter(peopleCanWrite, search)"
          :key="people.id"
          active-class="deep-purple--text text--accent-4"
          >
          <template v-slot:default="{ active }">
          <v-list-item-avatar>
            <v-avatar active-class="deep-purple--text text--accent-4" color="indigo">
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
          <v-list-item-action>
          <v-checkbox
                  :input-value="active"
                  color="deep-purple accent-4"
                ></v-checkbox>
        </v-list-item-action>
        </template>
          </v-list-item>
        </v-list-item-group>
        </v-list>
       </v-card-text>

       <v-divider style="width: 900px;"></v-divider>

       <v-card-text style="position: relative;top:2%">
        <v-text-field
            v-model="searchNot"
            label="请输入用户名称进行查找"
            style="position:absolute;right:10%;top:-40%;height:100%;width: 25%;"
          ></v-text-field>
        <v-row no-gutters>
      <v-col
        md="2"
      >
        <h3>没有权限的用户</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        md="2"
        style="position: relative;"
      >
      <v-icon style="position: absolute;right:15.5%;">mdi-plus-box-outline</v-icon>
      </v-col>
    </v-row>
        <!-- <p class="ml-s" style="font-size: medium;">添加具有权限修改的用户</p> -->
        <v-list shaped max-height="5">
          <v-list-item-group
          v-model="addGroup"
          multiple
          color="indigo"
          active-class="deep-purple--text text--accent-4">
          <v-list-item
          v-for="people in filter(peopleCanNotWrite, searchNot)"
          :key="people.id">
          <template v-slot:default="{ active }">
          <v-list-item-avatar>
            <v-avatar active-class="deep-purple--text text--accent-4" color="indigo">
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
          <v-list-item-action>
          <v-checkbox
                  :input-value="active"
                  color="deep-purple accent-4"
                ></v-checkbox>
        </v-list-item-action>
        </template>
          </v-list-item>
        </v-list-item-group>
        </v-list>
       </v-card-text>
       <v-card-actions class="justify-end" style="position: absolute;bottom: 0%;right: 0%;">
              <v-btn
                text
                color="primary"
                width="70px"
                style="float: right"
                @click="dialog2 = false;dialog1 = true;"
              >返回</v-btn>
              <v-btn
                text
                color="primary"
                width="70px"
                style="float: right"
                @click="dialog2 = false;dialog1 = false;"
              >确认</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editDialog1" hide-overlay width="1000px">
        <v-card    
        width="1000px"
        style="position: relative;"
        >
        
        <v-card-title>
          共享文档
        </v-card-title>

        <v-icon @click="editDialog1 = false" style="position: absolute;right: 1%;top:1%;">mdi-close</v-icon>

        <v-card-text>
        <v-form>
    <v-text-field
      v-model="editDocumentForm.name"
      :counter="10"
      label="文档名称"
      style="width:80%;position: relative;left:2%"
      prepend-icon="mdi-map-marker"
    ></v-text-field>

     <v-textarea
          class="mx-2"
          label="文档简介"
          prepend-icon="mdi-comment"
          v-model="editDocumentForm.intro"
          style="width:80%;position: relative;left:1%"
        ></v-textarea>
        </v-form>
      </v-card-text>
       <v-card-actions style="position:absolute;right:0%;bottom: 0%;">
       <v-btn
         text
         color="primary"
         width="70px"
         @click="editDialog1 = false;editDialog2 = true"
         >
        下一步
      </v-btn>
    </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editDialog2" hide-overlay width="1000px" style="height: 600px;">
        <v-card    
        width="1000px"
        height="600px"
        style="position: relative;"
        >
        
        <v-card-title>
          共享文档
        </v-card-title>
        <v-text-field
            v-model="search"
            label="请输入用户名称进行查找"
            style="position:absolute;right:10%;top:3%;height:100%;width: 25%;"
          ></v-text-field>
        <v-icon @click="editDialog2 = false" style="position: absolute;right: 1%;top:1%;">mdi-close</v-icon>
       <v-card-text style="position:relative;">
        <v-row no-gutters>
      <v-col
        md="2"
      >
        <h3>具有权限的用户</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        md="2"
        style="position: relative;"
      >
      <v-icon style="position: absolute;right:15.5%;">mdi-minus-box-outline</v-icon>
      </v-col>
    </v-row>
        <v-list  shaped >
          <v-list-item-group
            v-model="deleteGroup"
            multiple
            color="indigo"
          >
          <v-list-item
          v-for="people in filter(peopleCanWrite, search)"
          :key="people.id"
          active-class="deep-purple--text text--accent-4"
          >
          <template v-slot:default="{ active }">
          <v-list-item-avatar>
            <v-avatar active-class="deep-purple--text text--accent-4" color="indigo">
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
          <v-list-item-action>
          <v-checkbox
                  :input-value="active"
                  color="deep-purple accent-4"
                ></v-checkbox>
        </v-list-item-action>
        </template>
          </v-list-item>
        </v-list-item-group>
        </v-list>
       </v-card-text>

       <v-divider style="width: 900px;"></v-divider>

       <v-card-text style="position: relative;top:2%">
        <v-text-field
            v-model="searchNot"
            label="请输入用户名称进行查找"
            style="position:absolute;right:10%;top:-40%;height:100%;width: 25%;"
          ></v-text-field>
        <v-row no-gutters>
      <v-col
        md="2"
      >
        <h3>没有权限的用户</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        md="2"
        style="position: relative;"
      >
      <v-icon style="position: absolute;right:15.5%;">mdi-plus-box-outline</v-icon>
      </v-col>
    </v-row>
        <!-- <p class="ml-s" style="font-size: medium;">添加具有权限修改的用户</p> -->
        <v-list shaped max-height="5">
          <v-list-item-group
          v-model="addGroup"
          multiple
          color="indigo"
          active-class="deep-purple--text text--accent-4">
          <v-list-item
          v-for="people in filter(peopleCanNotWrite, searchNot)"
          :key="people.id">
          <template v-slot:default="{ active }">
          <v-list-item-avatar>
            <v-avatar active-class="deep-purple--text text--accent-4" color="indigo">
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
          <v-list-item-action>
          <v-checkbox
                  :input-value="active"
                  color="deep-purple accent-4"
                ></v-checkbox>
        </v-list-item-action>
        </template>
          </v-list-item>
        </v-list-item-group>
        </v-list>
       </v-card-text>
       <v-card-actions class="justify-end" style="position: absolute;bottom: 0%;right: 0%;">
              <v-btn
                text
                color="primary"
                width="70px"
                style="float: right"
                @click="editDialog2 = false;editDialog1 = true;"
              >返回</v-btn>
              <v-btn
                text
                color="primary"
                width="70px"
                style="float: right"
                @click="editDialog2 = false;editDialog1 = false;"
              >新建</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialog3">
        <v-md-editor v-model="text" height="400px" left-toolbar="undo redo | image"
        :disabled-menus="[]"></v-md-editor>
      </v-dialog>
      </v-card>
</template>

<script>
  export default {
    data() {
      return {
      text: '',
      expanded: [],
      addGroup: [1],
      deleteGroup: [1],
      deleteFlag: false,
      search: '',
      dialog1: false,
      dialog2: false,
      editDialog1: false,
      editDialog2: false,
      dialog3: false,
      value: '',
      tab: '',
      search: '',
      searchNot: '',
      headers: [
        {
          text: "名称",
          align: "start",
          sortable: false,
          value: "documentName",
        },
        { text: "格式", value: "format", sortable:false},
        { text: "所有者", value: "owner", sortable:false},
        { text: "权限", value: "limit", sortable:false},
        { text: "最近更改时间", value: "changeTime"},
        { text: "", value: "collect", sortable:false},
        { text: "", value: "data-table-expand"}
      ],
      html:"",
      blogInfo: {
        blogMdContent: '',
        blogContent: ''
      },
      documentData:[
        {
          'documentId': '1',
          'documentName': '共享文档1',
          'format': 'latex',
          'owner': 'szx',
          'limit': 'can write',
          'changeTime': '2023-5-14',
          'collect': false,
          'intro': "blalalala"
        },
        {
          'documentId': '2',
          'documentName': '共享文档2',
          'format': 'latex',
          'owner': 'szx',
          'limit': 'only read',
          'changeTime': '2023-5-14',
          'collect': false,
          'intro': "blalalala"
        },
        {
          'documentId': '3',
          'documentName': '共享文档3',
          'format': 'latex',
          'owner': 'szx',
          'limit': 'only read',
          'changeTime': '2023-5-14',
          'collect': false,
          'intro': "blalalala"
        }
      ],
      peopleCanWrite: [
        {
          'name':'szx',
          'id': 1,
          'email': '123'
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
        {
          'name':'zhy',
          'id': 5,
          'email': '123'
        },
        {
          'name':'zhy',
          'id': 6,
          'email': '123'
        },
      ],
      newDocumentForm: {
        name:'',
        intro: '',
        people: [],
      },
      editDocumentForm: {
        name: '',
        intro: '',
        people: []
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: false, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      }
    },
    methods:{
      editStart(item) {
        this.editDocumentForm.name = item.name;
        this.editDocumentForm.intro = item.intro;
        this.dialog3 = false;
        this.editDialog1 = true;
      },
      handleDelete(row) {
        this.$confirm("此操作将永久删除该文档, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
    },
      filter(arr, search) {
        if (search === '') {
          return arr;
        }
        let res = [];
        for(let i=0;i < arr.length;i++) {
          if (arr[i].name.indexOf(search) != -1) {
            res.push(arr[i]);
          }
        }
        return res;
      },
      close() {
        this.$emit('close');
      },
      closeDialog() {
        console.log("closeDialog");
        this.dialog1 = false;
        this.dialog2 = false;
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
    //监听markdown变化
  change(value, render) {
    this.html = render;
    this.blogInfo.blogMdContent = value;
    this.blogInfo.blogContent = render;
  },
  //上传图片接口pos 表示第几个图片 
  handleEditorImgAdd(pos , $file){
    var formdata = new FormData();
    formdata.append('file' , $file);
     this.$axios
    .post("http://localhost:8000/blogs/image/upload/", formdata)
    .then(res => {
      var url = res.data.data;
       this.$refs.md.$img2Url(pos, url);  //这里就是引用ref = md 然后调用$img2Url方法即可替换地址
    });
  },
  handleEditorImgDel(){
    console.log('handleEditorImgDel');    //我这里没做什么操作，后续我要写上接口，从七牛云CDN删除相应的图片
  }
    }
  }
</script>
