<script>

export default {
    name: "bindedGithubRepos",
    inject: {
        proj: { default: null },
        bindRepos: {default: null},
        bindReposBusy: {default: null}
    },
    data() {
        return {
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
          //     intro: "doc introduction. A Bonded repo of #" + this.proj.id + " called " + this.proj.name
          //   }
          // ]
        }
    },
    methods: {
    }
}

</script>

<template>
    <div>
        <h2>已绑定的代码存储库</h2>
        <p v-if="!bindReposBusy">项目“{{ proj.name }}”已绑定 {{ bindRepos.length }} 个代码存储库。</p>
        <p v-else>正在加载项目“{{ proj.name }}”已绑定的代码存储库列表...</p>
        <v-divider></v-divider>
        <br/>
        <v-skeleton-loader v-if="bindReposBusy"
                type="list-item, list-item, list-item"
        ></v-skeleton-loader>
        <v-expansion-panels v-else-if="bindRepos.length > 0">
            <v-expansion-panel
                    v-for="repo in bindRepos"
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
        <v-card v-else>
            <v-card-title>
                <v-icon>mdi-github</v-icon>
                <span class="headline ml-3">还没有绑定代码存储库</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-subtitle>
                <span class="subtitle-1 ml-4">唔，快去绑定一个代码存储库开始记录你的工作吧！</span>
            </v-card-subtitle>
        </v-card>
    </div>
</template>