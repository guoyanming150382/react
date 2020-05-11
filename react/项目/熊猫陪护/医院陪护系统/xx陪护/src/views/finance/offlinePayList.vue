<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.userName"
        placeholder="客户姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.userPhone"
        placeholder="客户手机"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.bedCount"
        placeholder="认购床数"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      <el-table-column label="认购单号" align="center" min-width="110px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经办人" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.referee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户手机" align="center" min-width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认购床数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bedCount }}张</span>
        </template>
      </el-table-column>
      <el-table-column label="认购金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buyFee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认购时间" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | withdrawStatusFilter">{{ scope.row.status | toBedBuyRecordStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" align="center" label="审批备注">
        <template slot-scope="{row}">
          <template v-if="row.payRemarkEdit">
            <el-input v-model="row.offlineTransRemark" class="edit-input" size="small" width="200px"/>
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              撤销
            </el-button>
          </template>
          <span v-else>{{ row.offlineTransRemark }}</span>
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
            v-if="row.payRemarkEdit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmPay(row)"
          >
            确认收款
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.payRemarkEdit=!row.payRemarkEdit"
          >
            填写备注
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
import { fetchList, confirmOffLinePay} from '@/api/bedBuyRecord'
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        payMethod:'1',
        status:'2'
      },
      bedBuyRecord: {},
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
    cancelEdit(row){
      row.offlineTransRemark = ""
      row.payRemarkEdit = false
    },
    confirmPay(row){
      if(row.offlineTransRemark.length == 0){
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
    },
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
