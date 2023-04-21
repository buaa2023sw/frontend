<script>
import { computed } from 'vue'
import axios from "axios";

export default {
  name: "issue_view",
  data() {
    this.updateIssue()
    return {
      issues: [
        {
          id: 1,
          issuer: 'TrickEye',
          title: 'issue title1',
          isOpen: true
        }, {
          id: 2,
          issuer: 'TrickEye',
          title: 'issue title2',
          isOpen: false
        }
      ],
      filteredIssues: computed(() => {
        if (this.statusFilter === 1) {
          return this.issues
        } else {
          return this.issues.filter((cur, index, arr) => {
            return cur.isOpen === (this.statusFilter === 0)
          })
        }
      }),
      statusFilter: 0,
      statuses: ['Open', 'All', 'Closed']
    }
  },
  inject: {
    user: {default: null},
    proj: {default: null},
    selectedRepo: {default: null}
  },
  methods: {
    updateIssue() {
        axios.post('/api/develop/getIssueList', {
            userId: this.user.id,
            repoId: this.selectedRepo.id,
            projectId: this.proj.id
        }).then((res) => {
            if (res.data.errcode === 0) {
                console.log(res);
                console.log('get issue success: ')
                let issues = res.data.data.map((cur, index, arr) => {
                    return {
                        id: cur.issueId,
                        issuer: cur.issuer,
                        title: cur.issueTitle,
                        time: cur.issueTime,
                        isOpen: cur.isOpen,
                        ghLink: cur.ghLink
                    }
                })
                console.log(issues)
                this.issues = issues
            } else {
                console.log(res);
                alert('/api/develop/getIssueList error with not 0 err code (' + res.data.errcode + ') ' + res.data.message)
            }
        }).catch((err) => {
            alert('/api/develop/getIssueList error' + err)
        })
    },
    issueFilter() {
      return this.issues.filter((issue) => {
        if (issue.isOpen && this.statusFilter === 2) return false;
        if (!issue.isOpen && this.statusFilter === 0) return false;
        else return true;
      })
    }
  }
}
</script>

<template>
<div>
  <h2>事务</h2>
<!--  <p>this is issue view.</p>-->
<!--    <p>{{ this.issues.length }}</p>-->

  <v-row v-if="this.issues.length !== 0">
    <v-col>
    <v-btn
        style="margin-left: 10px; margin-right: 20px"
        rounded
        @click="statusFilter = (statusFilter + 1) % 3; filteredIssues = issueFilter()"
    >
      {{ statuses[statusFilter] }}
    </v-btn>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col>
      <p>似乎事务空空如也？现在就去GitHub上发一个吧！</p>
    </v-col>
  </v-row>

  <v-simple-table dense>
    <tbody>
    <tr v-for="issue in filteredIssues" :key="issue.id">
      <td>{{issue.isOpen ? 'Open' : 'Closed'}}</td>
      <td>{{issue.issuer}}</td>
      <td>{{issue.title}}</td>
    </tr>
    </tbody>
  </v-simple-table>
</div>
</template>



<style scoped>

</style>