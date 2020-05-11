<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.realName"
        placeholder="姓名"
        style="width: 200px;"
        prop="realName"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="手机号"
        prop="phone"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-input
        v-model="listQuery.refereeName"
        placeholder="推荐人"
        prop="refereeName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.approveStatus"
        placeholder="审核状态"
        prop="approveStatus"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in approveStatus"
          :key="item.key"
          :value="item.key"
          :label="item.label"
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
        <el-table-column prop="realName" label="姓名" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" align="center" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center" width="70">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.gender" :type="scope.row.gender | genderFilter">{{ scope.row.gender | toWorkerGender }}</el-tag>
            <el-tag v-else type="warning">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="showAbility" label="技能列表" align="center" width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.showAbility }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="showAvlDocs" label="持有材料" align="center" width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.showAvlDocs }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="refereeName" label="推荐人" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.refereeName">{{ scope.row.refereeName }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveStatus" label="审核状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.approveStatus | approveStatusFilter"
            >{{ scope.row.approveStatus | toApproveStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approverName" label="审批人" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.approverName">{{ scope.row.approverName }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="155">
          <template slot-scope="scope">
            <div v-if="scope.row.approveStatus == 1 || scope.row.approveStatus == 0">
              <el-button @click="handleToApprove(scope.row)" type="success" size="small">审核</el-button>
              <el-button @click="handleToReject(scope.row)" type="danger" size="small">拒绝</el-button>
            </div>
            <el-tag v-else type="primary">没有可执行的操作</el-tag>
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
import { fetchList, rejectWorker } from "@/api/nurse";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "accordingAudit",
  data() {
    return {
      approveStatus: this.GLOBAL.approveStatus,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        status: "1",
        pageNum: 1,
        pageSize: 10,
        approveStatus: "1"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.result.list;
        this.total = response.result.total;
        this.listLoading = false;
      });
    },
    handleToApprove(row) {
      this.$router.push({
        path: "approve",
        query: {
          id: row.rowId
        }
      });
    },
    //拒绝
    handleToReject(row) {
      this.$confirm("确定拒绝?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          this.$prompt("请填写拒绝原因", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPattern: /\S/,
            inputErrorMessage: "请填写拒绝原因"
          })
            .then(({ value }) => {
              var reject = {
                workerId: row.rowId,
                rejectReason: value
              };
              rejectWorker(reject);
              this.$notify({
                title: "操作成功",
                message: "已拒绝护工提交的审批",
                type: "success",
                duration: 6000
              });
              this.getList();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消!"
          });
        });
    }
  },
  filters: {
    genderFilter(status) {
      const statusMap = {
        0: "danger",
        1: "primary",
        2: "info"
      };
      return statusMap[status];
    },
    approveStatusFilter(status) {
      const statusMap = {
        0: "warning",
        1: "primary",
        2: "success",
        3: "danger"
      };
      return statusMap[status];
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss" scope>
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