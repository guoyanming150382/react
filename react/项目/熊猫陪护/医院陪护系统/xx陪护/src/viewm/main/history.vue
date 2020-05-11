<template>
  <div>
    <v-chart  :forceFit="false" :width="width" :padding="padding"
     :height="height" :data="data" :scale="scale">
      <v-tooltip />
      <v-axis :label="axisFormat"/>
      <v-line position="day*dayProfit" />
      <v-point position="day*dayProfit" shape="circle" />
    </v-chart>
  </div>
</template>

<script>
const data = [
  { day: '19910909', totalProfit: 3 },
  { day: '19920909', totalProfit: 4 },
  { day: '19930909', totalProfit: 3.5 },
  { day: '19940909', totalProfit: 5 },
  { day: '19950909', totalProfit: 4.9 },
  { day: '19960909', totalProfit: 6 },
  { day: '19970909', totalProfit: 7 },
  { day: '19980909', totalProfit: 9 },
  { day: '19990909', totalProfit: 13 },
];

const scale = [{
  dataKey: 'totalProfit',
  min: 0,
},{
  dataKey: 'day',
  min: 0,
  max: 1,
}];
import {getProfitList } from '@/api/mobile'
export default {
  data() {
    return {
      padding: [ 20, 30, 50, 30],
      data:[],
      scale,
      height: 200,
      width:document.body.clientWidth,
      axisFormat: {
        offset: -10,
        formatter: (val) => {
          return '213';
        }
      },
    };
  },
  created() {
    this.init()
  },
  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    }else {
      this.timer = setInterval(() => {
        this.init()
      }, 3600000)
    } 
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods:{
    init(){
      getProfitList().then(response => {
        console.log('response', response)
        this.data = response.result;
      })
    }
  }
};
</script>
