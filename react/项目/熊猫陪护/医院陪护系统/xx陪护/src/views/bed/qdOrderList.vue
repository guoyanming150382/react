<template>
  <div class="app-container">
    <div class="filter-container">
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
import { fetchList, manualClose } from '@/api/order'
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
    /* EXCEL导出start */
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单编号', '床号', '投放科室', '订单状态', '付款方式', '付款金额', '用床时间', '还床时间']
        const filterVal = [
          'code',
          'bedName',
          'departmentName',
          'status',
          'payMethod',
          'payAmount',
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
