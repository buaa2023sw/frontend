<script>

export default {
    name: "bindedGithubRepos",
    data() {
        return {
          bondedRepos: [
            {
              id: 1,
              user: "opencv",
              repo: "opencv",
              intro: "opencv introduction. A Bonded repo of #" + this.proj.id + " called " + this.proj.name
            }, {
              id: 2,
              user: "buaa2023sw",
              repo: "doc",
              intro: "doc introduction. A Bonded repo of #" + this.proj.id + " called " + this.proj.name
            }
          ]
        }
    },
    inject: {
      proj: { default: null }
    },
    methods: {
    }
}

</script>

<template>
    <v-expansion-panels>
        <v-expansion-panel
            v-for="repo in bondedRepos"
            :key="repo.id"
        >
          <v-expansion-panel-header>
              {{ repo.user }} / {{ repo.repo }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
              <v-divider></v-divider>
              {{ repo.intro }}<br/>
              <v-divider></v-divider>
              <v-btn>GitHub</v-btn>
              <v-btn>Unbind</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>