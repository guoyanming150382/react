<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.workerName"
        placeholder="照护师姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="审核状态"
        prop="status"
        style="width: 120px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option 
          v-for="item in toStatusQuery"
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
        <el-table-column prop="workerName" label="姓名" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.workerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileUrl" label="证书" align="center" width="70">
          <template slot-scope="scope">
            <img
              v-if="scope.row.fileUrl"
              @click="handleToView(scope.row.fileUrl)"
              :src="scope.row.fileUrl"
              style="width: 35px;height: 30px;"
              alt="证书"
              title="点击查看大图"
            />
            <span v-else>未上传</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approverName" label="审批人" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.approverName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveTime" label="审批时间" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.approveTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | toStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="170">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">
              <el-button @click="handleToPass(scope.row, 'Y')" type="success" size="small">通过</el-button>
              <el-button @click="handleToReject(scope.row, 'N')" type="danger" size="small">驳回</el-button>
            </div>
            <el-tag v-else-if="scope.row.status == 1" type="primary">已通过</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="error">已驳回</el-tag>
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
import { fetchCertificate, approveCert } from "@/api/nurse";
import Pagination from "@/components/Pagination";

export default {
  name: "certificate",
  data() {
    return {
      toStatusQuery: this.GLOBAL.toStatusQuery,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      listLoading: true,
      total: 0,
      list: null
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
      fetchCertificate(this.listQuery).then(response => {
        this.list = response.result.list;
        this.total = response.result.total;
        this.listLoading = false;
      });
    },
    handleToView(url) {
      this.$alert(`<img src=${url} style="width: 100%;height: 100%;">`, {
        dangerouslyUseHTMLString: true,
        closeOnClickModal: true
      });
    },
    handleToPass(row, isPass) {
      let data = {
        certId: row.rowId,
        isPass: isPass
      };
      this.$confirm("确定通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          approveCert(data)
            .then(res => {
              if (res.code == "00000000") {
                this.$notify({
                      title: "审核通过成功",
                      message: "已保存通过护工资格证书的审核",
                      type: "success",
                      duration: 6000
                    });
                    this.getList();
              } else {
                this.$message.error("操作失败，请重试！");
              }
            })
            .catch(() => {
              this.$message.error("操作失败，请重试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    handleToReject(row, isPass) {
      let data = {
        certId: row.rowId,
        isPass: isPass
      };
      this.$confirm("确定驳回?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          approveCert(data)
            .then(res => {
              if (res.code == "00000000") {
                this.$notify({
                      title: "审核驳回成功",
                      message: "已保存驳回护工资格证书的审核",
                      type: "success",
                      duration: 6000
                    });
                    this.getList
              } else {
                this.$message.error("操作失败，请重试！");
              }
            })
            .catch(() => {
              this.$message.error("操作失败，请重试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "primary",
        1: "success",
        2: "danger"
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
  padding-left: 10px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  .filter-item {
    margin-left: 10px;
  }
}
</style>