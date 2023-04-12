
<script>
export default {
  name: "pr_view",
  data() {
    return {
      prs: [
        {
          id: 1,
          author: 'TrickEye',
          title: 'PR title1',
          date: '20230403',
          fromBranchId: 2,
          toBranchId: 1,
          isOpen: true
        }, {
          id: 2,
          author: 'TrickEyeee',
          title: 'PR title2',
          date: '20230402',
          fromBranchId: 3,
          toBranchId: 1,
          isOpen: true
        }
      ]
    }
  }
}
</script>

<template>
<div>
  <h2>Pull Requests</h2>
  <p>This is pr view</p>

  <v-row>
    <v-col>
      <v-simple-table dense>
        <tbody>
        <tr v-for="pr in prs" :key="pr.id">
          <td>{{pr.isOpen ? 'Open' : 'Closed'}}</td>
          <td>{{pr.author}}</td>
          <td>{{pr.title}}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</div>
</template>


<style scoped>

</style>