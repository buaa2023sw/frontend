<template>
  <div id="burnup-chart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartData: {
        workloads: [], // 工作量
        expectedDates: [], // 预期完成日期
        actualDates: [], // 实际完成日期
        dates: [], // 日期
      },
    };
  },
  mounted() {
    // 模拟数据
    this.chartData.workloads = [20, 40, 60, 80, 100];
    this.chartData.expectedDates = ['2023-04-10', '2023-04-20', '2023-04-30', '2023-05-10', '2023-05-20'];
    this.chartData.actualDates = ['2023-04-07', '2023-04-22', '2023-04-27', '2023-05-08', '2023-05-18'];

    // 生成日期数据
    for (let i = 0; i < this.chartData.expectedDates.length; i++) {
      this.chartData.dates.push(this.chartData.expectedDates[i]);
    }

    // 绘制燃尽图
    const chart = echarts.init(document.getElementById('burnup-chart'));
    chart.setOption({
      title: {
        text: '燃尽图',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['工作量', '预期完成', '实际完成'],
      },
      xAxis: {
        type: 'category',
        data: this.chartData.dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '工作量',
          type: 'line',
          data: this.chartData.workloads,
        },
        {
          name: '预期完成',
          type: 'line',
          data: this.chartData.expectedDates.map((date) => {
            return this.getDaysFromStartDate(this.chartData.expectedDates[0], date);
          }),
        },
        {
          name: '实际完成',
          type: 'line',
          data: this.chartData.actualDates.map((date) => {
            return this.getDaysFromStartDate(this.chartData.expectedDates[0], date);
          }),
        },
      ],
    });
  },
  methods: {
    // 获取从开始日期到当前日期的天数
    getDaysFromStartDate(startDate, currentDate) {
      const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
      const start = new Date(startDate);
      const current = new Date(currentDate);
      return Math.round(Math.abs((start - current) / oneDay));
    },
  },
};
</script>
