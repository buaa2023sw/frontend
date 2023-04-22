<script>
import axios from 'axios'

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
      user: {default: null},
    proj: { default: null }
  },
  methods: {
    bindSplit() {
      this.bindingInProgress = true
      axios.post('/api/userBindRepo',
          {
            userId: this.user.id,
            projectId: this.proj.id,
            repoRemotePath: this.gh_username + '/' + this.gh_reponame
          }
      )
          .then((res) => { this.bindingInProgress = false; })
          .catch((err) => { alert('哦不，好像绑定失败了！'); this.bindingInProgress = false; })
    },
      bindWhole() {
          this.bindingInProgress = true
          axios.post('/api/userBindRepo',
              {
                  userId: this.user.id,
                  projectId: this.proj.id,
                  repoRemotePath: this.git_url.replace(/https:\/\/github.com\//, '')
              }
          )
              .then((res) => {this.bindingInProgress = false; })
              .catch((err) => { alert('哦不，好像绑定失败了！'); this.bindingInProgress = false; })
      }
  }, watch: {
    }
}
</script>

<template>
    <v-form v-if="seperate">
        <v-row>
        <v-col cols="5">
            <v-text-field v-model="gh_username" label="GitHub Username"></v-text-field>
        </v-col>
        <v-col cols="1" class="text-center my-3">
            <v-btn fab @click="seperate = !seperate">/</v-btn>
        </v-col>
        <v-col cols="6">
            <v-text-field v-model="gh_reponame" label="GitHub Reponame"></v-text-field>
        </v-col>
        </v-row>
        <v-btn @click="bindSplit()" :disabled="bindingInProgress || gh_reponame === '' || gh_username === ''">
            绑定
            {{ gh_username === '' ? '?' : gh_username }} / 
            {{ gh_reponame === '' ? '?' : gh_reponame }}
            到“{{ proj.name }}”
        </v-btn>
<!--        <span v-if="bindingInProgress">binding, please wait.</span>-->
    </v-form>
    <v-form v-else>
        <v-row>
            <v-col cols="3" class="text-center my-3">
                <v-btn block @click="seperate = !seperate">https://github.com/</v-btn>
            </v-col>
        
            <v-col cols="9">
                <v-text-field v-model="git_url" label="github url"></v-text-field>
            </v-col>
        </v-row>
        <v-btn @click="bindWhole()" :disabled="bindingInProgress || git_url === ''">
            绑定
            {{ git_url === '' ? 'github.com/?/?' : git_url.replace(/https:\/\/github.com\//, '') }}
            到“{{ proj.name }}”
        </v-btn>
<!--        <span v-if="bindingInProgress">binding, please wait.</span>-->
    </v-form>
</template>
