<script>
import axios from "axios";
import Cookies from 'js-cookie'
import * as CodeMirror from 'codemirror/lib/codemirror.js'
import "@/utils/cm-settings.js"

export default {
    name: "FileView",
    data() {
        return {
            tree: [],
            files: {
                html: 'mdi-language-html5',
                js: 'mdi-nodejs',
                json: 'mdi-code-json',
                md: 'mdi-language-markdown',
                pdf: 'mdi-file-pdf',
                png: 'mdi-file-image',
                txt: 'mdi-file-document-outline',
                xls: 'mdi-file-excel',
            },
            items: [
                {
                    name: 'README.md',
                    file: 'md',
                },
                {
                    name: 'src',
                    children: [
                        {
                            name: 'file1.txt',
                            file: 'txt'
                        }
                    ]
                }
            ],
            cmEditor: null,
            sheet: false,
            fileContent: 'Select a file to view its content.',
            selectedText: ''
        }
    },
    inject: {
        user: {default: null},
        proj: {default: null},
        repo: {default: null},
        branchName: {default: null}
    },
    methods: {
        getFileExt(obj, path) {
            if (obj['children'] === undefined) {
                obj['file'] = 'unknown'
                obj['path'] = path + '/' + obj['name']
                if (obj['name'].indexOf('.') !== -1) {
                    obj['file'] = obj['name'].split('.').pop()
                }
            } else {
                for (let i = 0; i < obj['children'].length; i++) {
                    this.getFileExt(obj['children'][i], path + '/' + obj['name'])
                }
            }
        },
        file2style() {
          if (this.tree.length === 0) {
            return 'null'
          }

          let file = this.tree[0]['file']
          if (file === 'html') {
            return 'htmlmixed'
          } else if (file === 'js') {
            return 'javascript'
          } else if (file === 'json') {
            return 'javascript'
          } else if (file === 'md') {
            return 'markdown'
          } else if (file === 'vue') {
            return 'vue'
          } else if (file === 'css') {
            return 'css'
          } else if (file === 'xml') {
            return 'xml'
          } else if (file === 'c' || file === 'cpp' || file === 'h') {
            return 'clike'
          } else if (file === 'py') {
            return 'python'
          } else {
            return 'null'
          }
        },
        onCursorActivity() {
          this.selectedText = this.cmEditor.getSelection()
        },
        diagSelected() {
          Cookies.set('diag', this.selectedText)
          window.open('/user/ai/diagnosis', '_blank')
        },
        diagWholeFile() {
          //如果文件长度大于Cookie最长长度，就不诊断了
          if (this.fileContent.length > 4096) {
            this.$message({
              type: 'error',
              message: '文件太长了，AI会罢工的！'
            })
            return
          }
          Cookies.set('diag', this.fileContent)
          window.open('/user/ai/diagnosis', '_blank')
        },

    },
    created() {
        axios.post('/api/develop/getFileTree', {
            userId: this.user.id,
            projectId: this.proj.projectId,
            repoId: this.$route.params.repoid,
            branch: this.branchName
        }).then((res) => {
            if (res.data.errcode === 0) {
                console.log(res.data.data)
                this.items = res.data.data
                for (let i = 0; i < this.items.length; i++) {
                    this.getFileExt(this.items[i], '')
                }
            } else {
                alert('/api/develop/getFileTree errcode not 0: ' + res.data.message)
            }
        }).catch((err) => {
            alert('/api/develop/getFileTree error' + err)
            console.log(err);
        })
    },
    watch: {
        tree() {
            console.log('selected file change!')
            if (this.tree[0]['file'] !== undefined) {
                axios.post('/api/develop/getContent', {
                    userId: this.user.id,
                    projectId: this.proj.projectId,
                    repoId: this.$route.params.repoid,
                    branch: this.branchName,
                    path: this.tree[0]['path']
                }).then((res) => {
                    if (res.data.errcode === 0) {
                        console.log(res.data.data)
                        this.fileContent = res.data.data
                        this.cmEditor.setValue(this.fileContent)
                        this.cmEditor.setOption('mode', this.file2style())
                    } else {
                        alert('/api/develop/getFileContent errcode not 0: ' + res.data.message)
                    }
                }).catch((err) => {
                    alert('/api/develop/getFileContent error' + err)
                    console.log(err);
                })
            }
        }
    },
    mounted() {
      this.cmEditor = CodeMirror.fromTextArea(this.$refs.cm1, {
        theme: 'idea',
        lineNumbers: true,
        line: true,
        readOnly: true,
        lineWrapping: true
      });

      this.cmEditor.on('cursorActivity', this.onCursorActivity)
    }
}

</script>

<template>
  <v-container>
      <v-row>
          <v-col cols="3">
              <h2>文件树</h2>
              <v-card min-height="80rem" max-height="80rem" class="overflow-y-auto">
                <v-treeview
                    :items="items"
                    activatable
                    :active.sync="tree"
                    item-key="name"
                    open-on-click
                    dense
                    return-object
                >
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="!item.file">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else>
                      {{ files[item.file] }}
                    </v-icon>
                  </template>
                </v-treeview>
              </v-card>
          </v-col>
          <v-col cols="9">
            <h2>
              {{ tree.length === 0 ? '请选择一个文件' : tree[0]['path'] }}
              <a v-if="selectedText !== ''" style="float: right" @click="sheet = !sheet" class="text--accent-2" v-ripple>代码诊断助手</a>
            </h2>

              <v-card max-height="80rem" min-height="80rem">
                <textarea ref="cm1" v-model='fileContent' style="height: 450px; width: 100%"></textarea>
              </v-card>
          </v-col>
      </v-row>

    <v-bottom-sheet inset v-model="sheet">
      <v-card class="text-center">
        <v-card-title>代码诊断助手</v-card-title>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="6">
              <v-textarea label="选择的代码" outlined v-model="selectedText" class="need-mono" rows="20"></v-textarea>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="3">
              <v-btn @click="diagSelected">让JiHub诊断选中的代码</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn @click="diagWholeFile">让JiHub诊断整个文件</v-btn>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row style="height: 5rem"></v-row>
        </v-container>
      </v-card>
    </v-bottom-sheet>
  </v-container>

</template>

<style>
.CodeMirror {
  height: 80rem;
}

.need-mono {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
}
</style>