<script>
export default {
  name: "commit_view",
  data() {
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
  inject: {
    proj: {default: null},
    selectedRepo: {default: null},
    selectedBranch: {default: null}
  }
}
</script>

<template>
<div>
<h2>Commit History on Branch: {{ selectedBranch.name }}</h2>
  <p>I am commit view, I am aware that:</p>
  <p>my proj = {{proj}}</p>
  <p>my selected repo = {{selectedRepo}}</p>
  <p>my selected branch = {{selectedBranch}}</p>

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
      <tr v-for="commit in commitHistory" :key="commit.id">
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