<template>
  <div class="app-container">
    <div class="homeBtn" style="float: right">
      <el-button v-if="list.inviteUrl" type="primary" @click="downloadImg">下载推广码</el-button>
      <el-button v-if="disabled" type="danger" style="margin: 10px;" @click="()=>{disabled = Boolean(false)}">编 辑</el-button>
      <el-button v-else type="success" style="margin: 10px;" @click="$router.go(-1)">保 存</el-button>
      <el-button type="primary" style="margin: 10px;" @click="$router.go(-1)">返 回</el-button>
    </div>
    <el-form label-width="90px" :model="list">
      <el-form-item prop="showAvatar" label="头像">
        <upload
          :disabled="true"
          class="avatar-uploader"
          :rowId="String(list.rowId)"
          :imgUrl="list.showAvatar"
          :id="1"
        ></upload>
      </el-form-item>
      <br />
      <el-form-item :prop="list.showNickName" label="昵称">
        <el-input
          name="showNickName"
          :readonly="disabled"
          v-model="list.showNickName"
          style="width:220px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="source" label="来源">
        <el-select v-model="list.source" name="source" :disabled="disabled">
          <el-option
            v-for="item in sourceFilter"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="inviteUrl" label="推广链接">
        <el-input
          name="inviteUrl"
          :readonly="true"
          v-model="list.inviteUrl"
          style="width:310px"
          onfocus="this.select()"
        ></el-input>
      </el-form-item>
      <el-form-item prop="country" label="国籍">
        <el-input name="country" :readonly="disabled" v-model="list.country" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="province" label="省份">
        <el-input name="province" :readonly="disabled" v-model="list.province" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="city" label="地区">
        <el-input name="city" :readonly="disabled" v-model="list.city" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="isVip" label="床Vip">
        <el-radio name="isVip" :disabled="disabled" v-model="list.isVip" label="Y">是</el-radio>
        <el-radio name="isVip" :disabled="disabled" v-model="list.isVip" label="N">否</el-radio>
      </el-form-item>
      <el-form-item prop="city" label="熊猫VIP">
        <el-radio name="isCareVip" :disabled="disabled" v-model="list.isCareVip" label="Y">是</el-radio>
        <el-radio name="isCareVip" :disabled="disabled" v-model="list.isCareVip" label="N">否</el-radio>
      </el-form-item>
      <el-form-item prop="isPhoneAuth" label="手机认证">
        <el-radio name="isPhoneAuth" :disabled="disabled" v-model="list.isPhoneAuth" label="Y">是</el-radio>
        <el-radio name="isPhoneAuth" :disabled="disabled" v-model="list.isPhoneAuth" label="N">否</el-radio>
      </el-form-item>
      <el-form-item prop="refereeName" v-if="list.refType" label="推荐人">
        <el-input
          name="refereeName"
          :readonly="disabled"
          v-model="list.refereeName"
          style="width:310px"
        ></el-input>{{list.refType==1||list.refType==3?"(护)":""}}
      </el-form-item>
      <el-form-item prop="refUserTotal" label="推广人数">
        <el-input
          name="refUserTotal"
          :readonly="disabled"
          v-model="list.refUserTotal"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="refOrderTotal" label="推广订单">
        <el-input name="refOrderTotal" :readonly="disabled" v-model="list.refOrderTotal" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="cashAcc" label="现金券">
        <el-input name="cashAcc" :readonly="disabled" v-model="list.cashAcc" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="balanceAcc" label="余额">
        <el-input
          name="balanceAcc"
          :readonly="disabled"
          v-model="list.balanceAcc"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="firstLocDesc" label="首次位置">
        <el-input
          name="firstLocDesc"
          :readonly="disabled"
          v-model="list.firstLocDesc"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="firstLocTime" label="首次时间">
        <el-input
          name="firstLocTime"
          :readonly="disabled"
          v-model="list.firstLocTime"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="latestLocDesc" label="最近位置">
        <el-input
          name="latestLocDesc"
          :readonly="disabled"
          v-model="list.latestLocDesc"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="latestLocTime" label="最近时间">
        <el-input
          name="latestLocTime"
          :readonly="disabled"
          v-model="list.latestLocTime"
          style="width:310px"
        ></el-input>
      </el-form-item>
    </el-form>
    <vue-qr
      ref="Qrcode" 
      :text="list.inviteUrl" 
      :size="200"
      :correctLevel="0"
      :logoSrc="img"
      :margin="8"
      :logoScale="0.25"
      :logoMargin="3"
    ></vue-qr>
  </div>
</template>

<script>
import { fetchList, customerDetail } from "@/api/customer";
import upload from "@/components/Upload/upload";
import vueQr from 'vue-qr'

export default {
  name: "customerDetail",
  data() {
    return {
      sourceFilter: this.GLOBAL.sourceFilter,
      profitStatus: this.GLOBAL.profitStatus,
      listLoading: true,
      list: null,
      disabled: true,
      img: require('../../../assets/images/logo.jpg')
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      const id = this.$route.query.id;
      customerDetail(id).then(res => {
        this.list = res.result;
        this.listLoading = false;
      });
    },
    downloadImg () {
      const iconUrl = this.$refs.Qrcode.$el.src
      let a = document.createElement('a')
      let event = new MouseEvent('click')
      a.download = this.list.showNickName
      a.href = iconUrl
      a.dispatchEvent(event)
    }
  },
  components: {
    upload,
    vueQr
  }
};
</script>

<style>
.el-form-item {
  display: inline-block;
  min-width: 400px;
  margin-left: 20px;
}
</style>