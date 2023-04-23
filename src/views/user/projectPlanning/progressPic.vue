<template>
    <div ref="chart" style="width: 600px;height:400px;"></div>
</template>
  
<script>
import * as echarts from 'echarts'

export default {
    name: 'TaskProgressChart',
    props: {
      tasks: {
        type: Array,
        required: true
      }
    },
    mounted() {
      this.draw();
    },
    methods: {
      draw() {
        var chart = echarts.init(this.$refs.chart);

        let projectItem = this.$route.query.projectItem; //每个任务的名称
        projectItemStart = this.$route.query.projectItemStart;//每个任务的启动时间
        projectItemEnd = this.$route.query.projectItemEnd; //每个任务的结束时间

        let projectItemStartValue = projectItemStart.map((item)=>{
        return new Date(item).valueOf()
        })

        let projectItemDuringValue = projectItemEnd.map((item,i)=>{
        return new Date(item).valueOf()-projectItemStartValue[i]
        })
        let dateMin = projectItemStartValue.sort()[0];
        var option = {
            title: {   
                text: '任务进度显示图',
                },
            tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var tar = params[1];
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value/(1000*60*60*24)+'天';
            }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '30%',
                containLabel: true
                },
            yAxis: {
                type: 'category',
                splitLine: {
                show: false
                },
            data: projectItem
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
                        
            series: [{
            name: 'Placeholder',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
            },
            emphasis: {
            itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
            }
            },
            data: projectItemStartValue
            },
            {
            name: '周期',
            type: 'bar',
            stack: 'Total',
            data: projectItemDuringValue
            }
            ]
            };
        // 使用刚指定的配置项和数据显示图表。
        chart.setOption(option);
      },
    }
  }
  </script>
  