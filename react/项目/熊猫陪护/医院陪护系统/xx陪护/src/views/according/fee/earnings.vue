<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.workerName"
        placeholder="姓名"
        prop="workerName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.profitType"
        placeholder="收益类型"
        prop="profitType"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in workerProfitType"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="收益状态"
        prop="status"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in workerProfitStatus"
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
        <el-table-column prop="workerName" label="护工" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.workerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="收益时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | profitStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profitType" label="收益类型" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.profitType | workerProfitFilter }}</span>
            <span
              v-if="scope.row.profitType==1 || scope.row.profitType==2"
              class="vieworder"
              @click="toViewOrder(scope.row.sourceId)"
            >[查看订单]</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="drawtime" label="提现时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.drawtime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="经办人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.operatorName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="(scope.row.profitType==1 && scope.row.status==0) || (scope.row.profitType==2 && scope.row.status==1)"
              @click="showDialog(scope.row.rowId)"
              type="primary"
              size="small"
            >打款确认</el-button>
            <el-tag v-else>暂无可执行操作</el-tag>
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
    <div>
      <el-dialog
        title="打款确认"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-date-picker
          v-model="payDate"
          type="datetime"
          placeholder="选择打款日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
        <p>
          <el-input v-model="drawRemark" placeholder="请填写打款备注"></el-input>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmPay">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getWorkerProfit, confirmPay } from "@/api/nurse";
import Pagination from "@/components/Pagination";

export default {
  name: "earnings",
  data() {
    return {
      workerProfitType: this.GLOBAL.workerProfitType,
      workerProfitStatus: this.GLOBAL.workerProfitStatus,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        profitType: "1",
        status: "0",
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false,
      payDate: "", //打款日期
      rowId: "", //打款id
      drawRemark: "" //打款备注
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      var res = await getWorkerProfit(this.listQuery);
      this.list = await res.result.list;
      this.total = await res.result.total;
      this.listLoading = false;
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    toViewOrder(sourceId) {
      this.$router.push({
        path: "orderdetail",
        query: {
          id: sourceId
        }
      });
    },
    handleClose() {
      this.rowId = "";
      this.payDate = "";
      this.drawRemark = "";
      this.$message("已取消");
      this.dialogVisible = false;
    },
    showDialog(id) {
      this.rowId = id;
      this.dialogVisible = true;
    },
    // 确认打款
    confirmPay() {
      if (!this.payDate) {
        this.$message.error("请选择打款日期");
        return;
      }
      if (!this.drawRemark) {
        this.$message.error("请填写打款备注");
        return;
      }
      const data = {
        rowId: this.rowId,
        drawTime: this.payDate,
        drawRemark: this.drawRemark
      };
      confirmPay(data)
        .then(res => {
          this.$notify({
            title: "打款成功",
            message: res.message + " (^-^)",
            type: "success",
            duration: 6000
          });
          this.rowId = "";
          this.payDate = "";
          this.drawRemark = "";
          this.dialogVisible = false;
          this.getList();
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

<style lang="scss" scoped>
.vieworder {
  font-size: 12px;
  color: #1890ff;
  cursor: pointer;
  &:hover {
    color: darkgoldenrod;
    text-decoration: underline;
  }
}
</style>