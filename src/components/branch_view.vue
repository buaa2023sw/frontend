<script>
import {computed} from "vue";
import commit_view from "@/components/commit_view.vue";
import axios from "axios";
export default {
  name: "branchView",
  components: {
    commit_view
  },
  methods: {
    updateBranches() {
        this.branchBusy = true
        axios.post('/api/develop/getRepoBranches', {
            userId: this.user.id,
            repoId: this.selectedRepo.id,
            projectId: this.proj.id
        }).then((res) => {
            if (res.data.errcode === 0) {
                console.log(res);
                console.log('success')
                let branches = res.data.data.map((cur, index, arr) => {
                    return {
                        id: index,
                        name: cur.branchName,
                        lastCommit: {
                            sha: cur.lastCommit.sha,
                            authorName: cur.lastCommit.authorName,
                            authorEmail: cur.lastCommit.authorEmail,
                            commitDate: cur.lastCommit.commitDate,
                            commitMessage: cur.lastCommit.commitMessage
                        }
                    }
                })
                console.log('branches=')
                console.log(branches)
                this.branches = branches
                this.branchBusy = false
            } else {
                console.log(res);
                alert('/api/develop/getRepoBranches error with not 0 err code (' + res.data.errcode + ') ' + res.data.message)
                this.branchBusy = false
            }
        }).catch((err) => {
            alert('/api/develop/getBindRepos error' + err)
            this.branchBusy = false
        })
    }
  },
  data() {
    return {
      selectedBranchIndex: 0,
      branches: [{
          id: 0,
          name: 'master',
          lastCommit: {}
      }],
      branchBusy: true
    }
  }, inject: {
    user: {default: null},
    proj: { default: null },
    selectedRepo: { default: null }
  }, provide() {
    return {
      selectedBranch: computed(() => this.branches[this.selectedBranchIndex])
    }
  }, created() {
      this.updateBranches()
  }
}
</script>

<template>
<div>
<!--  <p>I am branch view, I am aware that my proj = {{ proj }}, and that my selected repo = {{ selectedRepo }}</p>-->
<v-row>
  <v-col cols="3">
    <h2>分支</h2>
    <v-card v-if="branchBusy">
        <v-card-title><v-progress-circular indeterminate></v-progress-circular>正在与服务器同步分支</v-card-title>
    </v-card>
    <v-list v-if="!branchBusy">
      <v-list-item-group v-model="selectedBranchIndex" mandatory>
        <v-list-item v-for="branch in branches" :key="branch.id">
          {{ branch.name }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
      <v-skeleton-loader v-else type="list-item-three-line"></v-skeleton-loader>
<!--      <v-progress-circular v-else indeterminate></v-progress-circular>-->
  </v-col>

  <v-divider vertical></v-divider>

  <v-col cols="9">
    <commit_view v-if="!branchBusy"/>
    <v-skeleton-loader v-else type="text@3, table"></v-skeleton-loader>
  </v-col>
</v-row>
</div>
</template>



<style scoped>

</style>