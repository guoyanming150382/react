<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        placeholder="床编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.hospitalId"
        placeholder="选择医院"
        prop="hospitalId"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="(item, key) in hospital" :key="key" :label="item" :value="Number(key)"></el-option>
      </el-select>
      <!-- <el-select
        v-model="listQuery.departId"
        filterable
        clearable
        class="filter-item"
        placeholder="选择科室"
        @change="handleFilter"
        style="width:200px"
      >
        <el-option
          v-for="depart in departmentList"
          :key="depart.rowId"
          :label="depart.name"
          :value="depart.rowId"
        ></el-option>
      </el-select> -->
      <el-select
        v-model="listQuery.bedType"
        placeholder="床类型"
        style="width: 140px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option v-for="item in bedType" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select
        v-model="listQuery.usageFlag"
        placeholder="使用状态"
        style="width: 140px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in usageFlagOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.enableFlag"
        placeholder="启用状态"
        style="width: 140px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in enableFlag"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
      <el-checkbox
        v-model="showOffline"
        class="filter-item"
        style="margin-left:15px;"
        @change="queryOffline"
      >离线</el-checkbox>
      <el-checkbox
        v-model="showLowBattery"
        class="filter-item"
        style="margin-left:15px;"
        @change="queryLowBattery"
      >低电量</el-checkbox>
    </div>
    <!-- 列表 -->
    <div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="床编号" align="center" width="130px">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="医院" align="center" width="180px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.hospital }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="科室" align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.department }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="床类型" align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.bedType | bedTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" align="center" width="100px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.enableFlag | usageFlagFilter"
            >{{ scope.row.enableFlag | toEnableFlag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.lockStatus | usageFlagFilter"
            >{{ scope.row.lockStatus | toUsageFlag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="信号强度" align="center" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.wifi }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电量" align="center" width="85px">
          <template slot-scope="scope">
            <!--<span>{{ scope.row.battery}}</span>-->
            <battery-icon :percentage="scope.row.battery" />
          </template>
        </el-table-column>
        <el-table-column label="通讯状态" align="center" min-width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.updateStatus=='0'">
              <el-tag type="success">正常</el-tag>
            </div>
            <div v-else>
              <el-tag type="info">离线</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数据时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.dataTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="详细位置" align="center" width="180px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.location }}</span>
          </template>
        </el-table-column>-->
        <el-table-column
          label="操作"
          align="center"
          width="210"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleQuery(scope.row)">查询</el-button>
            <el-button type="primary" size="small" @click="dialogDetail(scope.row)">详情</el-button>
            <el-button
              v-if="scope.row.enableFlag=='Y'"
              type="danger"
              size="small"
              @click="updateEnable(scope.row,'N')"
            >停用</el-button>
            <el-button
              v-if="scope.row.enableFlag=='N'"
              type="success"
              size="small"
              @click="updateEnable(scope.row,'Y')"
            >启用</el-button>
            <!-- <el-button
              type="warning"
              size="small"
              :disabled="scope.row.lockOnline=='Y' && scope.row.errorState=='N'"
              @click="showError(scope.row)"
            >处理</el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="scope.row.lockStatus=='Y'"
              @click="remoteOpen(scope.row)"
            >开锁</el-button>-->
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

    <!-- 详情弹框 -->
    <el-dialog :visible.sync="detailVisable" width="57%" :before-close="(done)=> { isEdit=false;done(); }">
      <!-- 基本信息 -->
      <div style="margin-top: -40px;">
        <h3>基本信息</h3>
        <el-table
          :data="[detailData]"
          v-loading="listLoading"
          border
          :stripe="true"
        >
          <el-table-column prop="code" label="床编号">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="battery" label="电量">
            <template slot-scope="scope">
              <span>{{ scope.row.battery }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="wifi" label="信号">
            <template slot-scope="scope">
              <span>{{ scope.row.wifi }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateStatus" label="通讯状态">
            <template slot-scope="scope">
              <span>{{ scope.row.updateStatus | updateStatusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dataTime" label="数据时间">
            <template slot-scope="scope">
              <span>{{ scope.row.dataTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <el-table
          :data="[detailData]"
          v-loading="listLoading"
          border
          :stripe="true"
          height="0"
        ></el-table>
        <el-table
          :data="[detailData]"
          v-loading="listLoading"
          border
          :stripe="true"
        >
          <el-table-column prop="name" label="床名称">
            <template slot-scope="scope">
              <el-input v-if="isEdit" name="name" v-model="scope.row.name"></el-input>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="enableFlag" label="启用状态">
            <template slot-scope="scope">
              <el-select v-if="isEdit" v-model="scope.row.enableFlag" name="enableFlag">
                <el-option
                  v-for="item in enableFlag"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
              <span v-else>{{ scope.row.enableFlag | toEnableFlag }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="usageFlag" label="使用状态">
            <template slot-scope="scope">
              <span>{{ scope.row.usageFlag | toUsageFlag }}</span>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <el-table
          :data="[detailData]"
          v-loading="listLoading"
          border
          :stripe="true"
        >
          <el-table-column prop="type" label="锁类型" width="200">
            <template slot-scope="scope">
              <el-select v-if="isEdit" v-model="scope.row.type" name="type">
                <el-option
                  v-for="item in lockType"
                  :key="item.key"
                  :value="item.key"
                  :label="item.label"
                />
              </el-select>
              <span v-else>{{ scope.row.type | lockTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lockCode" label="锁编码" width="220">
            <template slot-scope="scope">
              <el-input v-if="isEdit" name="lockCode" v-model="scope.row.lockCode"></el-input>
              <span v-else>{{ scope.row.lockCode }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceId" label="设备编号">
            <template slot-scope="scope">
              <el-input v-if="isEdit" name="deviceId" v-model="scope.row.deviceId"></el-input>
              <span v-else>{{ scope.row.deviceId }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 投放信息 -->
      <div>
        <h3>投放信息</h3>
        <el-table
          :data="[detailData]"
          v-loading="listLoading"
          border
          :stripe="true"
        >
          <el-table-column prop="bedType" label="床类型">
            <template slot-scope="scope">
              <el-select v-if="isEdit" v-model="scope.row.bedType" name="bedType">
                <el-option
                  v-for="item in bedType"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
              <span v-else>{{ scope.row.bedType | bedTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="医院">
            <template slot-scope="scope">
              <el-select v-if="isEdit" v-model="scope.row.hospitalId" name="hospitalId">
                <el-option
                  v-for="(item, key) in hospital"
                  :key="key"
                  :label="item"
                  :value="Number(key)"
                ></el-option>
              </el-select>
              <span v-else>{{ scope.row.hospital }}</span>
            </template>
          </el-table-column>
          <el-table-column label="科室">
            <template slot-scope="scope">
              <el-select v-if="isEdit" v-model="scope.row.department" name="department">
                <el-option
                  v-for="depart in departmentList"
                  :key="depart.rowId"
                  :label="depart.name"
                  :value="depart.name"
                ></el-option>
              </el-select>
              <span v-else>{{ scope.row.department }}</span>
            </template>
          </el-table-column>
          <el-table-column label="详细位置">
            <template slot-scope="scope">
              <el-input v-if="isEdit" name="location" v-model="scope.row.location"></el-input>
              <span v-else>{{ scope.row.location }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn">
        <el-button v-if="!isEdit" type="danger" @click="handleToEdit">编辑</el-button>
        <el-button v-else type="success" @click="handleToDone">完成</el-button>
        <el-button type="primary" @click="handleToSave(detailData)">保存</el-button>
      </div>
    </el-dialog>

    <!-- 异常信息弹框Start -->
    <el-dialog title="异常处理" :visible.sync="errorDialogVisable">
      <el-form
        ref="form"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="床编号:">{{ temp.code }}</el-form-item>
        <el-form-item label="投放医院:">{{ temp.hospital }}</el-form-item>
        <el-form-item label="投放科室:">{{ temp.department }}</el-form-item>
        <el-form-item label="详细位置:">{{ temp.location }}</el-form-item>
        <el-form-item label="已启用:">{{ temp.enableFlag | toYesNo }}</el-form-item>
        <el-form-item label="使用中:">{{ temp.usageFlag | toYesNo }}</el-form-item>
        <el-form-item label="锁打开:">{{ temp.lockStatus | toYesNo }}</el-form-item>
        <el-form-item label="锁在线:">{{ temp.lockOnline | toYesNo }}</el-form-item>
        <el-form-item label="故障异常:">{{ temp.errorState | toYesNo }}</el-form-item>
        <el-form-item label="异常描述:">{{ temp.errorDesc }}</el-form-item>
        <el-form-item label="异常时间:">{{ temp.errorTime }}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="solveError(temp)">故障已解决</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   updateBed,
//   remoteOpen,
// } from "@/api/bed";
import { fetchList, queryStatus, getDetail, doEditBed, doEnable } from "@/api/bed/bed"
import { getHospitalList } from "@/api/hospital";
import { getDepartmentList } from "@/api/department";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import BatteryIcon from "./components/BatteryIcon";

export default {
  name: "ComplexTable",
  components: { Pagination, BatteryIcon },
  directives: { waves },
  filters: {
    usageFlagFilter(status) {
      const statusMap = {
        Y: "success",
        N: "info"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      bedType: this.GLOBAL.bedType,
      enableFlag: this.GLOBAL.enableFlag,
      usageFlagOptions: this.GLOBAL.usageFlag,
      lockType: this.GLOBAL.lockType,
      tableKey: 0,
      showLowBattery: false,
      showOffline: false, // 离线单选框
      hospital: null, // 医院
      departmentSearch: {},
      departmentList: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      temp: {},
      downloadLoading: false,
      errorDialogVisable: false,
      detailVisable: false, // 详情弹框
      detailData: {},
      isEdit: false // 详情 是否编辑
    };
  },
  created() {
    this.getList();
    this.getHasList();
    this.getDepartList();
  },
  methods: {
    sortChange() {},
    getList() {
      this.listLoading = true;
      // console.log("this.listQuery",this.listQuery)
      fetchList(this.listQuery).then(response => {
        // console.log('response', response)
        this.list = response.result.list;
        this.total = response.result.total;
        this.listLoading = false;
      });
    },
    // 医院
    getHasList() {
      getHospitalList().then(res => {
        let obj = {};
        res.result.forEach(function(item, index) {
          obj[String(item.rowId)] = item.code;
        });
        this.hospital = obj;
        // console.log("医院", this.hospital);
      });
    },
    // 科室
    getDepartList() {
      this.handleFilter();
      this.departmentSearch.hospitalId = this.listQuery.hospitalId;
      getDepartmentList(this.departmentSearch).then(response => {
        this.departmentList = response.result;
      });
    },
    // 查询
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 启用/停用
    updateEnable(row, enableFlag) {
      let comfirmMsg = "";
      let successMsg = "";
      let confirmTitle = "";
      if (enableFlag == "Y") {
        comfirmMsg = "即将启用" + row.code + "陪护床";
        confirmTitle = "启用陪护床";
        successMsg = "启用成功 (^-^)";
      } else {
        comfirmMsg = "即将停用" + row.code + "陪护床";
        confirmTitle = "停用陪护床";
        successMsg = "停用成功 (^-^)";
      }
      this.$confirm(comfirmMsg, confirmTitle, {
        confirmButtonText: "确认",
        cancelButtonText: "放弃",
        type: "warning"
      }).then(() => {
        // this.bed = Object.assign({}, row);
        // this.bed.enableFlag = enableFlag;
        doEnable({rowId: row.rowId}).then(() => {
          this.$notify({
            title: "成功",
            message: successMsg,
            type: "success",
            duration: 6000
          });
          this.handleFilter();
        }).catch(err=>{
          console.log(err)
        })
      }).catch(err=>{
        this.$message.info('已取消')
      })
    },
    showError(row) {
      this.temp = Object.assign({}, row);
      this.errorDialogVisable = true;
    },
    // 解决异常
    solveError(temp) {
      this.bed = Object.assign({}, temp);
      this.bed.lockOnline = "Y";
      this.bed.errorState = "N";
      this.bed.errorDesc = "无";
      this.bed.updateTime = new Date();
      updateBed(this.bed).then(() => {
        this.$notify({
          title: "成功",
          message: "解决异常成功",
          type: "success",
          duration: 6000
        });
        this.errorDialogVisable = false;
        this.handleFilter();
      });
    },
    // 查询
    handleQuery(row){
      queryStatus({rowId: row.rowId}).then(res=>{
        if(res.code == "00000000"){
          let result = JSON.parse(res.result)
          this.$alert(result.msg, res.message, {
            confirmButtonText: '确定',
            closeOnClickModal: true
          });
        }
      }).catch(err=>{
        this.$message.error(err)
      })
    },
    // 详情弹框
    dialogDetail(row) {
      getDetail({ bedId: row.rowId }).then(res => {
        this.detailData = res.result;
        this.detailVisable = true;
      });
      // this.detailData = row;
      // this.detailData = Object.assign({}, row); // 直接等会共用一个对象  编辑时有bug
    },
    // 编辑
    handleToEdit() {
      this.isEdit = true;
    },
    // 编辑完成
    handleToDone() {
      this.isEdit = false;
    },
    // 保存
    handleToSave(row) {
      doEditBed(row)
        .then(res => {
          this.$notify({
            title: "保存成功",
            message: "已保存该陪护床信息",
            type: "success",
            duration: 6000
          });
          this.detailVisable = false;
          this.isEdit = false
          this.getList();
        })
        .catch(err => {
          console.log(err);
          this.$message.error("保存失败，请重试！");
        });
    },
    // 开锁
    remoteOpen(row) {
      this.$confirm("是否确为" + row.code + "陪护床进行远程开锁", "远程开锁", {
        confirmButtonText: "确认",
        cancelButtonText: "放弃",
        type: "warning"
      }).then(() => {
        this.bed = Object.assign({}, row);
        remoteOpen(this.bed).then(() => {
          this.$notify({
            title: "成功",
            message: "远程开锁成功",
            type: "success",
            duration: 6000
          });
          this.handleFilter();
        });
      });
    },
    updateStatus(row, status) {
      this.$confirm(
        "Application Status Will Be Update From " +
          this.applicationStatusArr[row.status] +
          " To " +
          this.applicationStatusArr[status],
        "Application Update",
        {
          confirmButtonText: "Confirm Update",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      ).then(() => {
        this.application = Object.assign({}, row);
        this.application.status = status;
        updateApplication(this.application).then(() => {
          this.$notify({
            title: "SUCCESS",
            message: "Update Application Success (^-^)",
            type: "success",
            duration: 6000
          });
          this.handleFilter();
        });
      });
    },
    queryLowBattery() {
      if (this.showLowBattery == true) {
        this.listQuery.lowBattery = "1";
        this.handleFilter();
      } else {
        this.listQuery.lowBattery = "";
        this.handleFilter();
      }
    },
    queryOffline() {
      if (this.showOffline == true) {
        this.listQuery.updateStatus = "1";
        this.handleFilter();
      } else {
        this.listQuery.updateStatus = "";
        this.handleFilter();
      }
    },
    /* EXCEL导出start */
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "床编码",
          "医院",
          "科室",
          "地址",
          "使用状态",
          "启用状态",
          "床锁状态",
          "开锁次数",
          "信号强度",
          "电量",
          "数据时间"
        ];
        const filterVal = [
          "code",
          "hospital",
          "department",
          "location",
          "usageFlag",
          "enableFlag",
          "lockStatus",
          "openCount",
          "wifi",
          "battery",
          "updateTime"
        ];
        const data = this.formatJson(filterVal, this.list);
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "陪护床列表"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
    /* EXCEL导出End */
  }
};
</script>
<style lang="scss" scoped>
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>