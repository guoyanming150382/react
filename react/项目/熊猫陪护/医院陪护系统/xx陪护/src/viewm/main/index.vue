<template>
  <div>
    <v-profit :profit="result.todayProfit" v-if="result.todayProfit>=0"></v-profit>
    <div class="profit-info">
      <table style="width:100%;">
        <tr>
          <td align="center">
            <p class="value">{{result.totalProfit}}</p>
            <p class="name">累计收益</p>
          </td>
          <td align="center">
            <p class="value">{{result.inUseBed}}</p>
            <p class="name">使用中床数</p>
          </td>
          <td align="center">
            <p class="value">{{result.totalBed}}</p>
            <p class="name">我的床数</p>
          </td>
        </tr>
      </table>
    </div>
    <div class="profit-history">
        <div class="title">近 5 日收益</div>
        <v-history></v-history>
    </div>
    <!-- <div class="profit-history">
        <v-bed></v-bed>
    </div> -->
  </div>
</template>

<script>
import VProfit from "./profit"
import VHistory from "./history"
import VBed from "./bed"
import { getStats } from '@/api/mobile'
export default {
  components: {VProfit,VHistory,VBed},
  data() {
    return {
      result:{}
    }
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
      }, 30000)
    } 
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods:{
    init(){
       getStats().then(response => {
          this.result = response.result;
          this.todayProfit = response.result.todayProfit;
       })
    }
  }
}
</script>
<style lang="scss" scoped>
.profit-info{
  width: 100%;
  display: flex;
  padding: 10px 10px;
  margin-top: -10px;
  background-color: #00822e;
}
.profit-item{
  flex: 1
}
p{
  margin: 0px;
}
.title{
    height: 30px;
    line-height: 30px;
    margin: 10px 0px 10px 0px;
    vertical-align: middle;
    background-color: gainsboro;
    color: cornflowerblue;
    text-align: center;
}
.name{
  color:#bcbcc7;
  font-size:14px;
}
.value{
  color:#FFF;
  font-size:18px;
}
</style>
