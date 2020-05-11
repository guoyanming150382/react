<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.userName"
        placeholder="用户名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="手机号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="退款状态"
        style="width: 150px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in bedRefundStatusOptions"
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
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button> -->
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      :stripe="true"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="流水号" align="center" min-width="120px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床主" align="center" min-width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床主手机" align="center" min-width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认购日期" align="center" min-width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.buyDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床数" align="center" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.bedCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本金" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.refundCapital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益" align="center" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">{{ scope.row.rtRefundProfit }}</span>
          <span v-if="scope.row.status!='0'">{{ scope.row.refundProfit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总计" align="center" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">{{ scope.row.rtRefundTotal }}</span>
          <span v-if="scope.row.status!='0'">{{ scope.row.refundTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.bankAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行" align="center" min-width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.openBank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" min-width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.approver }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | bedRefundStatusFilter">{{ scope.row.status | toBedRefundStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            v-if="scope.row.status=='0'"
            @click="updateProgress(scope.row,'1')"
          >已打款</el-button>
          <el-button
            type="danger"
            size="small"
            v-if="scope.row.status=='0'"
            @click="updateProgress(scope.row,'2')"
          >驳回</el-button>
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
import { fetchList, updateProgress } from '@/api/bedRefund'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    bedRefundStatusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      bedRefundStatusOptions: this.GLOBAL.bedRefundStatus,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      temp: {},
      bedRefund: {},
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
    updateProgress(row, newStatus) {
      this.refund = Object.assign({}, row)
      this.refund.status = newStatus
      let confirmMsg=''
      let confirmTitle=''
      let confirmButtonText=''
      let cancelButtonText='取消'
      if(newStatus == '1'){
        confirmMsg = '是否改笔退款已完成打款?'
        confirmTitle = '打款确认'
        confirmButtonText = '已打款'
      }else if(newStatus == '2'){
        confirmMsg = '是否确认驳回该笔退款申请?'
        confirmTitle = '驳回确认'
        confirmButtonText = '确认驳回'
      }
      this.$confirm(confirmMsg, confirmTitle, {
          confirmButtonText: confirmButtonText,
          cancelButtonText: cancelButtonText,
          type: 'warning'
      }).then(() => {
          updateProgress(this.refund).then(() => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 6000
          })
          this.handleFilter()
        })
      })
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
