<script>
import { computed } from 'vue';
import bindGithubRepo from "../components/bind_repo.vue"
import bindedGithubRepos from "../components/repo_list.vue"
import repoView from "../components/repo_view.vue"

export default {
    name: "Dev",
    components: {
        bindGithubRepo,
        bindedGithubRepos,
        repoView,
    },
    data() {
        return {
            my_ghusername: 'trickeye',
            my_ghuseremail: '20373866@buaa.edu.cn',
        }
    },
    inject: {
        user: {default: null},
        selectedProj: {default: null}
    },
    provide() {
        return {
            proj: computed(() => this.selectedProj),
        }
    },
    methods: {
        modifyUser() {
            alert('not implemented!')
        },
        updateBindRepos () {

        }
    }
}
</script>

<template>
    <v-app>
        <v-container>
            <v-row>
                <p>injected info:</p>
            </v-row>
            <v-row>
                <p>user = {{user}}</p>
            </v-row>
            <v-row>
                <p>selectedProj = {{selectedProj}}</p>
            </v-row>
            <v-row>
                <h1>开发 - {{ selectedProj.name }}</h1>
            </v-row>

<!--            <v-row>-->
<!--                <v-banner>current GitHub user: {{ my_ghusername }} ( {{ my_ghuseremail }} )</v-banner>-->
<!--                <v-btn @click="modifyUser()">Modify</v-btn>-->
<!--            </v-row>-->

            <v-row>
                <v-col cols="6">
                    <h2>已绑定的代码存储库</h2>
                    <bindedGithubRepos />
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="6">
                    <h2>或者绑定一个新的代码存储库</h2>
                    <bindGithubRepo />
                </v-col>
            </v-row>

            <v-row>
                <repoView />
            </v-row>
        </v-container>
    </v-app>
</template>


<style scoped>

</style>