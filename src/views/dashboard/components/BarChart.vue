<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 1500

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    title:{
      type:String,
      default:'aa'
    },
    chartData: {
      type: Object,
      required: true
    },
    yearMonth:{
      type:Array,
      required:true
    }
    
  },
  data() {
    return {
      chart: null,
      month:[]
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        console.log(val);
        // this.setOptions(val)
        this.initChart()
      }
    },
    yearMonth: {
      deep: true,
      handler(val) {
        this.month = val
        this.initChart()
      }
    }
  },
  created(){
    this.getLastYearMonthArray()
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log(11111111111);
      this.chart.setOption({
      title: {
    text: this.chartData.expectedData,
  },
        tooltip: {
          trigger: 'axis',
          textStyle:{
            color:'#ffffff'
          },
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 60,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data:this.month,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [
          {
          name: this.chartData.expectedData,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.chartData.actualData,
          animationDuration,
          itemStyle: {
        normal: {
          color: function (params) {
            let colorList = [
              ['#FA897B', '#FFDD94'],
              ['#D0E6A5', '#FFDD94'],
              ['#4675C0', '#B8BFD6'],
              ['#86E3CE', '#CCABD8'],
              ['#64A4D6', '#C782C2'],
              ['#bdc2e8', '#e6dee9'],
              ['#FFA876', '#FF5B00'],
              ['#FA897B', '#FFDD94'],
              ['#D0E6A5', '#FFDD94'],
              ['#4675C0', '#B8BFD6'],
              ['#86E3CE', '#CCABD8'],
              ['#64A4D6', '#C782C2'],
            ];
            let colorItem = colorList[params.dataIndex];
            return new echarts.graphic.LinearGradient(0,0,0,1, //y->y2
              [
                {
                  offset: 0,
                  color: colorItem[0]
                },
                {
                  offset: 1,
                  color: colorItem[1]
                }
              ],
              false
            );
          }
        }
      }
          
        }
      ]
      })
    },
    getLastYearMonthArray(){
        var result = [];
        var d = new Date(); 
        var year = d.getFullYear(); 
        d.setMonth(d.getMonth() + 1, 1); 
        for (var i = 0; i < 12; i++) {
          //开始循环
          d.setMonth(d.getMonth() - 1); 
          var m = d.getMonth() + 1; 
          m = m < 10 ? "0" + m : m;
          result.push(d.getFullYear() + "-" + m); 
        }
        this.month = result.reverse(); 
      }

  }
}
</script>
