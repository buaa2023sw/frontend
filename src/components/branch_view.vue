<script>
import {computed} from "vue";
import commit_view from "@/components/commit_view.vue";
export default {
  name: "branchView",
  components: {
    commit_view
  },
  data() {
    return {
      selectedBranchIndex: 0,
      branches: [
        { id: 1, name: 'branch1 of this repo' },
        { id: 2, name: 'branch2 of this repo' },
      ]
    }
  },
  inject: {
    proj: { default: null },
    selectedRepo: { default: null }
  },
  provide() {
    return {
      selectedBranch: computed(() => this.branches[this.selectedBranchIndex])
    }
  }
}
</script>

<template>
<div>
  <p>I am branch view, I am aware that my proj = {{ proj }}, and that my selected repo = {{ selectedRepo }}</p>
<v-row>
  <v-col cols="3">
    <h2>Branches</h2>
    <p>{{ selectedBranchIndex }}</p>
    <v-list>
      <v-list-item-group v-model="selectedBranchIndex">
        <v-list-item v-for="branch in branches" :key="branch.id">
          {{ branch.name }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-col>

  <v-divider vertical></v-divider>

  <v-col cols="9">
    <commit_view/>
  </v-col>
</v-row>
</div>
</template>



<style scoped>

</style>