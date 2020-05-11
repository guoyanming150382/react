<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.orderCode"
        placeholder="订单编码"
        prop="orderCode"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      /> -->
      <el-input
        v-model="listQuery.customerNickName"
        placeholder="微信昵称"
        prop="customerNickName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.type"
        placeholder="账单类型"
        prop="type"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in billType" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-date-picker
        v-model="listQuery.dueDateRange"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        class="filter-item"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="handleFilter"
      ></el-date-picker>
      <el-select
        v-model="listQuery.status"
        placeholder="账单类型"
        prop="status"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in billStatus" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-checkbox
        v-model="overdue"
        class="filter-item"
        style="margin-left:15px;"
        @change="queryOverdue"
      >逾期</el-checkbox>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <!-- <el-button class="filter-item" type="primary" @click="$router.go(-1)">返 回</el-button> -->
    </div>
    <!-- 列表 -->
    <div>
      <el-table
        :data="list"
        v-loading="listLoading"
        border
        :stripe="true"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="orderCode"
          label="查看订单"
          align="center"
          min-width="80"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
              <a style="color: #1890FF;" @click="toDetail(scope.row)">查看订单</a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名" align="center" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.customerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="账单类型" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.type | billTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="应付日期" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.dueDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdue" label="逾期" align="center" min-width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.overdue | toYesNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billStart" label="账单周期" align="center" min-width="225">
          <template slot-scope="scope">
            <span v-if="scope.row.billStart">{{ scope.row.billStart }} ~ </span>
            <span v-if="scope.row.billEnd">{{ scope.row.billEnd }} ({{ scope.row.billDays }}天)</span>
          </template>
        </el-table-column>
        <el-table-column prop="couponDiscount" label="优惠券" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.couponDiscount ? scope.row.couponDiscount : "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="实际金额" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }} 元</span>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="付款时间" align="center" min-width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.payTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | billStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 详情弹框 -->
    <div v-if="info">
      <el-dialog title="账单详情" :visible.sync="dialogVisible" width="735px">
        <div class="container">
          <div class="item"><span>账单编码：</span>{{ info.code }}</div>
          <div class="item"><span>账单类型：</span>{{ info.type | billTypeFilter }}</div>
          <div class="item"><span>账单序号：</span>{{ info.paySeq }}</div>
          <div class="item"><span>整月账单：</span>{{ info.isFullMonth | toYesNo }}</div>
          <div class="item"><span>月份：</span>{{ info.month }}月</div>
          <div class="item"><span>整月账期：</span>{{ info.monthSeq }}</div>
          <div class="item"><span>月尾款：</span>{{ info.monthFinalPay | toYesNo }}</div>
          <div class="item"><span>尾款：</span>{{ info.finalPay | toYesNo }}</div>
          <div class="item"><span>账单周期：</span>{{ info.billEnd }}-{{ info.billStart }}（{{ info.billDays }}天）</div>
          <div class="item"><span>退款天数：</span>{{ info.refundDays }}天</div>
          <div class="item"><span>开始月天数：</span>{{ info.firstDays }}天</div>
          <div class="item"><span>开始月单价：</span>{{ info.firstDayPrice }} 元/天</div>
          <div class="item"><span>完整月数：</span>{{ info.fullDays }}月</div>
          <div class="item"><span>完整月单价：</span>{{ info.fullDayPrice }}元/月</div>
          <div class="item"><span>结束月天数：</span>{{ info.lastDays }}天</div>
          <div class="item"><span>结束月单价：</span>{{ info.lastDayPrice }}元/月</div>
          <div class="item"><span>账单金额：</span>{{ info.originAmount }}元</div>
          <div class="item"><span>优惠券减免：</span>{{ info.couponDiscount }}元</div>
          <div class="item"><span>实际金额：</span>{{ info.amount }}元</div>
          <div class="item"><span>应付日期：</span>{{ info.dueDate }}</div>
          <div class="item"><span>逾期：</span>{{ info.overdue | toYesNo }}</div>
          <div class="item"><span>实际付款时间：</span>{{ info.payTime }}</div>
          <div class="item"><span>状态：</span>{{ info.status | billStatusFilter }}</div>
          <div class="item"><span>账单创建时间：</span>{{ info.createTime }}</div>
        </div>
      </el-dialog>
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getCusBillList"
    />
  </div>
</template>

<script>
import { getCusBill } from "@/api/worker/worker";
import Pagination from "@/components/Pagination";

export default {
  name: "getCusBill",
  data() {
    return {
      billType: this.GLOBAL.billType,
      billStatus: this.GLOBAL.billStatus,
      pickerOptions: this.GLOBAL.pickerOptions[0],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      list: null,
      overdue: false,
      info: null,   //详情弹框数据
      dialogVisible: false,   //详情弹框开关
    };
  },
  created() {
    this.getCusBillList();
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getCusBillList();
    },
    queryOverdue() {
      if (this.overdue == true) {
        this.listQuery.overdue = "Y";
        this.handleFilter();
      } else {
        this.listQuery.overdue = "N";
        this.handleFilter();
      }
    },
    getCusBillList() {
      const id = this.$route.query.rowId;
      getCusBill({
        orderId: id,
        ...this.listQuery
      }).then(res => {
        this.list = res.result.list;
        this.total = res.result.total;
        this.listLoading = false;
      });
    },
    showDetail(info) {
      this.info = info
      this.dialogVisible = true
    },
    toDetail(row) {
      this.$router.push({
        path: "worker/orderdetail",
        query: {
          id: row.orderId
        }
      });
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss">
.container{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .item{
    min-width: 320px;
    margin: 10px;
    font-size: 16px;
    color: #555;
    span{
      font-size: 18px;
      font-weight: 600;
      color: #909399;
    }
  }
}
</style>