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
      <!-- <el-select
        v-model="listQuery.hospitalId"
        placeholder="医院"
        prop="hospitalId"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="(item, key) in hospital" :key="key" :label="item" :value="Number(key)" />
      </el-select> -->
      <el-select
        v-model="listQuery.careStandard"
        placeholder="护理级别"
        prop="careStandard"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in careStandard"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <!-- 列表 -->
    <el-table
      :data="feeList"
      v-loading="listLoading"
      border
      :stripe="true"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="workerName" align="center" label="护工姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.workerName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="hospitalId" align="center" label="医院" width="220">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.hospitalId | hospitalFilter }}</span>
          <el-select v-show="scope.row.isEdit" v-model="scope.row.hospitalId" name="hospitalId">
            <el-option
              v-for="(item, key) in hospital"
              :key="key"
              :label="item"
              :value="Number(key)"
            />
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column prop="careStandard" align="center" label="护理标准">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.careStandard | careStandardFilter }}</span>
          <el-select v-show="scope.row.isEdit" v-model="scope.row.careStandard" name="careStandard">
            <el-option
              v-for="item in careStandard"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="dayFee" align="center" label="日护理费">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.dayFee }}</span>
          <el-input v-show="scope.row.isEdit" name="dayFee" v-model="scope.row.dayFee"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="monthFee" align="center" label="月护理费">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.monthFee }}</span>
          <el-input v-show="scope.row.isEdit" name="monthFee" v-model="scope.row.monthFee"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" align="center" label="更新时间" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
          <!-- <el-input v-show="scope.row.isEdit" name="updateTime" v-model="scope.row.updateTime"></el-input> -->
        </template>
      </el-table-column>
      <!-- <el-table-column prop="singleFee12" align="center" label="12小时独单价格">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.singleFee12 }}</span>
          <el-input v-show="scope.row.isEdit" name="singleFee12" v-model="scope.row.singleFee12"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="shareFee12" align="center" label="12小时拼单价格">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.shareFee12 }}</span>
          <el-input v-show="scope.row.isEdit" name="shareFee12" v-model="scope.row.shareFee12"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="singleFee24" align="center" label="24小时独单价格">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.singleFee24 }}</span>
          <el-input v-show="scope.row.isEdit" name="singleFee24" v-model="scope.row.singleFee24"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="shareFee24" align="center" label="24小时拼单价格">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.shareFee24 }}</span>
          <el-input v-show="scope.row.isEdit" name="shareFee24" v-model="scope.row.shareFee24"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="acceptShare" align="center" label="是否接受拼单" width="120">
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.acceptShare | acceptShareFilter }}</span>
          <el-select v-show="scope.row.isEdit" v-model="scope.row.acceptShare" name="acceptShare">
            <el-option value="Y" label="是" />
            <el-option value="N" label="否" />
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="170">
        <template slot-scope="scope">
          <el-button
            v-show="!scope.row.isEdit"
            @click="handleToEdit(scope.row)"
            type="primary"
            size="small"
          >编辑</el-button>
          <el-button
            v-show="scope.row.isEdit"
            @click="handleToDone(scope.row)"
            type="success"
            size="small"
          >完成</el-button>
          <!-- <el-button @click="handleToAdd(scope.row)" type="primary" size="small">新增</el-button> -->
          <el-button @click="handleToDelete(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="fixed"></div>
    <!-- 新增弹框 -->
    <!-- <div>
      <el-dialog
        title="新增费用"
        :visible.sync="dialogFeeVisible"
        width="90%"
        :before-close="handleToFeeClose"
      >
        <el-table
          ref="selected"
          :data="addList"
          v-loading="listLoading"
          border
          :stripe="true"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="hospitalId" align="center" label="医院" width="220">
            <template slot-scope="scope">
              <el-select v-model="scope.row.hospitalId" name="hospitalId">
                <el-option
                  v-for="(item, key) in hospital"
                  :key="key"
                  :label="item"
                  :value="Number(key)"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="careStandard" align="center" label="护理等级" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.careStandard" name="careStandard">
                <el-option
                  v-for="item in careStandard"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="singleFee12" align="center" label="12小时独单价格">
            <template slot-scope="scope">
              <el-input name="singleFee12" v-model="scope.row.singleFee12"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="shareFee12" align="center" label="12小时拼单价格">
            <template slot-scope="scope">
              <el-input name="shareFee12" v-model="scope.row.shareFee12"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="singleFee24" align="center" label="24小时独单价格">
            <template slot-scope="scope">
              <el-input name="singleFee24" v-model="scope.row.singleFee24"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="shareFee24" align="center" label="24小时拼单价格">
            <template slot-scope="scope">
              <el-input name="shareFee24" v-model="scope.row.shareFee24"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="acceptShare" align="center" label="是否接受拼单" width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.acceptShare" name="acceptShare">
                <el-option value="Y" label="是" />
                <el-option value="N" label="否" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button @click="toDelete(scope.$index, addList)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="submit">
          <el-button @click="add(addList)" type="primary">新 增</el-button>
          <el-button @click="handleToSave(addList)" type="primary">保 存</el-button>
        </div>
        <div class="fixed"></div>
      </el-dialog>
    </div>-->
    <div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFeeVisible"
        width="70%"
        :before-close="handleToFeeClose"
      >
        <div style="margin: 5px;margin-top:-20px;">
          <el-button size="mini" @click="handleCheckAll">全选</el-button>
          <el-button size="mini" @click="handleCancel">全部取消</el-button>
        </div>
        <el-checkbox-group
          class="checkbox"
          size="mini"
          v-model="checkHospotal"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="(item, key) in hospital"
            :label="key"
            :key="key"
            :border="true"
          >{{item}}</el-checkbox>
        </el-checkbox-group>
        <el-table
          ref="selected"
          :data="addList"
          v-loading="listLoading"
          border
          empty-text="请先选择医院"
          :stripe="true"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="careStandard" align="center" label="护理等级" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.careStandard" name="careStandard">
                <el-option
                  v-for="item in careStandard"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="singleFee12" align="center" label="12小时独单价格">
            <template slot-scope="scope">
              <el-input name="singleFee12" v-model="scope.row.singleFee12"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="shareFee12" align="center" label="12小时拼单价格">
            <template slot-scope="scope">
              <el-input name="shareFee12" v-model="scope.row.shareFee12"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="singleFee24" align="center" label="24小时独单价格">
            <template slot-scope="scope">
              <el-input name="singleFee24" v-model="scope.row.singleFee24"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="shareFee24" align="center" label="24小时拼单价格">
            <template slot-scope="scope">
              <el-input name="shareFee24" v-model="scope.row.shareFee24"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="acceptShare" align="center" label="是否接受拼单" width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.acceptShare" name="acceptShare">
                <el-option value="Y" label="是" />
                <el-option value="N" label="否" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button @click="toDelete(scope.$index, addList)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="submit">
          <el-button @click="handleToSave(addList)" type="primary">保 存</el-button>
        </div>
        <div class="fixed"></div>
      </el-dialog>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getFeeList"
    />
  </div>
</template>

<script>
import {
  getFeeList,
  editFeeList,
  updateFeeList,
  hospitalFeeBatch
} from "@/api/nurse";
import { getHasNurseList } from "@/api/hospital";
import { getHosFeeList, doHosFeeUpdate, doHosFeeDelete } from "@/api/worker/worker";
import Pagination from "@/components/Pagination";
var that;
export default {
  name: "feeList",
  data() {
    return {
      careStandard: this.GLOBAL.careStandard,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      hospital: null, // 医院
      rowId: "",
      feeList: null, // 费用明细
      hasNurseList: null, // 医院列表
      dialogFeeVisible: false, //新增弹框
      addList: [], // 新增弹框数据
      checkHospotal: [], // 选择的医院
      dialogTitle: "" // 弹框title
    };
  },
  beforeCreate() {
    that = this;
  },
  created() {
    this.getFeeList();
    // this.getHasList();
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getFeeList();
    },
    // 费用列表
    getFeeList() {
      this.listLoading = true;
      getHosFeeList(this.listQuery).then(res => {
        this.feeList = res.result.list;
        this.total = res.result.total;
        this.listLoading = false;
        // console.log("费用", this.feeList);
      });
    },
    //医院列表
    getHasList() {
      getHasNurseList().then(res => {
        this.hasNurseList = res.result;
        let obj = {};
        res.result.forEach(function(item, index) {
          obj[String(item.rowId)] = item.code;
        });
        this.hospital = obj;
        // console.log("医院", this.hospital);
      });
    },
    handleToEdit(row) {
      this.$set(row, "isEdit", true);
    },
    // 行内编辑完成
    handleToDone(row) {
      this.$set(row, "isEdit", false);
      // console.log(row);
      doHosFeeUpdate(row)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "更新费用明细成功 (^-^)",
            type: "success",
            duration: 6000
          });
          this.getFeeList();
        })
        .catch(err => {
          console.log(err);
          this.getFeeList();
        });
    },
    // 添加弹框中删除一条
    toDelete(index, row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          row.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    // 删除一条费用
    handleToDelete(row) {
      // console.log(row);
      const rowId = row.rowId; 
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          doHosFeeDelete({ rowId })
            .then(res=>{
              this.$notify({
                title: "成功",
                message: "删除护工费用明细成功 (^-^)",
                type: "success",
                duration: 6000
              });
              this.getFeeList();
            })
            .catch(err=>{
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    //添加弹框
    handleToAdd(row) {
      this.dialogFeeVisible = true;
      this.rowId = row.workerId;
      this.dialogTitle = row.workerName + "  的费用明细";
      // console.log(row);
    },
    //添加弹框中加一条
    add() {
      var l = this.addList.length;
      this.addList[l] = {
        workerId: this.rowId,
        careStandard: "0",
        acceptShare: "Y"
      }; //直接在数组中添加一项不会更新视图
      this.addList[l + 1] = {};
      this.addList.splice(l + 1, 1);
      this.$refs["selected"].setCurrentRow(this.addList[l]);
    },
    handleToFeeClose() {
      this.dialogFeeVisible = false;
      this.addList = [];
      this.checkHospotal = [];
    },
    //批量添加
    handleToSave(row) {
      if (this.checkHospotal.length < 1) {
        return this.$message.error("请先选择医院!");
      }
      const data = {
        hospitalList: this.checkHospotal,
        workerId: this.rowId,
        feeList: row
      };
      // console.log(data);
      const loading = this.$loading({
        lock: true,
        text: "正在保存...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      hospitalFeeBatch(data)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "批量插入护工医院费用明细成功 (^-^)",
            type: "success",
            duration: 6000
          });
          this.addList = [];
          this.checkHospotal = [];
          loading.close();
          this.dialogFeeVisible = false;
          this.getFeeList();
        })
        .catch(err => {
          loading.close();
          console.log(err);
        });
    },
    // check
    handleCheckedChange() {
      // console.log(this.checkHospotal);
      if (this.checkHospotal.length > 0) {
        if (this.addList.length > 0) {
          return;
        } else {
          this.addList = [
            { careStandard: "0", acceptShare: "Y" },
            { careStandard: "1", acceptShare: "Y" },
            { careStandard: "2", acceptShare: "Y" }
          ];
        }
      } else {
        this.addList = [];
      }
    },
    // 全选
    handleCheckAll() {
      // console.log(this.checkHospotal)
      this.addList = [
        { careStandard: "0", acceptShare: "Y" },
        { careStandard: "1", acceptShare: "Y" },
        { careStandard: "2", acceptShare: "Y" }
      ];
      this.checkHospotal = Object.keys(this.hospital);
    },
    // 取消全选
    handleCancel() {
      this.addList = [];
      this.checkHospotal = [];
    }
  },
  filters: {
    acceptShareFilter(status) {
      const statusMap = {
        Y: "是",
        N: "否"
      };
      return statusMap[status];
    },
    hospitalFilter(status) {
      const statusMap = that.hospital;
      return statusMap[status];
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss" scope>
.fixed {
  height: 0;
  clear: both;
}
.submit {
  float: right;
  margin: 20px;
}
.checkbox {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  label {
    margin: 5px;
  }
}
</style>