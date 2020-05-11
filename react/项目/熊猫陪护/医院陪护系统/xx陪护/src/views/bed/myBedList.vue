<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        placeholder="床编号"
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
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="床编号" align="center" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.bedCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院" align="center" width="250px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室" align="center" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" align="center" width="150px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enableFlag | usageFlagFilter">{{ scope.row.enableFlag | toEnableFlag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="详细位置" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
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

    <!-- 异常信息弹框Start -->
    <el-dialog title="异常处理" :visible.sync="errorDialogVisable">
      <el-form ref="form" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="床编号:">
          {{ temp.code }}
        </el-form-item>
        <el-form-item label="投放医院:">
          {{ temp.hospital }}
        </el-form-item>
        <el-form-item label="投放科室:">
          {{ temp.department }}
        </el-form-item>
        <el-form-item label="详细位置:">
          {{ temp.location }}
        </el-form-item>
        <el-form-item label="已启用:">
          {{ temp.enableFlag | toYesNo }}
        </el-form-item>
        <el-form-item label="使用中:">
          {{ temp.usageFlag | toYesNo }}
        </el-form-item>
        <el-form-item label="锁打开:">
          {{ temp.lockStatus | toYesNo }}
        </el-form-item>
        <el-form-item label="锁在线:">
          {{ temp.lockOnline | toYesNo }}
        </el-form-item>
        <el-form-item label="故障异常:">
          {{ temp.errorState | toYesNo }}
        </el-form-item>
        <el-form-item label="异常描述:">
          {{ temp.errorDesc }}
        </el-form-item>
        <el-form-item label="异常时间:">
          {{ temp.errorTime }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="solveError(temp)"
        >故障已解决</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchMyBedList } from '@/api/bed'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    usageFlagFilter(status) {
      const statusMap = {
        Y: 'success',
        N: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      usageFlagOptions: this.GLOBAL.usageFlag,
      tableKey: 0,
      showLowBattery:false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      temp: {},
      downloadLoading: false,
      errorDialogVisable: false
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
      const vm = this
      // console.log("this.listQuery",this.listQuery)
      fetchMyBedList(this.listQuery).then(response => {
        console.log('response', response)
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
        const tHeader = ['床编码', '医院', '科室', '地址', '使用状态', '启用状态', '床锁状态', '开锁次数', '信号强度', '电量', '更新时间']
        const filterVal = [
          'code',
          'hospital',
          'department',
          'location',
          'usageFlag',
          'enableFlag',
          'lockStatus',
          'openCount',
          'wifi',
          'battery',
          'updateTime'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '陪护床列表'
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
