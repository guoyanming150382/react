<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-select
        v-model="listQuery.workerGender"
        placeholder="照护师性别"
        prop="workerGender"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in cusGender" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="订单状态"
        prop="status"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in orderStatusG"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <!-- <el-button
        class="filter-item"
        type="success"
        icon="el-icon-plus"
        @click="dialogAdd('ValidateForm')"
      >新增</el-button>-->
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
          label="订单编号"
          align="center"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center" width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="careType" label="类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.careType | careTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clientName" label="客户名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.clientName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dayCareFee" label="单价（元/天）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dayCareFee }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serveDays" label="周期（天）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.serveDays }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hasMeal" label="是否含餐" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hasMeal | toYesNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderFee" label="总价" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderFee }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workerGender" label="照护师" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.workerGender"
              :type="scope.row.workerGender | genderFilter"
            >{{ scope.row.workerGender | cusGender }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="clientGender" label="被护理人" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.clientGender"
              :type="scope.row.clientGender | genderFilter"
            >{{ scope.row.clientGender | toWorkerGender }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalAccept" label="抢单数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalAccept }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="订单状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | cusOrderStatusFilter">{{ scope.row.status | cusOrderStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-button type="primary" @click="showDetail(scope.row)" size="small">详情</el-button>
            <el-button
              type="danger"
              v-if="scope.row.status=='2'"
              @click="handleUndo(scope.row.rowId)"
              size="small"
            >撤销</el-button>
            <el-button
              type="success"
              v-if="scope.row.status=='2' && scope.row.totalAccept!=0"
              @click="getCusOrderList(scope.row.rowId)"
              size="small"
            >分派</el-button>
            <!-- <el-button
              type="primary"
              v-if="scope.row.status == '1'"
              @click="publish('ValidateForm', scope.row)"
              size="small"
            >发布</el-button>
            <el-button
              type="danger"
              v-if="scope.row.status == '1'"
              @click="rejectPublish(scope.row.rowId)"
              size="small"
            >驳回</el-button>
            <el-tag
              type="success"
              v-else-if="scope.row.status == '2' && scope.row.totalAccept<=0"
            >已发布</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status == '3'">已驳回</el-tag>
            <el-tag v-else-if="scope.row.status == '4'">已接单</el-tag>
            <el-tag v-else>无操作</el-tag>-->
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
      @pagination="fetchList"
    />
    <!-- 详情弹框 -->
    <div>
      <el-dialog :visible.sync="detailVisible" width="900px" :before-close="handleClose">
        <h2>订单信息 </h2>
        <el-table :data="detail" border :stripe="true" highlight-current-row style="width: 100%">
          <el-table-column prop="code" label="订单编号" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="下单时间" align="center" width="170">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status | cusOrderStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="careType" label="护理类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.careType | careTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dayCareFee" label="日护理费" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.dayCareFee }}元/天</span>
            </template>
          </el-table-column>
          <el-table-column prop="serveDays" label="周期" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.serveDays }}天</span>
            </template>
          </el-table-column>
          <el-table-column prop="hasMeal" label="含餐" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.hasMeal | toYesNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderFee" label="总价" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.orderFee }}元</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalAccept" label="抢单人数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.totalAccept }}</span>
            </template>
          </el-table-column>
        </el-table>
        <h2>客户信息</h2>
        <el-table :data="detail" border :stripe="true" highlight-current-row style="width: 100%">
          <el-table-column prop="customerAvatarUrl" label="微信头像" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.customerAvatarUrl"
                style="width:35px;height:35px;border-radius:50%;"
                :src="scope.row.customerAvatarUrl"
              />
              <span v-else>未上传</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="微信昵称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.customerName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientName" label="姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.clientName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="careStandard" label="健康状况" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.careStandard | careStandardFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientGender" label="性别" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.clientGender | toWorkerGender }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientAge" label="年龄" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.clientAge }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientIdCard" label="身份证号" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.clientIdCard }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="emeContactorPhone" label="联系号码" align="center" width="110">
            <template slot-scope="scope">
              <span>{{ scope.row.emeContactorPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
        </el-table>
        <h2>照护师信息</h2>
        <el-table :data="detail" border :stripe="true" highlight-current-row style="width: 100%">
          <el-table-column prop="workerAvatarUrl" label="照护师头像" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.workerAvatarUrl"
                style="width:35px;height:35px;border-radius:50%;"
                :src="scope.row.workerAvatarUrl"
              />
              <span v-else>未上传</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerGender" label="性别要求" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerGender | cusGender }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerOrderFee" label="照护师价格" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerOrderFee }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerName" label="照护师姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <!-- 新增定制单弹框 -->
    <!-- <div class="cusorder">
      <el-dialog
        title="新增定制单"
        :visible.sync="dialogVisible"
        width="755px"
        :before-close="handleClose"
      >
        <el-form ref="ValidateForm" label-width="110px" :model="row" :rules="rules">
          <el-form-item prop="unitPrice" label="单价">
            <el-input name="unitPrice" v-model.number="row.unitPrice" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="timeType" label="时间类型">
            <el-select prop="timeType" v-model="row.timeType" style="width: 220px;" clearable>
              <el-option
                v-for="item in timeTypeG"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="emeContactorPhone" label="联系电话">
            <el-input name="emeContactorPhone" v-model="row.emeContactorPhone" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="hasMeal" label="是否含餐">
            <el-select prop="hasMeal" v-model="row.hasMeal" style="width: 220px;" clearable>
              <el-option
                v-for="item in yesNo"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="timeLength" label="时间周期">
            <el-input name="timeLength" v-model.number="row.timeLength" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="careStandard" label="护理级别">
            <el-select
              prop="careStandard"
              v-model="row.careStandard"
              style="width: 220px;"
              clearable
            >
              <el-option
                v-for="item in careStandard"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="clientAge" label="被护理人年龄">
            <el-input name="clientAge" v-model.number="row.clientAge" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="workerGender" label="护工性别">
            <el-select
              prop="workerGender"
              v-model="row.workerGender"
              style="width: 220px;"
              clearable
            >
              <el-option
                v-for="item in cusGender"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="address" label="所在医院">
            <el-input name="address" v-model="row.address" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="clientGender" label="被护理人性别">
            <el-select
              prop="clientGender"
              v-model="row.clientGender"
              style="width: 220px;"
              clearable
            >
              <el-option
                v-for="item in workerGender"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="extraReq" label="其他要求">
            <el-input
              type="textarea"
              rows="3"
              name="extraReq"
              v-model="row.extraReq"
              style="width:220px"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="handleRelease('ValidateForm', row)"
          type="primary"
          style="float:right;margin-right:10px;"
        >确定</el-button>
        <div class="fix"></div>
      </el-dialog>
    </div>-->
    <!-- 抢单护工弹框 -->
    <div class="cusorder">
      <el-dialog title="已抢单护工" :visible.sync="dialogCusOrderVisible" width="755px">
        <el-table
          :data="cusOrderList"
          v-loading="listLoading"
          border
          :stripe="true"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="workerAvatarUrl" label="头像" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.workerAvatarUrl"
                style="width:35px;height:35px;border-radius:50%;"
                :src="scope.row.workerAvatarUrl"
                alt
              />
              <span v-else>未上传</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerName" label="护工姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerPhone" label="手机号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="抢单时间" align="center" width="170">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="170">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="confirmOrder(scope.row.workerName, scope.row.cusOrderId, scope.row.workerId)"
                size="small"
              >派单</el-button>
              <el-button
                type="danger"
                @click="removeWorker(scope.row.workerName, scope.row.rowId)"
                size="small"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <!-- 发布订单弹框 -->
    <!-- <div class="cusorder">
      <el-dialog title="发布定制单" :visible.sync="dialogPublishVisible" :before-close="handleClose" width="755px">
        <el-form ref="ValidateForm" label-width="110px" :model="data" :rules="rules">
          <el-form-item prop="unitPrice" label="单价">
            <el-input name="unitPrice" v-model.number="data.unitPrice" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="timeType" label="时间类型">
            <el-select prop="timeType" v-model="data.timeType" style="width: 220px;" clearable>
              <el-option
                v-for="item in timeTypeG"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="emeContactorPhone" label="联系电话">
            <el-input name="emeContactorPhone" v-model="data.emeContactorPhone" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="hasMeal" label="是否含餐">
            <el-select prop="hasMeal" v-model="data.hasMeal" style="width: 220px;" clearable>
              <el-option
                v-for="item in yesNo"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="timeLength" label="时间周期">
            <el-input name="timeLength" v-model.number="data.timeLength" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="careStandard" label="护理级别">
            <el-select
              prop="careStandard"
              v-model="data.careStandard"
              style="width: 220px;"
              clearable
            >
              <el-option
                v-for="item in careStandard"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="clientAge" label="被护理人年龄">
            <el-input name="clientAge" v-model.number="data.clientAge" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="workerGender" label="护工性别">
            <el-select
              prop="workerGender"
              v-model="data.workerGender"
              style="width: 220px;"
              clearable
            >
              <el-option
                v-for="item in cusGender"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="address" label="所在医院">
            <el-input name="address" v-model="data.address" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item prop="clientGender" label="被护理人性别">
            <el-select
              prop="clientGender"
              v-model="data.clientGender"
              style="width: 220px;"
              clearable
            >
              <el-option
                v-for="item in workerGender"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="extraReq" label="其他要求">
            <el-input
              type="textarea"
              rows="3"
              name="extraReq"
              v-model="data.extraReq"
              style="width:220px"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="handlePublish('ValidateForm', data)"
          type="primary"
          style="float:right;margin-right:10px;"
        >发布</el-button>
        <div class="fix"></div>
      </el-dialog>
    </div>-->
  </div>
</template>

<script>
import {
  getCustomOrder,
  createCusOrder,
  doPublishOrder,
  getCusOrderList,
  cusOrderConfirm,
  rejectPublish,
  removeCusWorker
} from "@/api/worker/worker";
import Pagination from "@/components/Pagination";
import { checkPhone, checkAge } from "@/utils/validate.js";

export default {
  name: "customOrder",
  data() {
    return {
      careStandard: this.GLOBAL.careStandard,
      yesNo: this.GLOBAL.yesNo,
      cusGender: this.GLOBAL.cusGender,
      workerGender: this.GLOBAL.workerGender,
      timeTypeG: this.GLOBAL.timeTypeG,
      peopleTypeG: this.GLOBAL.peopleTypeG,
      orderStatusG: this.GLOBAL.orderStatusG,
      listLoading: true,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        status: "2"
      },
      list: null, // 列表数据
      row: {}, // 新增定制单
      data: {}, //发布弹框数据
      detail: [], //详情弹框数据
      dialogVisible: false,
      dialogCusOrderVisible: false,
      dialogPublishVisible: false,
      detailVisible: false,
      cusOrderList: null, // 抢单人列表
      rules: {
        unitPrice: [
          { required: true, message: "该项必填", trigger: "blur" },
          { type: "number", message: "单价必须是数字", trigger: "blur" }
        ],
        timeType: [{ required: true, message: "该项必选", trigger: "change" }],
        workerGender: [
          { required: true, message: "该项必选", trigger: "change" }
        ],
        timeLength: [
          { required: true, message: "该项必填", trigger: "blur" },
          { type: "number", message: "时间周期必须是数字", trigger: "blur" }
        ],
        hasMeal: [{ required: true, message: "该项必选", trigger: "change" }],
        clientAge: [
          { required: true, message: "该项必填", trigger: "blur" },
          { validator: checkAge, trigger: "blur" }
        ],
        clientGender: [
          { required: true, message: "该项必选", trigger: "change" }
        ],
        careStandard: [
          { required: true, message: "该项必选", trigger: "change" }
        ],
        address: [{ required: true, message: "该项必填", trigger: "blur" }],
        emeContactorPhone: [
          { required: true, message: "该项必填", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    handleFilter() {
      this.fetchList();
    },
    fetchList() {
      this.listLoading = true;
      getCustomOrder(this.listQuery).then(res => {
        this.list = res.result.list;
        this.total = res.result.total;
        this.listLoading = false;
        // console.log(this.list);
      });
    },
    dialogAdd(formName) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields(); //等弹窗里的form表单的dom渲染完在执行,去除验证
        this.row = {};
      });
    },
    handleClose(done) {
      this.row = {};
      this.data = {};
      this.detail = [];
      done();
    },
    //详情弹框
    showDetail(row) {
      this.detail.push(row);
      this.detailVisible = true;
    },
    // 派单
    confirmOrder(name, orderId, workerId) {
      this.$confirm(`确定把此订单派给 ${name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          cusOrderConfirm({ orderId, workerId }).then(res => {
            this.$notify({
              title: "成功",
              message: "定制单派单成功 (^-^)",
              type: "success",
              duration: 6000
            });
            this.dialogCusOrderVisible = false;
            this.fetchList();
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    //移除已抢单护工
    removeWorker(name, rowId) {
      this.$confirm(`确定要移除 ${name} 么?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          removeCusWorker({ rowId })
            .then(res => {
              this.$notify({
                title: "成功",
                message: `移除护工${name}成功`,
                type: "success",
                duration: 6000
              });
              this.dialogCusOrderVisible = false;
              this.fetchList();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    //撤销订单
    handleUndo(rowId) {
      console.log(rowId);
    },
    // 保存新定制单
    // handleRelease(formName, row) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       this.$confirm("确定新增新的定制单?", "提示", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "success"
    //       })
    //         .then(() => {
    //           if (!row.extraReq || row.extraReq == null || row.extraReq == "") {
    //             row.extraReq = "无";
    //           }
    //           createCusOrder(row)
    //             .then(res => {
    //               this.$notify({
    //                 title: "成功",
    //                 message: "新增定制单成功 (^-^)",
    //                 type: "success",
    //                 duration: 6000
    //               });
    //               this.fetchList();
    //               this.dialogVisible = false;
    //             })
    //             .catch(err => {
    //               console.log(err);
    //             });
    //         })
    //         .catch(() => {
    //           this.$message.info("已取消");
    //         });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // 发布定制单
    // publish(formName, data) {
    //   if(this.$refs[formName]){
    //     this.$nextTick(() => {
    //       this.$refs[formName].resetFields(); //等弹窗里的form表单的dom渲染完在执行,去除验证
    //     });
    //   }
    //   this.dialogPublishVisible = true;
    //   this.data = Object.assign({}, data)
    // },
    // handlePublish(formName, data){
    //   if(data.unitPrice && Number(data.unitPrice)>=0 && data.unitPrice!=="" && data.unitPrice!==" "){
    //     data.unitPrice = Number(data.unitPrice)
    //   }
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       this.$confirm("确定发布此定制单?", "提示", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "success"
    //       })
    //       .then(() => {
    //         doPublishOrder(data).then(() => {
    //           this.$notify({
    //             title: "成功",
    //             message: "发布定制单成功 (^-^)",
    //             type: "success",
    //             duration: 6000
    //           });
    //           this.dialogPublishVisible = false
    //           this.fetchList();
    //         });
    //       })
    //       .catch(() => {
    //         this.$message.info("已取消");
    //       });
    //     }
    //   })
    // },
    // rejectPublish(id) {
    //   this.$confirm("确定驳回此定制单?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "success"
    //   })
    //     .then(() => {
    //       rejectPublish({ orderId: id }).then(() => {
    //         this.$notify({
    //           title: "成功",
    //           message: "已驳回定制单 (^-^)",
    //           type: "success",
    //           duration: 6000
    //         });
    //         this.fetchList();
    //       });
    //     })
    //     .catch(() => {
    //       this.$message.info("已取消");
    //     });
    // },
    // 查看定制单抢单人列表
    getCusOrderList(id) {
      getCusOrderList({ orderId: id })
        .then(res => {
          this.cusOrderList = res.result;
          this.dialogCusOrderVisible = true;
          // console.log(this.cusOrderList);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  filters: {
    genderFilter(status) {
      const statusMap = {
        0: "danger",
        1: "primary",
        2: "success"
      };
      return statusMap[status];
    },
    cusOrderStatusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'warning',
        2: 'primary',
        3: 'success',
        4: 'danger',
        5: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss">
.fix {
  height: 0;
  clear: both;
}
.cusorder {
  .el-form-item {
    display: inline-block;
    min-width: 350px;
  }
}
</style>