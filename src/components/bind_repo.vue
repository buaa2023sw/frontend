<script>
export default {
  name: "bindGithubRepo",
  data() {
    return {
      gh_username: '',
      gh_reponame: '',
      git_url: '',
      seperate: true,
      bindingInProgress: false
    }
  },
  inject: {
    proj: { default: null }
  },
  methods: {
    bind() {
      console.log(
          'I will bind ' +
          this.gh_username + '/' +
          this.gh_reponame + 'to' +
          this.proj.id + ',' + this.proj.name)
      this.bindingInProgress = true
      this.axios.post('api/userBindRepo',
          {
            userId: 1,
            projectId: 1,
            repoRemotePath: this.gh_username + '/' + this.gh_reponame
          }
      ).then((res) => { console.log(res); this.bindingInProgress = false; })
          .catch((err) => { console.log(err); this.bindingInProgress = false; })
    },
  }
}
</script>

<template>
    <v-form v-if="seperate">
        <v-row>
        <v-col cols="5">
            <v-text-field v-model="gh_username" label="GitHub Username"></v-text-field>
        </v-col>
        <v-col cols="1">
            <v-btn fab x-small @click="seperate = !seperate">/</v-btn>
        </v-col>
        <v-col cols="6">
            <v-text-field v-model="gh_reponame" label="GitHub Reponame"></v-text-field>
        </v-col>
        </v-row>
        <v-btn @click="bind()">
            Bind 
            {{ gh_username === '' ? '?' : gh_username }} / 
            {{ gh_reponame === '' ? '?' : gh_reponame }}
            to {{ proj.name }}
        </v-btn>
        <span v-if="bindingInProgress">binding, please wait.</span>
    </v-form>
    <v-form v-else>
        <v-row>
            <v-col cols="3">
                <v-btn block @click="seperate = !seperate">https://</v-btn>
            </v-col>
        
            <v-col cols="9">
                <v-text-field v-model="git_url" label="git url"></v-text-field>
            </v-col>
        </v-row>
        <v-btn @click="bind()">
            Bind 
            {{ git_url === '' ? 'github.com/?/?' : git_url }}
            to {{ proj.name }}
        </v-btn>
        <span v-if="bindingInProgress">binding, please wait.</span>
    </v-form>
</template>
