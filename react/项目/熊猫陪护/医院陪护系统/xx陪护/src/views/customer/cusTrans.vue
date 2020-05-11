<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.nickName"
        placeholder="客户昵称"
        prop="nickName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.transType"
        placeholder="交易类型"
        prop="transType"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in transType" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.accType"
        placeholder="账户类型"
        prop="accType"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in accType" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-date-picker
        v-model="listQuery.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        class="filter-item"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="handleFilter"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
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
        <el-table-column prop="showNickName" label="微信昵称" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.showNickName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accType" label="账户类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.accType | accTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount>0 ? "+"+scope.row.amount : scope.row.amount }}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="transType" label="交易类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.transType | transTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="交易时间" align="center" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { getCusTrans } from "@/api/worker/worker";
import Pagination from "@/components/Pagination";

export default {
  data() {
    return {
        accType: this.GLOBAL.accType,
        pickerOptions: this.GLOBAL.pickerOptions[0],
        transType: [
            {key: '0', label: '充值VIP'},
            {key: '1', label: 'VIP推荐'},
            {key: '2', label: '订单推荐'},
            {key: '3', label: '订单消费'},
            {key: '4', label: '订单取消'},
            {key: '5', label: '订单提前结束'},
            {key: '6', label: '提现'},
            {key: '7', label: '提现失败'},
            {key: '8', label: '订单超时失效'},
            {key: '9', label: '订单周期付款'},
            {key: '10', label: '支付取消'},
        ],
        total: 0,
        listLoading: true,
        listQuery: {
            pageNum: 1,
            pageSize: 10
        },
        list: null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
        this.listLoading = true 
        getCusTrans(this.listQuery).then(res=>{
            this.list = res.result.list
            this.total = res.result.total
            this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    }
  },
  filters: {
    transTypeFilter(status){
        const val = {
            0: '充值VIP',
            1: 'VIP推荐',
            2: '订单推荐',
            3: '订单消费',
            4: '订单取消',
            5: '订单提前结束',
            6: '提现',
            7: '提现失败',
            8: '订单超时失效',
            9: '订单周期付款',
            10: '支付取消'
        }
        return val[status]
    }
  },
  components: { Pagination }
};
</script>

<style>
</style>