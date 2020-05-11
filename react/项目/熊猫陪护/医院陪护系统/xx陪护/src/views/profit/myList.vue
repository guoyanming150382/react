<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        placeholder="收益方式"
        style="width: 150px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in profitTypeOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
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
      <el-table-column label="收益编号" align="center" width="100px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方式" align="center" min-width="80px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.type | toProfitType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" min-width="80px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院" align="center" min-width="120px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室" align="center" min-width="80px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.depart }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司" align="center" min-width="60px" :show-overflow-tooltip="true" v-if="currentRole=='ADM' || currentRole=='OPE'">
        <template slot-scope="scope">
          <span>{{ scope.row.companyRate }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商" align="center" min-width="120px" :show-overflow-tooltip="true" v-if="currentRole=='ADM' || currentRole=='OPE'">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}({{ scope.row.operatorRate }}%)</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道商组" align="center" min-width="120px" :show-overflow-tooltip="true" v-if="currentRole=='ADM' || currentRole=='OPE' || currentRole=='DIS'">
        <template slot-scope="scope">
          <span>{{ scope.row.distributorGroup }}({{ scope.row.distributorRate }}%)</span>
        </template>
      </el-table-column>
      <el-table-column label="床主组" align="center" min-width="120px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ownerGroup }}({{ scope.row.ownerRate }}%)</span>
        </template>
      </el-table-column>
      <el-table-column label="个人" align="center" min-width="60px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.userRate }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="收益时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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
import store from '../../store'
import { getMyProfitPageList } from '@/api/profit'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
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
      currentRole: store.getters.roles[0],
      profitTypeOptions: this.GLOBAL.profitType,
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
      downloadLoading: false
    }
  },
  created() {
    this.currentRole=store.getters.roles[0]
    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
    this.listQuery.openTimeRange[0] = start;
    this.listQuery.openTimeRange[1] = end;
    this.getList()
  },
  methods: {
    sortChange() {

    },
    getList() {
      this.listLoading = true
      getMyProfitPageList(this.listQuery).then(response => {
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
