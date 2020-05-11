<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        placeholder="订单编号"
        prop="code"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <!-- <el-input
        v-model="listQuery.customerNickName"
        placeholder="客户昵称"
        prop="customerNickName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />-->
      <el-input
        v-model="listQuery.workerName"
        placeholder="护工名"
        prop="workerName"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-input
        v-model="listQuery.clientName"
        placeholder="被护理人名"
        prop="clientName"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-date-picker
        v-model="listQuery.makeOrderTimeRange"
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
        placeholder="订单状态"
        prop="status"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in careOrderStatus"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
      <!-- <el-checkbox
        v-model="pay"
        style="margin-left:15px;"
        class="filter-item"
        @change="queryPay"
      >已付款</el-checkbox>-->
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
          prop="code"
          label="编号"
          align="center"
          width="0"
          :show-overflow-tooltip="true"
        >
          <template>
            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
              <!-- <a style="color: #1890FF;" @click="toDetail(scope.row)">{{ scope.row.code }}</a> -->
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.status | orderStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="careType" label="订单类型" align="center" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.careType | careTypeStatus">{{ scope.row.careType | careTypeFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalAccept" label="抢单" align="center" min-width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.totalAccept }}人</span>
          </template>
        </el-table-column>
        <el-table-column prop="cusUnitPrice" label="单价" align="center" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.timeType == 0">{{ scope.row.cusUnitPrice }}元 /天</span>
            <span v-if="scope.row.timeType == 1">{{ scope.row.cusUnitPrice }}元 /月</span>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="付款类型" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.payMethod | payMethodFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clientName" label="被护理人" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.clientName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workerName" label="护工" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.workerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="emeContactorPhone" label="联系电话" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.emeContactorPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="上单日期" align="center" min-width="100">
          <template slot-scope="scope">
            <span
              v-if="scope.row.status==0||scope.row.status==1||scope.row.status==2||scope.row.status==3"
            >{{ scope.row.startDate }}</span>
            <span v-else>{{ scope.row.actStartDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cusDue" label="欠款" align="center" min-width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.cusDue | toYesNo }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" min-width="250">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row)" type="primary" size="small">详情</el-button>
            <el-button @click="toCusBill(scope.row)" type="success" size="small">客户账</el-button>
            <el-button @click="toWorkerBill(scope.row)" type="primary" size="small">护工账</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 选择日期 -->
    <!-- <div>
      <el-dialog
        title="请选择下单日期"
        :visible.sync="downOrderDialog"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-date-picker v-model="date" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd"></el-date-picker>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="downOrder">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="请选择上单日期"
        :visible.sync="upOrderDialog"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-date-picker v-model="date" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd"></el-date-picker>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="upOrder">确 定</el-button>
        </span>
      </el-dialog>
    </div>-->
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
import { fetchList, progress, confirmPay } from "@/api/careOrder";
import Pagination from "@/components/Pagination";
import { getHasNurseList } from "@/api/hospital";

export default {
  name: "careOrder",
  data() {
    return {
      pickerOptions: this.GLOBAL.pickerOptions[0],
      careType: this.GLOBAL.careType,
      careOrderStatus: this.GLOBAL.careOrderStatus,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      pay: false, // 已付款 单选框
      hasNurseList: null,
      hospital: null, // 医院
      downOrderDialog: false, // 选择日期弹框
      upOrderDialog: false,
      date: "", // 上/下 单日期
      data: null, // 上/下 单请求数据
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
    this.getHasList();
    this.getdate();
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    queryPay() {
      if (this.pay == true) {
        this.listQuery.paidOrder = "Y";
        this.handleFilter();
      } else {
        this.listQuery.paidOrder = "N";
        this.handleFilter();
      }
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.result.list;
        this.total = response.result.total;
        this.listLoading = false;
      });
    },
    getHasList() {
      getHasNurseList().then(res => {
        this.hasNurseList = res.result;
        let obj = {};
        res.result.forEach(function(item, index) {
          obj[String(item.rowId)] = item.code;
        });
        this.hospital = obj;
        // console.log("医院", this.hasNurseList);
      });
    },
    getdate() {
      let now = new Date();
      let date = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        date: now.getDate()
      };
      let nowDate = date.year + "-" + date.month + "-" + date.date;
      this.date = nowDate;
    },
    handleClose(done) {
      this.$message.info("未选择日期");
      done();
    },
    toDetail(row) {
      this.$router.push({
        path: "worker/orderdetail",
        query: {
          id: row.rowId
        }
      });
    },
    toCusBill(row) {
      this.$router.push({
        path: "getCusBill",
        query: {
          rowId: row.rowId
        }
      });
    },
    toWorkerBill(row) {
      this.$router.push({
        path: "worker/getWorkerBill",
        query: {
          rowId: row.rowId
        }
      });
    },
    /* EXCEL导出start */
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "编号",
          "下单时间",
          "订单类型",
          "订单状态",
          "单价",
          "付款类型",
          "被护理人",
          "护工",
          "联系电话",
          "上单日期",
          "欠款"
        ];
        const filterVal = [
          "code",
          "createTime",
          "careType",
          "status",
          "cusUnitPrice",
          "payMethod",
          "clientName",
          "workerName",
          "emeContactorPhone",
          "startDate",
          "cusDue"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "订单列表"
        });
        this.downloadLoading = false;
      });
    },
    statusFilter(status){
      let val = {
        0: "待提交",
        1: "待支付",
        2: "待发布",
        3: "发布中",
        4: "服务中",
        5: "尾款待退",
        6: "尾款待缴",
        7: "已完成",
        8: "已取消",
        9: "取消退款中",
        10: "已退款",
      }
      return val[status]
    },
    payMethodFilter(status){
      let val = {
        0: "全额预付",
        1: "首月预付",
        2: "7天付款"
      }
      return val[status]
    },
    careTypeFilter(status){
      let val = {
        0: "医院照护",
        1: "生活照护",
        2: "随心护"
      }
      return val[status]
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          switch (j){
            case 'careType': 
              return this.careTypeFilter(v[j]); break;
            case 'status': 
              return this.statusFilter(v[j]); break;
            case 'cusUnitPrice': 
              return v.timeType=='0'?v[j]+'元/天':v[j]+'元/月'; break;
            case 'payMethod': 
              return this.payMethodFilter(v[j]); break;
            case 'cusDue': 
              return v[j]=="Y"?"是":"否"; break;
          }
          return v[j];
        })
      );
    }
    /* EXCEL导出End */
  },
  filters: {
    careTypeStatus(status){
      const val = {
        0: 'success',
        1: '',
        2: 'danger',
      }
      return val[status]
    }
  },
  components: {
    Pagination
  }
};
</script>

<style>
</style>