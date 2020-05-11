<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.workerName"
        placeholder="护工姓名"
        prop="workerName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.transType"
        placeholder="流水类型"
        prop="transType"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in transTypeG" :key="item.key" :label="item.label" :value="item.key"></el-option>
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
        <el-table-column prop="createTime" label="流水时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workerName" label="护工名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.workerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transType" label="流水类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.transType | workerTransType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" min-width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getWorkerTrans } from "@/api/worker/worker";

export default {
  data() {
    return {
      pickerOptions: this.GLOBAL.pickerOptions[0],
      transTypeG: this.GLOBAL.transType,
      listLoading: true,
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
    handleFilter(){
      this.pageSize = 1
      this.getList()
    },
    getList() {
      this.listLoading = true;
      getWorkerTrans(this.listQuery).then(res => {
        this.listLoading = false;
        this.total = res.result.total;
        this.list = res.result.list;
      });
    }
  }
};
</script>

<style>
</style>