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
<v-col cols="12">
  <h1>代码存储库 - {{ bindRepos[selectedRepo].user }} / {{ bindRepos[selectedRepo].repo}}</h1>
  <p>选择一个代码存储库： = {{ selectedRepo }}</p>
  <v-tabs v-model="selectedRepo">
    <v-tab v-for="repository in bindRepos" :key="repository.id">{{ repository.repo }}</v-tab>
  </v-tabs>
  <v-tabs-items v-model="selectedRepo">
    <v-tab-item v-for="repository in bindRepos" :key="repository.id">
      <p>代码存储库介绍：{{ bindRepos[selectedRepo].intro }}</p>
      <v-row><v-col><branchView /></v-col></v-row>
      <v-row><v-col><issue_view /></v-col></v-row>
      <v-row><v-col><pr_view /></v-col></v-row>
    </v-tab-item>
  </v-tabs-items>
</v-col>
</template>