<script>
export default {
  name: "issue_view",
  data() {
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
      filteredIssues: [
        {
          id: 1,
          issuer: 'TrickEye',
          title: 'issue title1',
          isOpen: true
        }
      ],
      statusFilter: 0,
      statuses: ['Open', 'All', 'Closed']
    }
  },
  inject: {
    proj: {default: null},
    selectedRepo: {default: null}
  },
  methods: {
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
  <h2>Issues</h2>
  <p>this is issue view.</p>

  <v-row>
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