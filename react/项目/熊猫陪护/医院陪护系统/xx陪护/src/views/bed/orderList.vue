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
      <el-date-picker
        v-model="listQuery.openTimeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        class="filter-item"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
      <el-input
        v-model="listQuery.customerPhone"
        placeholder="用户手机号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.customerNickName"
        placeholder="客户昵称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.code"
        placeholder="订单编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.bedName"
        placeholder="床编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="订单状态"
        style="width: 198px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in orderStatusOptions"
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
      <el-table-column label="订单编号" align="center" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名" align="center" width="150px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.customerShowName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床号" align="center" min-width="130px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bedName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放医院" align="center" width="140px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.hospitalName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放科室" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="150px">
        <template v-if="scope.row.customerIsPhoneAuth=='Y'" slot-scope="scope">
          {{ scope.row.customerPhone }} &nbsp; <i class="el-icon-success" />
        </template>
        <template v-else slot-scope="scope">
          {{ scope.row.customerIsPhoneAuth }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | orderStatusFilter">{{ scope.row.status | toOrderStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="付款方式" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.payMethod | toOrderPayMethod }}
        </template>
      </el-table-column>
      <el-table-column label="付款金额" align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.row.planAmount }}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用床时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.openTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="还床时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.closeTime }}</span>
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
          <el-button type="primary" size="mini" @click="showDetail(scope.row)">
            详情
          </el-button>
          <el-button
            type="warning"
            size="mini"
            :disabled="scope.row.status!='1'"
            @click="doClose(scope.row)"
          >
            关锁
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

    <!-- 订单详情Start -->
    <el-dialog title="订单详情" :visible.sync="orderDetailDialogVisable">
      <el-form ref="form" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="订单编号:">
          {{ temp.code }}
        </el-form-item>
        <el-form-item label="床锁编号:">
          {{ temp.bedCode }}
        </el-form-item>
        <el-form-item label="客户名:">
          {{ temp.customerShowName }}
        </el-form-item>
        <el-form-item label="投放医院:">
          {{ temp.hospitalName }}
        </el-form-item>
        <el-form-item label="投放科室:">
          {{ temp.departmentName }}
        </el-form-item>
        <el-form-item label="付款方式:">
          {{ temp.payMethod | toOrderPayMethod }}
        </el-form-item>
        <el-form-item label="下单时间:">
          {{ temp.createTime }}
        </el-form-item>
        <el-form-item label="订单状态:">
          {{ temp.status | toOrderStatus }}
        </el-form-item>
        <el-form-item label="用床时间:">
          {{ temp.openTime }}
        </el-form-item>
        <el-form-item label="还床时间:">
          {{ temp.closeTime }}
        </el-form-item>
        <el-form-item label="还床状态:">
          {{ temp.returnStatus | toReturnStatus }}
        </el-form-item>
        <el-form-item label="欠费金额">
          {{ temp.overdueAmount }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderDetailDialogVisable = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchOrderList, manualClose } from "@/api/bed/bed"
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
    orderStatusFilter(status) {
      const statusMap = {
        0: 'primary',
        1: 'success',
        2: 'danger',
        3: 'warning',
        4: 'warning',
        5: 'info',
        6: 'danger'
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
      orderStatusOptions: this.GLOBAL.orderStatus,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        openTimeRange: [],
        pageNum: 1,
        pageSize: 10
      },
      temp: {},
      hospitalList:[],
      departmentSearch:{},
      departmentList:[],
      downloadLoading: false,
      orderDetailDialogVisable: false
    }
  },
  created() {
    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    this.listQuery.openTimeRange[0] = start;
    this.listQuery.openTimeRange[1] = end;
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
      fetchOrderList(this.listQuery).then(response => {
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
    showDetail(row) {
      this.temp = Object.assign({}, row)
      this.orderDetailDialogVisable = true
    },
    doClose(row) {
      this.$confirm('请确认床已归还再结束订单', '结束订单', {
        confirmButtonText: '确认',
        cancelButtonText: '放弃',
        type: 'warning'
      }).then(() => {
        this.order = Object.assign({}, row)
        manualClose(this.order).then(() => {
          this.$notify({
            title: '成功',
            message: '订单结束成功 (^-^)',
            type: 'success',
            duration: 6000
          })
          this.handleFilter()
        })
      })
      .catch(err=>{
        console.log(err)
      })
    },

    /* EXCEL导出start */
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单编号', '客户名', '床号', '投放医院', '投放科室', '手机号', '是否认证', '订单状态', '付款方式', '付款金额', '下单时间', '用床时间', '还床时间']
        const filterVal = [
          'code',
          'customerShowName',
          'bedName',
          'hospitalName',
          'departmentName',
          'customerPhone',
          'customerIsPhoneAuth',
          'status',
          'payMethod',
          'payAmount',
          'createTime',
          'openTime',
          'closeTime'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '订单列表'
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
