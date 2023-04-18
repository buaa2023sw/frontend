<template>
    <div>
      <h2>任务燃尽图</h2>
      <div ref="chart" style="height: 500px;"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts'
  
  export default {
    data() {
      return {
        tasks: [
          {
            name: '任务A',
            estimateTime: new Date('2022-05-01'),
            actualTime: new Date('2022-04-15'),
            contribution: 20
          },
          {
            name: '任务B',
            estimateTime: new Date('2022-06-01'),
            actualTime: new Date('2022-06-15'),
            contribution: 30
          },
          {
            name: '任务C',
            estimateTime: new Date('2022-07-01'),
            actualTime: new Date('2022-07-05'),
            contribution: 40
          },
          {
            name: '任务D',
            estimateTime: new Date('2022-08-01'),
            actualTime: new Date('2022-08-15'),
            contribution: 50
          }
        ]
      }
    },
    mounted() {
      this.drawChart()
    },
    methods: {
      drawChart() {
        const chart = echarts.init(this.$refs.chart)
  
        const data = this.tasks.map((task) => {
          const estimateTime = task.estimateTime.getTime()
          const actualTime = task.actualTime.getTime()
          const contribution = task.contribution
          const diff = actualTime - estimateTime
  
          return [estimateTime, actualTime, contribution, diff]
        })
  
        const option = {
          title: {
            text: '任务燃尽图'
          },
          tooltip: {
            formatter: (params) => {
              const [estimateTime, actualTime, contribution, diff] = params.value
              const dateFmt = (timestamp) => new Date(timestamp).toLocaleDateString()
              return `
                任务名：${params.seriesName}<br/>
                预计完成时间：${dateFmt(estimateTime)}<br/>
                实际完成时间：${dateFmt(actualTime)}<br/>
                贡献程度：${contribution}%<br/>
                时间差：${diff / (24 * 3600 * 1000)}天
              `
            }
          },
          xAxis: {
            type: 'time',
            name: '预计完成时间'
          },
          yAxis: {
            type: 'time',
            name: '实际完成时间'
          },
          series: [
            {
              name: '任务',
              type: 'scatter',
              data: data,
              symbolSize: (data) => data[2] * 2, // 根据贡献程度设置符号大小
              itemStyle: {
                color: (data) => data[3] > 0 ? '#f00' : '#0f0' // 根据时间差设置符号颜色
              }
            }
          ]
        }
  
        chart.setOption(option)
      }
    }
  }
  </script>
  