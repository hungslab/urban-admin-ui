<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      default: '350px'
    }
  },
  data() {
    return {
      chart: null
    }
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

      this.chart.setOption({
        title: {
    text: '品牌分类占比',
  },
        tooltip: {
          trigger: 'item',
          textStyle:{
            color:'#ffffff'
          },
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['花花公子', '特步', '阿迪王', '金耐克', '匕匹狼']
        },
        series: [
          {
            name: '品牌分类占比',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '50%'],
            data: [
              { value: 320, name: '花花公子' },
              { value: 240, name: '特步' },
              { value: 149, name: '阿迪王' },
              { value: 100, name: '金耐克' },
              { value: 59, name: '匕匹狼' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 1500
          }
        ]
      })
    }
  }
}
</script>
