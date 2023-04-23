<template>
<!--    <p>this is branch specific view</p>-->
<!--    <p>projId: {{projId}} so proj is {{this.proj}}</p>-->
<!--    <p>repoId: {{repoId}} so repo is {{this.repo}}</p>-->
<!--    <p>branchName: {{branchName}}</p>-->
<!--    <p>commitHistory: {{commitHistory}}</p>-->

    <v-container fluid>
        <h1>分支详情 - {{branchName}}</h1>
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
                                <v-card-title>从 {{entry.label[0]}} 到 {{entry.label[entry.label.length-1]}} 的提交</v-card-title>
                            </v-card>
                        </v-col>
                    </v-row>
                    <br>
                    <v-divider></v-divider>
                    <br>
                    <v-row dense></v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
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
                col: 4,
                color: 'red',
                title: '过去三十日内的提交',
                label: [],
                data: []
            },
            monthly: {
                col: 4,
                color: 'blue',
                title: '过去一年内的提交',
                label: [],
                data: []
            },
            yearly: {
                col: 4,
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
            // 获取commitHistory最后一个元素的日期
            let last_commit = this.commitHistory[this.commitHistory.length - 1]
            let last_commit_time = new Date(last_commit.commitTime)
            last_commit_time.setDate(last_commit_time.getDate() - 1)
            // 从 last_commit_time 开始，每天加一天，直到今天，每天的日期作为key，value为0
            let daily = {}
            let today = new Date()
            while (today >= last_commit_time) {
                let key = last_commit_time.toLocaleDateString()
                daily[key] = 0
                last_commit_time.setDate(last_commit_time.getDate() + 1)
            }
            // 遍历commitHistory，每个元素的日期作为key，value加一
            this.commitHistory.forEach((cur, index, arr) => {
                let key = new Date(cur.commitTime).toLocaleDateString()
                if (daily[key] === undefined) {
                    daily[key] = 1
                } else {
                    daily[key] += 1
                }
            })
            // 将daily的key和value分别放入label和data
            this.daily.label = Object.keys(daily)
            // 除了第一个和最后一个，将this.daily.label其他元素换为''
            for (let i = 1; i < this.daily.label.length - 1; i++) {
                this.daily.label[i] = ''
            }
            this.daily.data = Object.values(daily)

            // 从 last_commit_time 开始，每月加一月，直到今天，每月的日期作为key，value为0
            let monthly = {}
            last_commit_time = new Date(last_commit.commitTime)
            last_commit_time.setMonth(last_commit_time.getMonth() - 1)
            while (today >= last_commit_time) {
                let key = last_commit_time.getFullYear() + '-' + (last_commit_time.getMonth() + 1)
                monthly[key] = 0
                last_commit_time.setMonth(last_commit_time.getMonth() + 1)
            }
            // 遍历commitHistory，每个元素的日期作为key，value加一
            this.commitHistory.forEach((cur, index, arr) => {
                let key = new Date(cur.commitTime).getFullYear() + '-' + (new Date(cur.commitTime).getMonth() + 1)
                if (monthly[key] === undefined) {
                    monthly[key] = 1
                } else {
                    monthly[key] += 1
                }
            })
            // 将monthly的key和value分别放入label和data
            this.monthly.label = Object.keys(monthly)
            this.monthly.data = Object.values(monthly)

            // 从 last_commit_time 开始，每年加一年，直到今天，每年的日期作为key，value为0
            let yearly = {}
            last_commit_time = new Date(last_commit.commitTime)
            last_commit_time.setFullYear(last_commit_time.getFullYear() - 1)
            while (today >= last_commit_time) {
                let key = last_commit_time.getFullYear()
                yearly[key] = 0
                last_commit_time.setFullYear(last_commit_time.getFullYear() + 1)
            }
            // 遍历commitHistory，每个元素的日期作为key，value加一
            this.commitHistory.forEach((cur, index, arr) => {
                let key = new Date(cur.commitTime).getFullYear()
                if (yearly[key] === undefined) {
                    yearly[key] = 1
                } else {
                    yearly[key] += 1
                }
            })
            // 将yearly的key和value分别放入label和data
            this.yearly.label = Object.keys(yearly)
            this.yearly.data = Object.values(yearly)
        },
    }
}
</script>

<style scoped>

</style>