<script>
import { computed } from 'vue';
import bindGithubRepo from "../components/bind_repo.vue"
import bindedGithubRepos from "../components/repo_list.vue"
import repoView from "../components/repo_view.vue"
import axios from 'axios'

export default {
    name: "Dev",
    components: {
        bindGithubRepo,
        bindedGithubRepos,
        repoView,
    },
    data() {
        this.updateBindRepos();
        return {
            bindRepos: null,
            my_ghusername: 'trickeye',
            my_ghuseremail: '20373866@buaa.edu.cn',
        }
    },
    inject: {
        user: {default: null},
        selectedProj: {default: null}
    },
    provide() {
        return {
            proj: computed(() => this.selectedProj),
            bindRepos: computed(() => this.bindRepos)
        }
    },
    methods: {
        modifyUser() {
            alert('not implemented!')
        },
        updateBindRepos () {
            axios.post('/api/develop/getBindRepos', {
                userId: this.user.id,
                projectId: this.selectedProj.id
            }).then((res) => {
                if (res.data.errcode === 0) {
                    this.bindRepos = res.data.data.map((cur, index, arr) => {
                        let remotePath = cur.repoRemotePath;
                        remotePath = remotePath.split('/')
                        return {
                            id: cur.repoId,
                            user: remotePath[0],
                            repo: remotePath[1],
                            intro: cur.repoIntroduction
                        }
                    })
                } else {
                    console.log(res);
                    alert('/api/develop/getBindRepos error with not 0 err code (' + res.data.errcode + ') ' + res.data.message)
                }
            }).catch((err) => {
                alert('/api/develop/getBindRepos error' + err)
            })
        }
    }
}
</script>

<template>
    <v-app>
        <v-container>
            <v-row>
                <p>injected info:</p>
            </v-row>
            <v-row>
                <p>user = {{user}}</p>
            </v-row>
            <v-row>
                <p>selectedProj = {{selectedProj}}</p>
            </v-row>
            <v-row>
                <p>bindRepos = {{bindRepos}}</p>
            </v-row>
            <v-row>
                <h1>开发 - {{ selectedProj.name }}</h1>
            </v-row>

            <v-row>
                <v-col cols="6">
                    <h2>已绑定的代码存储库</h2>
                    <bindedGithubRepos />
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="6">
                    <h2>或者绑定一个新的代码存储库</h2>
                    <bindGithubRepo />
                </v-col>
            </v-row>

            <v-row>
                <repoView />
            </v-row>
        </v-container>
    </v-app>
</template>


<style scoped>

</style>