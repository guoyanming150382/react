<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.workerName"
        placeholder="护工名"
        prop="workerName"
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
        <el-option
          v-for="item in workerBillType"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
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
        <el-option
          v-for="item in workerBillStatus"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-checkbox
        v-model="overdue"
        class="filter-item"
        style="margin-left:15px;"
        @change="queryOverdue"
      >逾期</el-checkbox>
      <!-- <el-checkbox
        v-model="canCheck"
        class="filter-item"
        @change="queryCanCheck"
      >可结算</el-checkbox>-->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" @click="$router.go(-1)">返 回</el-button>
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
          label="订单详情"
          align="center"
          min-width="80px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看订单" placement="top">
              <a style="color: #1890FF;" @click="toDetail(scope.row)">订单详情</a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="workerName" label="护工名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.workerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="结款类型" align="center" min-width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.type | workerBillType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdue" label="逾期" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.overdue | toYesNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="应结日期" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.dueDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdue" label="序号" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.paySeq}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billStart" label="账单周期" align="center" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.billStart.replace(/-/g,'.') }} ~ {{ scope.row.billEnd.replace(/-/g,'.') }} ({{ scope.row.billDays }}天)</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="billDays" label="账单天数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.billDays }} 天</span>
          </template>
        </el-table-column>
        <el-table-column prop="originAmount" label="账单金额" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.originAmount }} 元</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="amount" label="结款金额" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }} 元</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | workerBillStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="结款时间" align="center" min-width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.payTime?scope.row.payTime:'未结款' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="140"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showDetail(scope)">详情</el-button>
            <el-button
              v-if="scope.row.canCheck=='Y'"
              type="success"
              size="small"
              @click="workerBillCheck(scope.row.rowId)"
            >结款</el-button>
            <el-button v-else disabled type="info" size="small">结款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getWorkerBillList"
    />
  </div>
</template>

<script>
import { getWorkerBill, workerBillCheck } from "@/api/worker/worker";
import Pagination from "@/components/Pagination";

export default {
  name: "getCusBill",
  data() {
    return {
      workerBillType: this.GLOBAL.workerBillType,
      workerBillStatus: this.GLOBAL.workerBillStatus,
      pickerOptions: this.GLOBAL.pickerOptions[0],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      list: null,
      overdue: false,
      canCheck: false
    };
  },
  created() {
    this.getWorkerBillList();
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getWorkerBillList();
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
    queryCanCheck() {
      if (this.canCheck == true) {
        this.listQuery.canCheck = "Y";
        this.handleFilter();
      } else {
        this.listQuery.canCheck = "N";
        this.handleFilter();
      }
    },
    getWorkerBillList() {
      const id = this.$route.query.rowId;
      getWorkerBill({
        orderId: id,
        ...this.listQuery
      }).then(res => {
        this.list = res.result.list;
        this.total = res.result.total;
        this.listLoading = false;
      });
    },
    showDetail() {},
    toDetail(row) {
      this.$router.push({
        path: "orderdetail",
        query: {
          id: row.orderId
        }
      });
    },
    workerBillCheck(id) {
      const billId = Number(id);
      workerBillCheck({ billId: billId })
        .then(res => {
          this.$notify({
            title: "操作成功",
            message: res.message,
            type: "success",
            duration: 6000
          });
          this.handleFilter();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    Pagination
  }
};
</script>

<style>
</style>