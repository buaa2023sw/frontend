<template>
  <div>
    <div ref="myChart" style="height: 300px"></div>
    <table v-if="chartData.length > 0">
      <thead>
      <tr>
        <th>名称</th>
        <th>数值</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in chartData" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.value }}</td>
      </tr>
      </tbody>
    </table>
    <div v-else>暂无数据</div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      chartData: []
    }
  },
  mounted() {
    // 计算饼状图数据并更新 chartData 数组
    let data = [
      {value: 335, name: '直接访问'},
      {value: 310, name: '邮件营销'},
      {value: 234, name: '联盟广告'},
      {value: 135, name: '视频广告'},
      {value: 1548, name: '搜索引擎'}
    ]
    this.chartData = data.map(item => ({
      name: item.name,
      value: item.value
    }))

    // 创建 ECharts 实例并绘制饼状图
    let myChart = echarts.init(this.$refs.myChart)
    console.log(myChart)
    myChart.setOption({
      title: {
        text: '饼状图示例',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    })
  }
}
</script>
