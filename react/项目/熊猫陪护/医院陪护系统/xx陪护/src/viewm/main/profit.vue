<template>
  <v-chart :forceFit="false" :width="width" :background="background" :padding="padding"  :height="height" :data="data" :scale="scale">
      <v-coord type="polar" :startAngle="-202.5" :endAngle="22.5" :radius="0.75"></v-coord>
      <v-axis
        dataKey="value"
        :zIndex="2"
        :line="null"
        :label="axisLabel"
        :tickLine="null"
        :grid="null"
      ></v-axis>
      <v-axis dataKey="1" :show="false"></v-axis>
      <v-series
        gemo="point"
        position="value*1"
        shape="pointer"
        color="#1890FF"
        :active="false"
      ></v-series>
      <v-guide
        type="arc"
        :zIndex="1"
        :start="arcGuide2Start"
        :end="arcGuide2End"
        :vStyle="arcGuide2Style"
      ></v-guide>
      <v-guide
        type="html"
        :position="htmlGuidePosition"
        :html="htmlGuideHtml"
      ></v-guide>
    </v-chart>
</template>

<script>
import { registerShape } from 'viser-vue';


registerShape('point', 'pointer', {
  draw(cfg, container) {
    cfg.x=0
    cfg.y=0
    let point = cfg.points[0]; // 获取第一个标记点
    point ={x:0,y:0} //this.parsePoint(point);
    const center = this.parsePoint({ // 获取极坐标系下画布中心点
      x: 0,
      y: 0
    });
   
    return container.addShape('circle', {
      attrs: {
        x: 0,
        y: 0,
        r: 0,
        stroke: cfg.color,
        lineWidth: 0,
        fill: '#fff'
      }
    });
  }
});

const scale = [{
  dataKey: 'value',
  min: 0,
  max: 9,
  ticks: [2.25, 3.75, 5.25, 6.75],
  nice: false
}];

const data = [
  { value: 9 }
];

export default {
  props:{
    profit: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      padding: [ 0, 30, 0, 30],
      height: 240,
      width: document.body.clientWidth,
      background:{
        fill: '#00822e'
      },
      data: data,
      scale: scale,
      axisLabel: {
        offset: -10,
        formatter: (val) => {
          return '';
        },
        textStyle: {
          fontSize: 18,
          textAlign: 'center'
        }
      },
      arcGuide2Start: [0, 0.945],
      arcGuide2End: [data[0].value, 0.945],
      arcGuide2Style: {
        stroke: '#1890FF',
        lineWidth: 10,
      },
      
      htmlGuidePosition: ['50%', '60%'],
      htmlGuideHtml: "<div text-align: center;\">"+
          "<p style=\"font-size: 20px;color: #bcbcc7;margin: 0;\">今日收益(元)</p>"+
          "<p style=\"font-size: 18px;color: #FFF;margin-top: 15px;text-align: center;\">+"+this.profit+"</p>"+
        "</div>",
    };
  },
  created() {
    this.init()
  },
  methods:{
    init(){
      
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
