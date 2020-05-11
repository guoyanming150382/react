<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-select
        v-model="listQuery.careVipLevel"
        placeholder="熊猫VIP"
        style="width: 120px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in vipLevel"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.source"
        placeholder="来源"
        style="width: 100px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in sourceFilter"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="listQuery.nickNameChar"
        placeholder="客户昵称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.refereeName"
        placeholder="推荐人"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.isPhoneAuth"
        placeholder="已验证"
        style="width: 100px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in yesNoOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="listQuery.phone"
        placeholder="手机号"
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
    <!-- 列表 -->
    <el-table
      class="table_list"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      :stripe="true"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column prop="showAvatar" label="头像" align="center" min-width="55px">
        <template slot-scope="scope">
          <img v-if="scope.row.showAvatar" class="avatar-s" :src="scope.row.showAvatar" alt="">
          <el-tag v-else>未上传</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" width="160px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.showNickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" min-width="85px">
        <template slot-scope="scope">
          <span>{{ scope.row.source | toCareSource }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="性别" align="center" min-width="70px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender | genderFilter">{{ scope.row.gender | toCustomerGender }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="地区" align="center" min-width="85px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.province || scope.row.city">{{ scope.row.province }}{{ scope.row.city }}</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="手机号" align="center" min-width="115px">
        <template v-if="scope.row.isPhoneAuth=='Y'" slot-scope="scope">
          {{ scope.row.phone }}
        </template>
        <template v-else slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column> -->
      <el-table-column label="床VIP" align="center" min-width="70px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isVip | vipFilter">{{ scope.row.isVip | toYesNo }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="熊猫VIP" align="center" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.isCareVip==='Y'">{{ scope.row.careVipLevel | vipLevel }}</span>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推荐人" align="center" min-width="150px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.refType">
            {{scope.row.refType==1||scope.row.refType==3 ? scope.row.refereeName + "(护)" : scope.row.refereeName}}
          </span>
          <el-tag v-else type="info">无</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推荐人数" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.refUserTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐订单" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.refOrderTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现金券" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.cashAcc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.balanceAcc }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="100px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <!-- <template slot-scope="scope">
          <el-button
            v-if="scope.row.isVip=='Y'"
            type="danger"
            size="small"
            @click="updateVIP(scope.row,'N')"
          >取消VIP</el-button>
          <el-button
            v-if="scope.row.isVip=='N'"
            type="success"
            size="small"
            @click="updateVIP(scope.row,'Y')"
          >授予VIP</el-button>
        </template> -->
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="toDetail(scope.row)"
          >查看</el-button>
          <!-- <el-button
            type="danger"
            size="small"
            @click="toEditor(scope.row)"
          >编辑</el-button> -->
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
import { fetchList, updateCustomer } from '@/api/customer'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    // orderStatusFilter(status) {
    //   const statusMap = {
    //     0: 'primary',
    //     1: 'success',
    //     2: 'danger',
    //     3: 'warning',
    //     4: 'warning',
    //     5: 'info',
    //     6: 'danger'
    //   }
    //   return statusMap[status]
    // },
    vipFilter(status) {
      const statusMap = {
        Y: 'success',
        N: 'info'
      }
      return statusMap[status]
    },
    genderFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'primary',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      vipLevel: this.GLOBAL.vipLevel,
      customerGenderOptions: this.GLOBAL.customerGender,
      yesNoOptions: this.GLOBAL.yesNo,
      sourceFilter: this.GLOBAL.sourceFilter,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
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
    toDetail(row){
      this.$router.push({
        path: 'customerDetail',
        query: {
          id: row.rowId
        }
      })
    },
    // updateVIP(row, vip) {
    //   this.customer = Object.assign({}, row)
    //   this.customer.isVip = vip
    //   if(vip == 'Y'){
    //     this.customer.vipCount=-1
    //   }else{
    //     this.customer.vipCount=0
    //   }
      
    //   updateCustomer(this.customer).then(() => {
    //     this.$notify({
    //       title: '成功',
    //       message: '修改VIP角色成功 (^-^)',
    //       type: 'success',
    //       duration: 6000
    //     })
    //     this.handleFilter()
    //   })
    // },

    /* EXCEL导出start */
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['微信昵称', '来源', '地区', '床VIP', '熊猫VIP', '推荐人', '推荐人数', '推荐订单', '现金券', '余额']
        const filterVal = [
          'showNickName',
          'source',
          'province',
          'isVip',
          'isCareVip',
          'refereeName',
          'refUserTotal',
          'refOrderTotal',
          'cashAcc',
          'balanceAcc'
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

<style lang="scss" scoped>
.filter-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  .filter-item{
    margin-left: 10px;
  }
}
</style>