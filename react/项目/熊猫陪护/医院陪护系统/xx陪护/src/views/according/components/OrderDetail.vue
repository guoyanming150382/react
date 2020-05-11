<template>
  <div class="app-container">
    <div>
      <div class="homeBtn">
        <el-button type="primary" @click="$router.go(-1)">返 回</el-button>
      </div>
      <!-- 订单信息 -->
      <div>
        <h3>订单信息</h3>
        <el-table
          :data="[list]"
          v-loading="listLoading"
          border
          :stripe="true"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="code" label="订单编号" align="center" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="订单类型" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.type | careOrderFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="careType" label="护理类型" align="center" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.careType!=2">{{ scope.row.careType | careTypeFilter }}</span>
              <span v-else>{{ scope.row.anyCareType | anyCareTypeFilter }}（随心护）</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="订单状态" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.status | orderStatusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="list.status==8||list.status==9||list.status==10" prop="cancelReason" label="取消原因" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.cancelReason }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="interviewTime" label="前往时间" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.interviewTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="下单时间" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 订单详情 -->
      <div>
        <h3>订单详情</h3>
        <el-table
          :data="[list]"
          v-loading="listLoading"
          border
          :stripe="true"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column v-if="list.careType!=2" prop="careStandard" label="护理级别" align="center" min-width="100" :key="Math.random()">
            <template slot-scope="scope">
              <span>{{ scope.row.careStandard | careStandardFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cusUnitPrice" label="护理费" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.cusUnitPrice }}{{scope.row.timeType==0?"元/天":"元/月"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="serveDays" :label="list.timeType==0?'服务天数':'每月休息'" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.serveDays }}天</span>
            </template>
          </el-table-column>
          <el-table-column prop="payMethod" label="付款方式" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.payMethod | payMethodFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cusWorkerGender" label="照护师性别" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.cusWorkerGender | cusGender }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="服务地址" align="center" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <!-- 随心护内容 -->
          <div v-if="careDetail">
            <el-table-column v-if="careDetail.hasMeal" :key="Math.random()" prop="careDetail.hasMeal" label="负责三餐" align="center" min-width="100">
              <template>
                <span>{{ careDetail.hasMeal | toYesNo }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.liveIn" :key="Math.random()" prop="careDetail.liveIn" label="是否住家" align="center" min-width="100">
              <template>
                <span>{{ careDetail.liveIn | toYesNo }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.walkDogHour" :key="Math.random()" prop="careDetail.walkDogHour" label="遛狗时长" align="center" min-width="100">
              <template>
                <span>{{ careDetail.walkDogHour }}小时</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.diningPeople" :key="Math.random()" prop="careDetail.diningPeople" label="用餐人数" align="center" min-width="100">
              <template>
                <span>{{ careDetail.diningPeople }}人</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.repairType" :key="Math.random()" prop="careDetail.repairType" label="维修类型" align="center" min-width="100">
              <template>
                <span>{{ careDetail.repairType==0?"水路":"电路" }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.cleanArea" :key="Math.random()" prop="careDetail.cleanArea" label="打扫面积" align="center" min-width="100">
              <template>
                <span>{{ careDetail.cleanArea }}m²</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.receiver_name" :key="Math.random()" prop="careDetail.receiver_name" label="接收人姓名" align="center" min-width="100">
              <template>
                <span>{{ careDetail.receiver_name }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.pick_pos" :key="Math.random()" prop="careDetail.pick_pos" label="取件位置" align="center" min-width="100">
              <template>
                <span>{{ careDetail.pick_pos }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.service_pos" :key="Math.random()" prop="careDetail.service_pos" label="送达位置" align="center" min-width="100">
              <template>
                <span>{{ careDetail.service_pos }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.service_time" :key="Math.random()" prop="careDetail.service_time" label="送达时间" align="center" min-width="150">
              <template>
                <span>{{ careDetail.service_time }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.pick_contact_phone" :key="Math.random()" prop="careDetail.pick_contact_phone" label="取件联系电话" align="center" min-width="120">
              <template>
                <span>{{ careDetail.pick_contact_phone }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="careDetail.receiver_phone" :key="Math.random()" prop="careDetail.receiver_phone" label="接收人电话" align="center" min-width="120">
              <template>
                <span>{{ careDetail.receiver_phone }}</span>
              </template>
            </el-table-column>
          </div>
          <!-- end -->
        </el-table>
        <div class="remark">
          <div v-if="list.cusReq"><span>定制需求：</span>{{list.cusReq}}</div>
          <div v-if="list.clientRemark"><span>订单备注：</span>{{list.clientRemark}}</div>
        </div>
      </div>
      <!-- 客户信息 -->
      <div>
        <h3>客户信息</h3>
        <el-table
          :data="[list]"
          v-loading="listLoading"
          border
          :stripe="true"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="customerShowAvatar" label="下单人" align="center" min-width="110">
            <template slot-scope="scope">
              <img class="avatar-s" :src="scope.row.customerShowAvatar" />
              <span>{{scope.row.customerName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientName" label="客户姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.clientName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="emeContactorPhone" label="联系电话" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.emeContactorPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientIdCard" label="客户身份证号" align="center" min-width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.clientIdCard }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientGender" label="客户性别" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.clientGender | toWorkerGender }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientAge" label="客户年龄" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.clientAge }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerRefereeType" label="推荐人类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.customerRefereeType | refereeType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerRefereeName" label="推荐人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.customerRefereeName?scope.row.customerRefereeName:'无' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerRefereeProfit" label="推荐人奖励" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.customerRefereeProfit }}元</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 抢单护工 -->
      <div v-if="workerList&&workerList.length>0">
        <h3>抢单护工</h3>
        <el-table
          :data="workerList"
          v-loading="listLoading"
          border
          style="width: 100%"
          :stripe="true"
          highlight-current-row
        >
          <el-table-column prop="workerName" label="护工姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerPhone" label="护工电话" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="抢单时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 护工信息 -->
      <div v-else>
        <h3>护工信息</h3>
        <el-table
          :data="[list]"
          v-loading="listLoading"
          border
          style="width: 100%"
          :stripe="true"
          highlight-current-row
        >
          <el-table-column prop="workerName" label="护工姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerIdCard" label="护工身份证" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerIdCard }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerPhone" label="护工电话" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerRefereeType" label="推荐人类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerRefereeType | refereeType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerRefereeName" label="推荐人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerRefereeName?scope.row.workerRefereeName:'无' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workerRefereeProfit" label="推荐人奖励" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workerRefereeProfit }}元</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 订单进度 -->
      <div>
        <h3>订单进度</h3>
        <el-table
          :data="[list]"
          v-loading="listLoading"
          border
          :stripe="true"
          highlight-current-row
        >
          <el-table-column prop="cusDue" label="客户欠费" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cusDue | toYesNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paidDays" label="已付天数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.paidDays }}天</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkDays" label="已结天数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.checkDays }}天</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="预期上工" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.startDate }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="list.timeType==0" prop="endDate" label="预期下工" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.endDate }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="list.timeType==0" prop="serveDays" label="预期天数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.serveDays }}天</span>
            </template>
          </el-table-column>
          <el-table-column prop="actStartDate" label="实际上工" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.actStartDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="actEndDate" label="实际下工" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.actEndDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="actServeDays" label="实际天数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.actServeDays }}天</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetail } from "@/api/careOrder";
import { fetchList, progress } from "@/api/careOrder";

export default {
  name: "orderdetail",
  data() {
    return {
      list: [],
      activeName: "first",
      listLoading: false,
      careType: "",
      careDetail: null,
      workerList: null, //已抢单护工
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const id = this.$route.query.id;
      if (id) {
        this.listLoading = true;
        getDetail({ rowId: id })
          .then(res => {
            if (res.result) {
              this.list = res.result.detail;
              this.workerList = res.result.workerList;
              this.careType = res.result.detail.careType;
              this.careDetail = JSON.parse(res.result.detail.careDetail)
              this.listLoading = false;
            } else {
              this.$message.error("无数据！");
              this.$router.go(-1);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$router.go(-1);
      }
    }
  },
  filters:{
    refereeType(status){
      const value = {
        0: '客户',
        1: '护工'
      }
      return value[status]
    }
  }
};
</script>

<style scoped>
h3 {
  color: #777;
}
.homeBtn {
  display: flex;
  justify-content: flex-end;
}
.remark{
  margin-top: 15px;
  line-height: 25px;
  color: #555;
}
.remark span{
  font-weight: 600;
  color: #666;
}
</style>