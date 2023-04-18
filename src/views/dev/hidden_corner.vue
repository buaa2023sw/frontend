<template>
<v-main>
    <v-textarea v-model="url" label="URL"></v-textarea>
    <v-textarea v-model="data" label="DATA"></v-textarea>
    <v-btn @click="btnclick()">test</v-btn>
    <div>{{ msg }}</div>
</v-main>
</template>

<script>
import axios from "axios";
export default {
    name: "hidden_corner", // 用来测试API的
    data() {
        return {
            msg: null,
            url: "/api/management/showUsers",
            data: "{\"managerId\": 1}"
        }
    },
    methods: {
        btnclick() {
            // axios.post("/api/plan/watchAllProject", {userId: 2})
            axios.post(this.url, JSON.parse(this.data))
            .then((res) => {
                console.log(res)
                this.msg = res.data
            })
            .catch((err) => {
                console.log(err); this.msg = err
            })
        }
    }
}
</script>

<style scoped>

</style>