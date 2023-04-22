<script>
import {computed} from 'vue'
import branchView from './branch_view.vue'
import issue_view from "@/components/issue_view.vue";
import pr_view from "@/components/pr_view.vue";
export default {
    name: "repoView",
    components: {
      branchView,
      issue_view,
      pr_view
    },
    data() {
      return {
        selectedRepo: 0,
        // bondedRepos: [
        //   {
        //     id: 1,
        //     user: "opencv",
        //     repo: "opencv",
        //     intro: "opencv introduction. A Bonded repo of #" + this.proj.id + " called " + this.proj.name
        //   }, {
        //     id: 2,
        //     user: "buaa2023sw",
        //     repo: "doc",
        //     intro: "doc introduction"
        //   }
        // ]
      }
    },
    inject: {
        proj: {
          default: null
        },
        bindRepos: {
          default: null
        },
        bindReposBusy: {
          default: null
        }
    },
    provide() {
        return {
          selectedRepo: computed(() => this.bindRepos[this.selectedRepo])
        }
    }
}
</script>

<template>
<v-col cols="12" class="px-1">
  <h2 v-if="!bindReposBusy">代码存储库 - {{ bindRepos[selectedRepo].user }} / {{ bindRepos[selectedRepo].repo}}</h2>
  <h2 v-else>代码存储库</h2>

<!--  <p>选择一个代码存储库： = {{ selectedRepo }}</p>-->
  <v-skeleton-loader v-if="bindReposBusy" type="card"></v-skeleton-loader>

  <div v-else>
      <v-tabs v-model="selectedRepo">
          <v-tab v-for="repository in bindRepos" :key="repository.id">{{ repository.repo }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="selectedRepo">
          <v-tab-item v-for="repository in bindRepos" :key="repository.id">
              <p v-if="bindRepos[selectedRepo].intro !== ''">代码存储库介绍：{{ bindRepos[selectedRepo].intro }}</p>
              <p v-else>这个代码存储库没有介绍哦</p>
              <v-row><v-col class="ma-1"><v-card raised class="pa-2"><branchView /></v-card></v-col></v-row>
              <v-row><v-col class="ma-1"><v-card raised class="pa-2"><issue_view /></v-card></v-col></v-row>
              <v-row><v-col class="ma-1"><v-card raised class="pa-2"><pr_view /></v-card></v-col></v-row>
          </v-tab-item>
      </v-tabs-items>
  </div>
</v-col>
</template>