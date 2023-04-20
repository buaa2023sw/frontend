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
        resWorkloads: []
      },
    };
  },
  mounted() {
    // 模拟数据
    this.chartData.workloads = [25, 15, 30, 20, 10];
    this.chartData.expectedDates = ['2023-04-10', '2023-04-20', '2023-04-30', '2023-05-10', '2023-05-20'];
    this.chartData.actualDates = ['2023-04-13', '2023-04-21', '2023-04-28', '2023-05-08', '2023-05-22'];

    let dateMin = this.chartData.expectedDates.sort()[0];

    // 生成日期数据
    for (let i = 0; i < this.chartData.expectedDates.length; i++) {
      this.chartData.dates.push(this.chartData.expectedDates[i]);
    }

    for (let i = 0; i < this.chartData.expectedDates.length; i++) {
      this.chartData.dates.push(this.chartData.actualDates[i]);
    }

    let sum = 0;

    for (let i = 0; i < this.chartData.workloads.length; i++) {
      sum += this.chartData.workloads[i];
    }

    for (let i = 0; i < this.chartData.workloads.length; i++) {
      this.chartData.resWorkloads.push(sum);
      sum -= this.chartData.workloads[i];
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
                type: 'value',
                min: dateMin,
                axisLabel: {
                    color: '#333', // 坐标轴文字颜色
                    formatter: function (param) {
                    console.log(param)
                    let date = new Date(param);
                    let dateLabel = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                    return dateLabel;
                }
                }
            },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '剩余工作量',
          type: 'line',
          data: this.chartData.resWorkloads,
        },
        // {
        //   name: '预期完成',
        //   type: 'line',
        //   data: this.chartData.expectedDates.map((date) => {
        //     return this.getDaysFromStartDate(this.chartData.expectedDates[0], date);
        //   }),
        // },
        // {
        //   name: '实际完成',
        //   type: 'line',
        //   data: this.chartData.actualDates.map((date) => {
        //     return this.getDaysFromStartDate(this.chartData.expectedDates[0], date);
        //   }),
        // },
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
