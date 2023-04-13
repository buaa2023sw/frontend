<template>
  <div class="height-100pc mx-3 goods-home">
    <v-row justify="center" class="my-3">
      <template v-for="(item, itemIndex) in indicators">
        <v-col :key="itemIndex" cols="12" md="3">
          <v-hover v-slot="{ hover }">
            <v-card
                class="item-card"
                :elevation="hover ? 12 : 2"
                :class="{ 'on-hover': hover }"
            >
              <v-row class="mx-3 ">
                <v-col md="6" class="align-center">
                  <v-icon :color="item.color" size="100">{{ item.icon }}</v-icon>
                </v-col>
                <v-col md="6" class="align-center justify-center flex-column ">
                  <div class="text-h5 text-center">{{ item.title }}</div>
                  <div class="text-h7 text-center">{{ item.text }}</div>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
    <v-row>
      <template>
        <div>
          <canvas ref="pieChart"></canvas>
        </div>
      </template>
    </v-row>
    <!-- 提示语，之后移至商家暂未通过审核处
    <div>
      <template>
        <v-footer padless color="blue">
          <v-col class="text-center white--text">
            欢迎{{business_name}}，您可以通过左侧导航栏查看更多不同页面。
          </v-col>
        </v-footer>
      </template>
    </div>
    -->
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
var DEFAULT_PANELS = [
  {
    // icon: "mdi-account",
    icon: "mdi-account-multiple",
    color: "blue",
    title: "用户总数",
    text: "8（人）",
  },
  {
    icon: "mdi-book-edit-outline",
    color: "cyan",
    title: "项目总数",
    text: "1100（个）",
  },
];

export default {
  components: {

  },
  data ()  {
    return {
      indicators: DEFAULT_PANELS,
      chartData: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      }
    }
  },
  created() {
    this.getUserNum();
    this.getProjectNum();
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.chart = new Chart(this.$refs.chart, {
      type: 'pie',
      data: this.data
    });
  },
  watch: {
    data(newData) {
      this.chart.data = newData;
      this.chart.update();
    }
  },

  methods: {
    getUserNum() {
      this.indicators[0].text = 1 + "（人）"
    },
    getProjectNum() {
      this.indicators[1].text = 2 + "（个）"
    },
    updateData() {
      this.chartData.datasets[0].data = [1, 2, 3, 4, 5];
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
</style>
