<template>
<v-main>
    <h1>分支详情 - </h1>
    <p>this is branch specific view</p>
    <p>projId: {{projId}} so proj is {{this.proj}}</p>
    <p>repoId: {{repoId}} so repo is {{this.repo}}</p>
    <p>branchName: {{branchName}}</p>
    <p>commitHistory: {{commitHistory}}</p>

    <v-container fluid>
        <v-row>
            <v-col cols="3" class="px-3">
                <h2>提交记录</h2>
                <v-list>
                    <v-list-item v-for="commit in commitHistory" :key="commit.id">
                        <v-list-item-content>
                            <v-list-item-title>{{commit.commitMessage}}</v-list-item-title>
                            <v-list-item-subtitle>{{new Date(commit.commitTime).toLocaleString()}} - {{commit.commithash.slice(0, 6)}} - {{commit.author}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="9" class="">
                <v-container fluid>
                    <v-row dense>
                        <v-col v-for="(entry, index) in [daily, monthly, yearly]" :key="index" :cols="entry.col">
                            <v-card :color="entry.color" class="text-center align-center">
                                <v-sparkline
                                    :labels="entry.label"
                                    :value="entry.data"
                                    auto-line-width
                                    smooth
                                    padding="20"
                                    stroke-linecap="round"
                                    show-labels
                                    auto-draw
                                ></v-sparkline>
                                <v-card-title>{{entry.title}}</v-card-title>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</v-main>
</template>

<script>
import axios from "axios";

export default {
    name: "Branch",
    data() {
        return {
            projId: this.$route.params.projid,
            repoId: this.$route.params.repoid,
            branchName: this.$route.params.branchname,
            proj: null,
            repos: null,
            repo: null,
            branches: null,
            commitHistory: null,
            daily: {
                col: 6,
                color: 'red',
                title: '过去三十日内的提交',
                label: ['123', '456', '789'],
                data: [1, 2, 3]
            },
            monthly: {
                col: 6,
                color: 'blue',
                title: '过去一年内的提交',
                label: [],
                data: []
            },
            yearly: {
                col: 6,
                color: 'green',
                title: '过去十年内的提交',
                label: [],
                data: []
            }
        }
    },
    created() {
        this.proj = this.user.projects.reduce((acc, cur) => cur.id == this.projId ? cur : acc, null)
        if (this.proj === null) {
            alert('proj not found')
            // window.location.pathname = '/dev'
        }

        axios.post('/api/develop/getBindRepos', {userId: this.user.id, projectId: this.projId})
            .then((res) => {
                if (res.data.errcode === 0) {
                    this.repos = res.data.data.map((cur, index, arr) => {
                        let remotePath = cur.repoRemotePath.split('/')
                        return {
                            id: cur.repoId,
                            user: remotePath[0],
                            repo: remotePath[1],
                            intro: cur.repoIntroduction
                        }
                    })
                    this.repo = this.repos.reduce((acc, cur) => cur.id == this.repoId ? cur : acc, null)
                    if (this.repo === null) {
                        alert('repo not found')
                        // window.location.pathname = '/dev'
                    }
                } else {
                    alert('/api/develop/getBindRepos error with not 0 err code (' + res.data.errcode + ') ' + res.data.message)
                }
            }).catch((err) => {
                alert('/api/develop/getBindRepos error' + err)
            })

        axios.post('/api/develop/getRepoBranches', {userId: this.user.id, repoId: this.repoId, projectId: this.projId})
            .then((res) => {
                if (res.data.errcode === 0) {
                    this.branches = res.data.data.map((cur, index, arr) => { return cur.branchName })
                    let branch = this.branches.reduce((acc, cur) => cur == this.branchName ? cur : acc, null)
                    if (branch === null) {
                        alert('branch ' + this.branchName + ' not found in branches ' + this.branches)
                        // window.location.pathname = '/dev'
                    }
                } else {
                    alert('/api/develop/getBranches error with not 0 err code (' + res.data.errcode + ') ' + res.data.message)
                }
            }).catch((err) => {
                alert('/api/develop/getBranches error' + err)
            })

        axios.post('/api/develop/getCommitHistory', {
            userId: this.user.id, projectId: this.projId, repoId: this.repoId, branchName: this.branchName})
            .then((res) => {
            if (res.data.errcode === 0) {
                this.commitHistory = res.data.data.map((cur, index, arr) => {
                    return {
                        id: index,
                        author: cur.author,
                        authorEmail: cur.authorEmail,
                        commithash: cur.commithash,
                        commitMessage: cur.commitMessage,
                        commitTime: cur.commitTime
                    }
                })
                this.prep_data()
            } else {
                alert('/api/develop/getCommitHistory error with not 0 err code (' + res.data.errcode + ') ' + res.data.message)
            }
        }).catch((err) => {
            alert('/api/develop/getBindRepos error' + err)
        })
    },
    inject: {
        user: {default: null}
    },
    methods: {
        prep_data() {
            // 遍历commitHistory，将每个commit的时间戳转换为八位数字，然后统计每天的commit数量
            // todo
        }
    }
}
</script>

<style scoped>

</style>