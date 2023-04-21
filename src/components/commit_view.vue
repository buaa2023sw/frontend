<script src="../../test.js"></script>
<script>
import axios from "axios";

export default {
  name: "commit_view",
  methods: {
      updateCommitHistory() {
          axios.post('/api/develop/getCommitHistory', {
            userId: this.user.id,
            projectId: this.proj.id,
            repoId: this.selectedRepo.id,
            branchName: this.selectedBranch.name
          }).then((res) => {
              if (res.data.errcode === 0) {
                  console.log(res.data.data)
                  let commitHistory = res.data.data.map((cur, index, arr) => {
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
                  // console.log(commitHistory)
              } else {
                  console.log(res)
                  alert('/api/develop/getCommitHistory error with not 0 err code (' + res.data.errcode + ') ' + res.data.message)
              }
          }).catch((err) => {
              alert('/api/develop/getBindRepos error' + err)
          })
      }
  },
  data() {
    this.updateCommitHistory()
    return {
      commitHistory: [
        {
          id: 1,
          committer: 'TrickEye',
          message: 'commitMessage, hahaha',
          hash: '114514',
          time: '2023/4/2'
        }
      ]
    }
  },
    watch: {
      selectedBranch() {
          this.updateCommitHistory()
      }
    },
  inject: {
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

  <p>分支“{{selectedBranch.name}}”中有 {{ commitHistory.length }} 条提交记录。最新的提交记录：</p>
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
        <td>{{commit.hash}}</td>
        <td>{{commit.time}}</td>
      </tr>
    </tbody>
  </v-simple-table>

</div>
</template>


<style scoped>

</style>