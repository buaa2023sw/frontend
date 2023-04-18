<template>
<v-main>
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
            msg: null
        }
    },
    methods: {
        btnclick() {
            axios.post("/api/plan/watchAllProject", {userId: 2})
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