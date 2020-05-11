<template>
<div>
  <el-row>
    <el-col :span="24" style="padding:10px;background-color: #eff1f4;">
      <img src="@/assets/images/new_logo.png" width="100%"><img>
    </el-col>
  </el-row>
  <el-table
    :data="tableData"
    style="width: 100%" size="small">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" >
          <el-form-item label="编 号：">
            <span>{{ props.row.bedCode }}</span>
          </el-form-item>
          <el-form-item label="医 院：">
            <span>{{ props.row.hospital }}</span>
          </el-form-item>
          <el-form-item label="科 室：">
            <span>{{ props.row.department }}</span>
          </el-form-item>
          <el-form-item label="状 态：">
            <span> {{ props.row.enableFlag=='Y'?'启用':'停用' }}</span>
          </el-form-item>
          <el-form-item label="位 置：">
            <span>{{ props.row.location }}</span>
          </el-form-item>
          <!-- <el-form-item label="描 述：">
            <span>暂无</span> 
          </el-form-item> -->
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="序号" type="index" width="44" align="center"></el-table-column>
    <el-table-column label="床号" prop="bedCode"  align="center">
      <template slot-scope="scope">
        <svg-icon v-if="scope.row.enableFlag == 'Y'" icon-class="bed-green" />
        <svg-icon v-else icon-class="bed-red" />
         {{ scope.row.bedCode }}
      </template>
      
    </el-table-column>
    <el-table-column label="所属医院" prop="hospital" align="center"></el-table-column>
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
</div>
</template>



<script>
  import { myBedList } from '@/api/mobile'
  export default {
    data() {
      return {
        param:{
          pageNum:1,
          pageSize:10
        },
        total:0,
        tableData: []
      }
    },
    created() {
        this.init(1)
    },
    methods:{
      init(currentPage){
        this.param.pageNum = currentPage;
        myBedList(this.param).then(response => {
          this.tableData = response.result.list;
          this.total = response.result.total;
        }).catch(err => {
          console.log('err', err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
.el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    padding-right: 10px;
}

</style>