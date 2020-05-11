<template>
 <div>
  <el-row>
    <el-col :span="24" style="padding:10px;background-color: #eff1f4;">
      <img src="@/assets/images/new_logo.png" width="100%"><img>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24" style="padding:10px;background-color: #f7f6f4;">
       <div class="block">
           <el-date-picker style="width: 130px;"
            v-model="beginTime"
            type="date"
            size="mini"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="开始日期">
          </el-date-picker>
          &nbsp;-&nbsp;
          <el-date-picker style="width: 130px;"
            v-model="endTime"
            type="date"
            size="mini"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="结束日期">
          </el-date-picker>
          <el-button type="text" icon="el-icon-search" @click="init(1)">搜索</el-button>
      </div>
    </el-col>
    <el-table
    :data="tableData"
    style="width: 100%" size="small">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" >
          <el-form-item label="医  院：">
            <span>{{ props.row.hospital }}</span>
          </el-form-item>
          <el-form-item label="科 室：">
            <span>{{ props.row.depart }}</span>
          </el-form-item>
          <el-form-item label="收 益：">
            <span>{{ props.row.amount }} 元</span>
          </el-form-item>
          <el-form-item label="时 间：">
            <span>{{ props.row.createTime }}</span>
          </el-form-item>
          <!-- <el-form-item label="描 述：">
            <span>暂无</span> 
          </el-form-item> -->
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
    <el-table-column label="收益时间" prop="createTime" align="center"></el-table-column>
    <el-table-column label="收益金额" prop="amount" width="80" align="center" :formatter="formatAmount" ></el-table-column>
  </el-table>
  <el-pagination
    :background="true"
    v-show="total>0"
    :total="total"
    :current-page="param.pageNum"
    :page-size="10"
    :pager-count="3"
    @current-change="init"
    :small="true">
  </el-pagination>
  </el-row>
</div>
</template>
<script>
import { myProfitList } from '@/api/mobile'
export default {
  data() {
    return {
      beginTime:"",
      endTime:"",
      param:{
        openTimeRange:[],
        pageNum:1,
        pageSize:10
      },
      tableData: [],
      total:0
    }
  },
  created() {
    this.init(1)
  },
  mounted() {
    console.log('profit.vue mounted')
  },
  methods:{
    init(currentPage){
      console.log("currentPage",currentPage)
      this.param.pageNum = currentPage;
      this.param.openTimeRange = [];
      if (this.beginTime==null || this.beginTime=='') {
        this.param.openTimeRange[0] = this.getDateStr(-2) + " 00:00:00";
      }else{
        this.param.openTimeRange[0] = this.beginTime + " 00:00:00";
      }
      if (this.endTime==null || this.endTime=='') {
        this.param.openTimeRange[1] = this.getDateStr(0) + " 23:59:58";
      }else{
        this.param.openTimeRange[1] = this.endTime + " 23:59:58";
      }
      myProfitList(this.param).then(response => {
        console.log('response', response)
        this.tableData = response.result.list;
        this.total = response.result.total;
      }).catch(err => {
        console.log('err', err)
      })
    },
    
    formatAmount(row, column, value){
        return "+"+value
    },
    getDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        if(m<10) m="0"+m
        var d = dd.getDate();
        return y+"-"+m+"-"+d;
    }
  }
}
</script>
<style lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-form-item {
    margin-bottom: 0px;
}
</style>
