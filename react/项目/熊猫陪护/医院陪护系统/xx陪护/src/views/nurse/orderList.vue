<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.userName"
        placeholder="护工姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      /> -->
      <el-select
        v-model="listQuery.status"
        placeholder="订单状态"
        style="width: 150px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in careOrderStatusOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      :stripe="true"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="订单编码" align="center" min-width="120px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" min-width="55px">
        <template slot-scope="scope">
          <span>{{ scope.row.type | toCareOrderType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="护工名" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.workerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="护工手机" align="center" min-width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.workerPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="护理等级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.careStandard | careStandardFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderFee }} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="预期开始" align="center" min-width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预期结束" align="center" min-width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" min-width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际开始" min-width="250px" align="center">
        <template slot-scope="{row}">
          <template v-if="row.actStartEdit">
            <el-date-picker v-model="row.actStartDate" type="date" style="width:140px;float:left;" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button
              class="cancel-btn"
              size="small"
              style="width:70px"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelActStartEdit(row)"
            >
              撤销
            </el-button>
          </template>
          <span v-else>{{ row.actStartDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际结束" min-width="250px" align="center">
        <template slot-scope="{row}">
          <template v-if="row.actEndEdit">
            <el-date-picker v-model="row.actEndDate" type="date" style="width:140px;float:left;" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button
              class="cancel-btn"
              size="small"
              style="width:70px"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelActEndEdit(row)"
            >
              撤销
            </el-button>
          </template>
          <span v-else>{{ row.actEndDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="90px">
        <template slot-scope="scope">
          {{ scope.row.status | toCareOrderStatus }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
      > 
        <template slot-scope="{row}">
          <el-button
            v-if="row.status=='3' && row.actStartEdit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="progress(row)"
          >
            已上单
          </el-button>
          <el-button
            v-if="row.status=='3' && !row.actStartEdit"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.actStartEdit=!row.actStartEdit"
          >
            上单确认
          </el-button>
          <el-button
            v-if="row.status=='4' && row.actEndEdit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="progress(row)"
          >
            已下单
          </el-button>
          <el-button
            v-if="row.status=='4' && !row.actEndEdit"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.actEndEdit=!row.actEndEdit"
          >
            下单确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList, progress} from '@/api/careOrder'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    withdrawStatusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'primary',
        2: 'warning',
        3: 'success',
        4: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      careOrderStatusOptions: this.GLOBAL.careOrderStatus,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        status:''
      },
      careOrder: {},
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    sortChange() {

    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.result.list
        this.total = response.result.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    cancelActStartEdit(row){
      row.actStartDate = ""
      row.actStartEdit = false
    },
    cancelActEndEdit(row){
      row.actEndDate = ""
      row.actEndEdit = false
    },

    progress(row){
      this.careOrder = Object.assign({}, row)
      progress(this.careOrder).then(() => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 6000
        })
        this.handleFilter()
      })
    },
      /* if(row.offlineTransRemark.length == 0){
        this.$message({
        message: '请输入线下收款备注',
        type: 'error'
        })
      }else{
        this.bedBuyRecord = Object.assign({}, row)
        this.$confirm("是否确认该笔" + row.buyFee + "线下支付已到公司账上", "线下打款确认", {
            confirmButtonText: "已收到",
            cancelButtonText: "取消",
            type: 'warning'
        }).then(() => {
            confirmOffLinePay(this.bedBuyRecord).then(() => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 6000
            })
            this.handleFilter()
          })
        }) 
      }
    },*/
    /* EXCEL导出start */
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['微信名', 'VIP', '性别', '国家', '省份', '城市', '语言', '手机号', '是否验证', '注册时间']
        const filterVal = [
          'showNickName',
          'isVip',
          'gender',
          'country',
          'province',
          'city',
          'language',
          'phone',
          'isPhoneAuth',
          'createTime'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '微信用户列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
    /* EXCEL导出End */
  },
  filters: {
    careStandardFilter(status) {
      const statusMap = {
        0: "能自理",
        1: "协助自理",
        2: "不能自理"
      };
      return statusMap[status];
    },
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
