<template>
  <div class="bed-process">
    <div class="title">{{hospital}}
    <el-button type="text" v-if="flag=='department'" @click="init()">返回</el-button>
    </div>
    <div class="bed">
      <div v-for="(item,index) in items"  @click="depart(item)" :key="index">
        <span>{{item.hospitalName}}{{item.department}}({{item.bedInUse}}/{{item.totalBed}})</span>
        <el-progress :percentage="formatValue(item.bedInUse,item.totalBed)" :format="format"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { hospitalStat,departStat } from '@/api/stat'
export default {
  data() {
      return {
        hospital:"",
        flag:"hospital",
        items:[]
      };
  },
   created() {
    this.init()
  },
  methods:{
    init(){
      hospitalStat({}).then(response => {
        this.hospital = "床位概况("+response.result.inUseBed + "/" + response.result.totalBed+")"
        this.items = response.result.list;
        this.flag="hospital";
      })
    },
    depart(item){
      this.hospital = item.hospitalName+"("+item.bedInUse+"/"+item.totalBed+")"
      departStat({"hospitalId":item.hospitalId}).then(response => {
        console.log('bed', response)
        this.items = response.result.list;
        this.flag="department";
      })
    },
    formatValue(used,total) {
      if(used==0 || total==0){
        return 0;
      }else{
        return parseFloat((used * 100 / total).toFixed(1));
      }
    },
    format(percentage) {
        return percentage === 100 ? '满' : `${percentage}%`;
    }
    
  }

}
</script>
<style lang="scss" scoped>
.bed{
  margin: 0px 10px;
}
.title{
    height: 30px;
    line-height: 30px;
    margin: 0px 0px 10px 0px;
    vertical-align: middle;
    background-color: gainsboro;
    color: cornflowerblue;
    text-align: center;
}
</style>
