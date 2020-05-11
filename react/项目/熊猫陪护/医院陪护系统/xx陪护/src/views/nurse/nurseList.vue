<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.realName"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.gender"
        placeholder="性别"
        style="width: 100px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in workerGenderOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="listQuery.refCode"
        placeholder="推荐人手机号"
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
      :stripe="true"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="姓名" align="center" width="100px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="70px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender | genderFilter">{{ scope.row.gender | toWorkerGender }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="技能" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.showAbility }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持有材料" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.showAvlDocs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐人" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.refCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" width="150px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.approveStatus | approveStatusFilter">{{ scope.row.approveStatus | toApproveStatus }}</el-tag>
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
            v-if="scope.row.approveStatus!='2'"
            type="success"
            size="small"
            @click="updateApproveStats(scope.row,'2')"
          >通过</el-button>
          <el-button
            v-if="scope.row.approveStatus!='3'"
            type="danger"
            size="small"
            @click="updateApproveStats(scope.row,'3')"
          >拒绝</el-button>
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
import { fetchList, updateWorker } from '@/api/nurse'
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
    },

    approveStatusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'primary',
        2: 'success',
        3: 'danger'
      }
      return statusMap[status]
    },
    genderFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'primary',
        2: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      workerGenderOptions: this.GLOBAL.workerGender,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        status: '1',
        pageNum: 1,
        pageSize: 10
      },
      temp: {},
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
    updateApproveStats(row, vip) {
      this.worker = Object.assign({}, row)
      this.worker.approveStatus = vip
      updateWorker(this.worker).then(() => {
        this.$notify({
          title: '成功',
          message: '修改审批状态成功 (^-^)',
          type: 'success',
          duration: 6000
        })
        this.handleFilter()
      })
    },
    /* EXCEL导出start */
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '性别', '年龄', '手机号', '技能', '持有材料', '注册时间', '审批状态']
        const filterVal = [
          'realName',
          'gender',
          'age',
          'phone',
          'showAbility',
          'showAvlDocs',
          'createTime',
          'approveStatus'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '护工列表'
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
