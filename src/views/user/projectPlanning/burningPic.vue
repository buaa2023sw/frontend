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
    for (let i=0;i<this.$route.query.workloads.length;i++) {
      this.chartData.workloads.push(parseInt(this.$route.query.workloads[i]));
    }
    console.log(this.chartData.workloads)
    this.chartData.expectedDates = ['2023-04-10', '2023-04-20', '2023-04-30', '2023-05-10', '2023-05-20'];//预期的完成时间
    this.chartData.actualDates = ['2023-04-13', '2023-04-21', '2023-04-28', '2023-05-08', ''];

    let sum = 0;
    for (let i = 0; i < this.chartData.workloads.length; i++) {
      sum += this.chartData.workloads[i];
    }
    console.log(sum);
    
    let expectedDatesValue = this.chartData.expectedDates.map((item)=>{
        return new Date(item).valueOf();
     })

    let notSortDatesValue = [];
    for (let i=0;i < expectedDatesValue.length;i++) {
      notSortDatesValue.push(expectedDatesValue[i]);
    }

    expectedDatesValue.sort()[0];

    var newArr = new Set(expectedDatesValue);
    var timeArr = Array.from(newArr);

    let resWorkloadsE = []
    let res = sum;
    for (let i=0;i<timeArr.length;i++) {
      for (let j=0;j<notSortDatesValue.length;j++) {
          if (notSortDatesValue[j] == timeArr[i]) {
          res -= this.chartData.workloads[j]
          }
      }
      resWorkloadsE.push([timeArr[i], res]);
    }

    for (let i=0;i<this.chartData.actualDates.length;i++) {
      if (this.chartData.actualDates[i] == '') {
        this.chartData.actualDates.splice(i, 1);
      }
    }
    
    let actualDatesValue = this.chartData.actualDates.map((item)=>{
        return new Date(item).valueOf();
     })

    let notSortADatesValue = [];
    for (let i=0;i < actualDatesValue.length;i++) {
      notSortADatesValue.push(actualDatesValue[i]);
    }

    actualDatesValue.sort()[0];

    var newArr1= new Set(actualDatesValue);
    var timeArr1 = Array.from(newArr1);

    let resWorkloadsA = []
    // console.log(notSortDatesValue);
    // console.log(timeArr);
    res = sum;
    for (let i=0;i<timeArr1.length;i++) {
      for (let j=0;j<notSortADatesValue.length;j++) {
          if (notSortADatesValue[j] == timeArr1[i]) {
            res -= this.chartData.workloads[j]
          }
      }
      // resWorkloadsA[timeArr1[i]] = res;
      resWorkloadsA.push([timeArr1[i], res]);
    }


    let dateMin = (expectedDatesValue[0] < actualDatesValue[0]) ?  expectedDatesValue[0] : actualDatesValue[0];
    dateMin  = dateMin - 24 * 60 * 60 * 1000;
    resWorkloadsA.push([dateMin, sum]);
    resWorkloadsE.push([dateMin, sum]);
    console.log(resWorkloadsA);
    console.log(resWorkloadsE);

    function sortByField(x, y) {
      return x[0] - y[0];
    }
    resWorkloadsA.sort(sortByField);
    resWorkloadsE.sort(sortByField);

    // 绘制燃尽图
    const chart = echarts.init(document.getElementById('burnup-chart'));
    chart.setOption({
      title: {
        text: '燃尽图',
      },
      legend: {
        data: ['预期中的剩余工作量', '实际的剩余工作量']
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
                console.log(params[0]);
                return params[0]['seriesName'] + ":" + params[0]['value'][1];
        }
      },
      xAxis: {
                type: 'value',
                min: dateMin,
                axisLabel: {
                    color: '#333', // 坐标轴文字颜色
                    formatter: function (param) {
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
          name: '预期中的剩余工作量',
          type: 'line',
          data: resWorkloadsE,
        },
        {
          name: '实际的剩余工作量',
          type: 'line',
          data: resWorkloadsA,
        }
        // {
        //   name: '剩余工作量1',
        //   type: 'line',
        //   data: resWorkloadsA,
        // },
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
