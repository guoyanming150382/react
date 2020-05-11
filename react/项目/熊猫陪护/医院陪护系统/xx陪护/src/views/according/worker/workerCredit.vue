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
        v-model="listQuery.type"
        placeholder="类型"
        prop="type"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in creditType" :key="item.key" :label="item.label" :value="item.key"></el-option>
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
        <el-table-column prop="workerName" label="护工姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.workerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="获得时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creditChange" label="积分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.creditChange }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | creditFilter }}</span>
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
import { getWorkerCredit } from "@/api/worker/worker";
import Pagination from "@/components/Pagination";

export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      creditType: this.GLOBAL.creditType,
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
    getList() {
      this.listLoading = true;
      getWorkerCredit(this.listQuery).then(res => {
        this.listLoading = false;
        this.list = res.result.list;
        this.total = res.result.total;
      });
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    }
  },
  components: { Pagination }
};
</script>

<style>
</style>