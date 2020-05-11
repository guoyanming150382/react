<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.realName"
        placeholder="护工名"
        prop="realName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.type"
        placeholder="提现方式"
        prop="type"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in withDrawType"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="listQuery.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        class="filter-item"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="申请时间"
        end-placeholder="结束时间"
        @change="handleFilter"
      ></el-date-picker>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        prop="status"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in withdrawStatusG"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
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
        <el-table-column prop="code" label="编号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workerName" label="护工名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.workerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="originAmount" label="申请金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.originAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceFee" label="手续费" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.serviceFee }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="实际金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | withDrawStatus }}</span>
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
            <el-button
              v-if="scope.row.status==0"
              type="primary"
              size="small"
              @click="processWithdraw(scope.row.rowId, 3)"
            >通过</el-button>
            <el-button
              v-if="scope.row.status==0"
              type="primary"
              size="small"
              @click="processWithdraw(scope.row.rowId, 2)"
            >拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
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
import { getWithDraw, processWithdraw } from "@/api/worker/worker";
import Pagination from "@/components/Pagination";

export default {
  data() {
    return {
      pickerOptions: this.GLOBAL.pickerOptions[0],
      withdrawStatusG: this.GLOBAL.withdrawStatus,
      withDrawType: this.GLOBAL.withDrawType,
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
      getWithDraw(this.listQuery).then(res => {
        this.listLoading = false;
        this.total = res.result.total;
        this.list = res.result.list;
      });
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 审批
    processWithdraw(row, status) {
      let flag = status == 2 ? "拒绝" : "通过";
      this.$confirm(`确定${flag}该护工的提现审批?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          processWithdraw({ row, status })
            .then(res => {
              this.$notify({
                title: "操作成功",
                message: `已${flag}该护工的提现审批`,
                type: "success",
                duration: 6000
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
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