<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.batchCode"
        placeholder="批次号"
        style="width: 250px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.userName"
        placeholder="用户名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        style="width: 120px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in withdrawStatusOptions"
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
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
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
      <el-table-column label="批次号" align="center" min-width="170px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.batchCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现用户" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户手机" align="center" min-width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center" min-width="90px">
        <template slot-scope="scope">
          <span style="color:red">{{ scope.row.amount }} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="认购时间" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.bedBuyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" min-width="140px">
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
          <span>{{ scope.row.approverName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | withdrawStatusFilter">{{ scope.row.status | toWithdrawStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status=='0'"
            type="warning"
            size="small"
            @click="updateWithdraw(scope.row,'1')"
          >通过</el-button>
          <el-button
            v-if="scope.row.status=='0'"
            type="danger"
            size="small"
            @click="updateWithdraw(scope.row,'2')"
          >驳回</el-button>
          <el-button
            v-if="scope.row.status=='1'"
            type="success"
            size="small"
            @click="updateWithdraw(scope.row,'3')"
          >成功</el-button>
          <el-button
            v-if="scope.row.status=='1'"
            type="danger"
            size="small"
            @click="updateWithdraw(scope.row,'4')"
          >失败</el-button>
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
import { fetchList, updateProgress } from '@/api/userWithdraw'
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
      withdrawStatusOptions: this.GLOBAL.withdrawStatus,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      temp: {},
      withdraw: {},
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
    updateWithdraw(row, newStatus) {
      this.withdraw = Object.assign({}, row)
      this.withdraw.status = newStatus
      let confirmMsg=''
      let confirmTitle=''
      let confirmButtonText=''
      let cancelButtonText='取消'
      if(newStatus == '1'){
        confirmMsg = '是否确认通过该笔提现申请?'
        confirmTitle = '审批通过确认'
        confirmButtonText = '确认通过'
      }else if(newStatus == '2'){
        confirmMsg = '是否确认驳回该笔提现申请?'
        confirmTitle = '驳回申请确认'
        confirmButtonText = '确认驳回'
      }else if(newStatus == '3'){
        confirmMsg = '是否确认提现已打款成功?'
        confirmTitle = '打款成功确认'
        confirmButtonText = '确认成功'
      }else if(newStatus == '4'){
        confirmMsg = '是否确认提现已打款失败?'
        confirmTitle = '打款失败确认'
        confirmButtonText = '确认失败'
      }

      this.$confirm(confirmMsg, confirmTitle, {
          confirmButtonText: confirmButtonText,
          cancelButtonText: cancelButtonText,
          type: 'warning'
      }).then(() => {
          updateProgress(this.withdraw).then(() => {
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
