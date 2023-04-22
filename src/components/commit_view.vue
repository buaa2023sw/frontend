<script src="../../test.js"></script>
<script>
import axios from "axios";

export default {
  name: "commit_view",
  methods: {
      updateCommitHistory() {
          this.commitHistoryBusy = true
          axios.post('/api/develop/getCommitHistory', {
            userId: this.user.id,
            projectId: this.proj.id,
            repoId: this.selectedRepo.id,
            branchName: this.selectedBranch.name
          }).then((res) => {
              if (res.data.errcode === 0) {

                  let today = new Date()

                  // get past 10 days
                  let statsPerDay = {}
                  for (let i = 0; i < 10; i++) {
                      let str = (today.getMonth() + 1) + '.' + today.getDate()
                      statsPerDay[str] = 0
                      today.setDate(today.getDate() - 1)
                  }

                  let commitHistory = res.data.data.map((cur, index, arr) => {
                      let time = new Date(cur.commitTime)
                      let str = (time.getMonth() + 1) + '.' + time.getDate()
                      if (str in statsPerDay)
                          statsPerDay[str] += 1
                      return {
                          id: index,
                          committer: cur.author,
                          committerEmail: cur.authorEmail,
                          hash: cur.commithash,
                          message: cur.commitMessage,
                          time: cur.commitTime
                      }
                  })
                  this.commitHistory = commitHistory
                  this.commitHistoryBusy = false

                  this.statsPerDay = {
                      label: Object.keys(statsPerDay).reverse(),
                      value: Object.values(statsPerDay).reverse()
                  }
              } else {
                  console.log(res)
                  alert('/api/develop/getCommitHistory error with not 0 err code (' + res.data.errcode + ') ' + res.data.message)
                  this.commitHistoryBusy = false
              }
          }).catch((err) => {
              alert('/api/develop/getBindRepos error' + err)
              this.commitHistoryBusy = false
          })
      }
  },
  data() {
    return {
      commitHistoryBusy: true,
      commitHistory: [
        {
          id: 1,
          committer: 'TrickEye',
          message: 'commitMessage, hahaha',
          hash: '114514',
          time: '2023/4/2'
        }
      ],
      statsPerDay: {}
    }
  }, watch: {
    selectedBranch() {
        this.updateCommitHistory()
    }
  }, created() {
        this.updateCommitHistory()
  }, inject: {
    user: {default: null},
    proj: {default: null},
    selectedRepo: {default: null},
    selectedBranch: {default: null}
  }
}
</script>

<template>
<div>
<h2>分支“{{ selectedBranch.name }}”上的提交记录</h2>
<!--  <p>I am commit view, I am aware that:</p>-->
<!--  <p>my proj = {{proj}}</p>-->
<!--  <p>my selected repo = {{selectedRepo}}</p>-->
<!--  <p>my selected branch = {{selectedBranch}}</p>-->

  <p v-if="!commitHistoryBusy">分支“{{selectedBranch.name}}”中有 {{ commitHistory.length }} 条提交记录。最新的提交记录：</p>
  <p v-else>正在与服务器同步分支{{selectedBranch.name}}上的最新提交记录...</p>
  <div v-if="!commitHistoryBusy">
      <v-simple-table dense>
          <thead>
          <tr>
              <th class="committer">committer</th>
              <th class="message">message</th>
              <th class="hash">hash</th>
              <th class="time">time</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="commit in commitHistory.slice(0, 5)" :key="commit.id">
              <td>{{commit.committer}}</td>
              <td>{{commit.message}}</td>
              <td>
                  <v-tooltip bottom>
                      <template v-slot:activator="{on, attrs}">
                          <span v-bind="attrs" v-on="on">{{commit.hash.slice(0,6)}}</span>
                      </template>
                      <span>{{commit.hash}}</span>
                  </v-tooltip>
              </td>
              <td>{{new Date(commit.time).toLocaleString()}}</td>
          </tr>
          </tbody>
      </v-simple-table>
      <br>
      <v-divider></v-divider>
      <br>
      <span>过去10天的提交记录数量</span>
      <v-sparkline
              :labels="statsPerDay.label"
              :value="statsPerDay.value"
              auto-line-width
              smooth
              padding="20"
              stroke-linecap="round"
      ></v-sparkline>
  </div>
  <v-skeleton-loader v-else type="table" class="mx-auto" />

</div>
</template>


<style scoped>

</style>