<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.hospitalId"
        filterable
        clearable
        class="filter-item"
        placeholder="选择医院"
        style="width:200px"
        @change="getDepartList"
      >
        <el-option
          v-for="hospital in hospitalList"
          :key="hospital.rowId"
          :label="hospital.name"
          :value="hospital.rowId">
          <span style="float: left">{{ hospital.name }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="listQuery.departmentId"
        filterable
        clearable
        class="filter-item"
        placeholder="选择科室"
        style="width:200px"
      >
        <el-option
          v-for="depart in departmentList"
          :key="depart.rowId"
          :label="depart.name"
          :value="depart.rowId">
          <span style="float: left">{{ depart.name }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="listQuery.transStatus"
        placeholder="付款状态"
        style="width: 120px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in transStatusOption"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
    </div>
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.buyTimeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        class="filter-item"
        style="width: 405px"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
      <el-select
        v-model="listQuery.refundStatus"
        placeholder="退款状态"
        style="width: 120px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in refundStatusOption"
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
      <el-table-column label="微信名" align="center" width="180px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.showNickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="陪护卡" align="center" width="200px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.cardName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡类型" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.cardType | cardTypeFilter">{{ scope.row.cardType | toCardType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.validEnd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | customerCardStatusFilter">{{ scope.row.status | toCustomerCardStatus }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="开锁码" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.openCode}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="使用中" align="center" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.inUse | inUseFilter">{{ scope.row.inUse | toYesNo }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开锁次数" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.usedCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款金额" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.buyPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购卡时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款状态" align="center" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.transStatus | transStatusFilter">{{ scope.row.transStatus | toTransStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="退款状态" align="center" width="120px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.refundStatus | refundStatusFilter">{{ scope.row.refundStatus | toRefundStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="60px"
        class-name="small-padding"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            :disabled="scope.row.refundStatus!='1'"
            @click="doRefund(scope.row)"
          >退款</el-button>
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
import { fetchCardList } from "@/api/bed/bed"
import { fetchList, updateCustomerCard } from '@/api/customerCard'
import { getHospitalList } from '@/api/hospital'
import { getDepartmentList } from '@/api/department'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    cardTypeFilter(status) {
      const statusMap = {
        0: 'primary',
        1: 'success'
      }
      return statusMap[status]
    },
    inUseFilter(status) {
      const statusMap = {
        N: 'info',
        Y: 'primary'
      }
      return statusMap[status]
    },
    transStatusFilter(status) {
      const statusMap = {
        0: 'primary',
        1: 'success',
        2: 'info'
      }
      return statusMap[status]
    },
    customerCardStatusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success'
      }
      return statusMap[status]
    },
    refundStatusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'primary',
        3: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      transStatusOption: this.GLOBAL.transStatus,
      refundStatusOption: this.GLOBAL.refundStatus,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        buyTimeRange: [],
        pageNum: 1,
        pageSize: 10
      },
      hospitalList:[],
      departmentSearch:{},
      departmentList:[],
      temp: {},
      downloadLoading: false
    }
  },
  created() {
    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    this.listQuery.buyTimeRange[0] = start;
    this.listQuery.buyTimeRange[1] = end;
    this.getList()
    getHospitalList().then(response => {
        this.hospitalList = response.result
    })
  },
  methods: {
    sortChange() {

    },
    getList() {
      this.listLoading = true
      fetchCardList(this.listQuery).then(response => {
        this.list = response.result.list
        this.total = response.result.total
        this.listLoading = false
      })
    },
    getDepartList(){
      this.handleFilter()
      this.departmentSearch.hospitalId=this.listQuery.hospitalId
      getDepartmentList(this.departmentSearch).then(
        response => {
        this.departmentList = response.result
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    doRefund(row) {
      this.$confirm('是否确认退款', '退款操作', {
        confirmButtonText: '确认',
        cancelButtonText: '放弃',
        type: 'warning'
      }).then(() => {
        this.customerCard = Object.assign({}, row)
        this.customerCard.status = '0'
        this.customerCard.refundStatus = '3'
        updateCustomerCard(this.customerCard).then(() => {
          this.$notify({
            title: '成功',
            message: '退款操作成功 (^-^)',
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
