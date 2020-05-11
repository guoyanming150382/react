<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.createDateRange"
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
        placeholder="状态"
        prop="status"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in status" :key="item.key" :label="item.label" :value="item.key"></el-option>
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
        <el-table-column prop="code" label="编号" align="center" min-width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="用户类型" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.userType | userTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workerName" label="用户名" align="center" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.userType==0">{{ scope.row.customerShowNickName }}</span>
            <span v-else>{{ scope.row.workerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purpose" label="目的" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.purpose | purposeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="returnCode" label="状态码" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.returnCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="resultCode" label="业务结果" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resultCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" min-width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
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
              @click="handleToSend(scope.row.rowId)"
            >发送</el-button>
            <el-tag v-else>无操作</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getRedPackPageList, sendRedPack } from "@/api/worker/worker";
import Pagination from "@/components/Pagination";

export default {
  data() {
    return {
      pickerOptions: this.GLOBAL.pickerOptions[0],
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      status: [
        { key: 0, label: "待审核" },
        { key: 1, label: "待发送" },
        { key: 2, label: "发送成功" },
        { key: 3, label: "发送失败" }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleFilter() {
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getRedPackPageList(this.listQuery).then(res => {
        this.list = res.result.list;
        this.total = res.result.total;
        this.listLoading = false;
      });
    },
    handleToSend(redPackId) {
      this.$confirm("确定发送?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          sendRedPack({ redPackId })
            .then(res => {
              this.$notify({
                title: "操作成功",
                message: "红包已发送 (*^_^*)",
                type: "success",
                duration: 6000
              });
              this.getList();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    }
  },
  filters: {
    userTypeFilter(status) {
      const value = {
        0: "客户",
        1: "护工"
      };
      return value[status];
    },
    purposeFilter(status) {
      const value = {
        0: "照护师关怀",
        1: "VIP推荐",
        2: "订单抽成",
        3: "订单推荐"
      };
      return value[status];
    },
    statusFilter(status) {
      const value = {
        0: "待审核",
        1: "待发送",
        2: "发送成功",
        3: "发送失败",
        4: "审核失败"
      };
      return value[status];
    }
  },
  components: {
    Pagination
  }
};
</script>

<style>
</style>