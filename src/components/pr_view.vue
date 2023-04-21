
<script>
import axios from "axios";

export default {
  name: "pr_view",
  data() {
      this.updatePR()
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
  }, methods: {
      updatePR() {
          axios.post('/api/develop/getPrList', {
              userId: this.user.id,
              projectId: this.proj.id,
              repoId: this.selectedRepo.id
          }).then((res) => {
              if (res.data.errcode === 0) {
                  console.log(res.data.data)
                  let prs = res.data.data.map((cur, index, arr) => {
                      return {
                          id: cur.prId,
                          author: cur.prIssuer,
                          title: cur.prTitle,
                          date: cur.prTime,
                          isOpen: cur.isOpen,
                          ghLink: cur.ghLink,
                          fromBranchName: cur.fromBranchName,
                          toBranchName: cur.toBranchName
                      }
                  })
                  this.prs = prs
              } else {
                  console.log('get pr failure with not 0 err code + {' + res.data.errcode + ')' + res.data.message)
              }
          }).catch((err) => {
              console.log('get pr failure with err: ' + err)
          })
      }
  }, inject: {
        user: {default: null},
        proj: {default: null},
        selectedRepo: {default: null}
  }
}
</script>

<template>
<div>
  <h2>和并请求</h2>
<!--  <p>This is pr view</p>-->

  <v-row v-if="this.prs.length > 0">
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
  <v-row v-else>
  <v-col>
    <p>和并请求似乎空空如也？现在就去GitHub上发一个吧！</p>
  </v-col>
  </v-row>
</div>
</template>


<style scoped>

</style>