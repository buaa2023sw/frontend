<script>
import axios from "axios";

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
            fileContent: 'Select a file to view its content.'
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
        }
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
                    } else {
                        alert('/api/develop/getFileContent errcode not 0: ' + res.data.message)
                    }
                }).catch((err) => {
                    alert('/api/develop/getFileContent error' + err)
                    console.log(err);
                })
            }
        }
    }
}

</script>

<template>
  <v-container>
<!--      <h1>文件视图</h1>-->
<!--      <p>{{this.user}}</p>-->
<!--      <p>{{this.proj}}</p>-->
<!--      <p>{{this.repo}}</p>-->
<!--      <p>{{this.branchName}}</p>-->
      <v-row>
          <v-col cols="3">
<!--              <div class="blue"> LEFT </div>-->
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
          </v-col>
          <v-col cols="9">
<!--              <div class="red"> RIGHT </div>-->
<!--              <div>{{ tree }}</div>-->
              <v-card>
                  <v-card-text>
                      <v-textarea
                        v-model="fileContent"
                        outlined
                        readonly
                        rows="30"
                      ></v-textarea>
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>
  </v-container>

</template>

<style scoped>

</style>