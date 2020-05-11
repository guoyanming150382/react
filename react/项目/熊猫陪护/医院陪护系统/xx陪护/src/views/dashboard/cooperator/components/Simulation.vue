<template>
  <div :class="className" :style="{height:height,width:width}" >
    {{name}}
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '360px'
    },
    height: {
      type: String,
      default: '200px'
    },
    name:{
      type: String,
      default: ''
    },
    total:{
      type:Number,
      default: 0
    },
    use:{
      type:Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
          show:false
        },
        series: [
          {
            name: '',
            type: 'gauge',
            min: 0,
            max: 100,
            radius: '85%',
            splitNumber: 5,//分隔段数
            detail: { formatter: '{value}%'},
            data: [{ name:  this.use+ '/'+this.total,value: (this.use *100/this.total).toFixed(2) }],
            axisLine: {
                lineStyle: { color: [[0.2, 'green'], [0.8, 'gray'], [1, 'gray']] }
            }
          }
        ]
      })
    }
  }
}
</script>
