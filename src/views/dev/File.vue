<script>
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
            ]
        }
    },
    inject: {
        user: {default: null},
        proj: {default: null},
        repo: {default: null}
    }
}

</script>

<template>
  <v-container>
<!--      <h1>文件视图 - {{ this.repo }}</h1>-->
      <v-row>
          <v-col cols="3">
              <div class="blue"> LEFT </div>
              <v-treeview
                :items="items"
                activatable
                :active.sync="tree"
                item-key="name"
                open-on-click
                dense
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
              <div class="red"> RIGHT </div>
              <div>{{ tree }}</div>
          </v-col>
      </v-row>
  </v-container>

</template>

<style scoped>

</style>