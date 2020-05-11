<template>
  <div class="detail">
    <el-form
      ref="ValidateForm"
      :rules="rules"
      label-width="100px"
      style="margin-top: 20px;"
      :model="row"
    >
      <el-form-item prop="avatarUrl" label="头像">
        <el-button
          v-if="row.avatarUrl"
          type="primary"
          size="mini"
          plain
          @click="dialogPic(row.avatarUrl)"
        >点击查看大图</el-button>
        <upload
          class="avatar-uploader"
          :disabled="disabled"
          :rowId="String(row.rowId)"
          :imgUrl="row.avatarUrl"
          :newImgUrl="row.newAvatar"
          :id="1"
          @getUrl="getAvatarUrl"
        ></upload>
      </el-form-item>
      <div class="homeBtn" style="float: right">
        <el-button v-if="row.inviteUrl" type="primary" style="margin: 10px;" @click="downloadImg">下载推广码</el-button>
        <el-button v-if="isEdit" type="danger" style="margin: 10px;" @click="handleToEdit">编辑</el-button>
        <el-button v-show="!disabled" type="danger" style="margin: 10px;" @click="handleDelete">删除</el-button>
        <el-button
          v-show="!disabled"
          style="margin: 20px;"
          type="success"
          @click="handleToSave('ValidateForm')"
        >保 存</el-button>
        <el-button type="primary" style="margin: 10px;" @click="$router.go(-1)">返 回</el-button>
      </div>
      <br />
      <el-form-item prop="loginName" label="登录名">
        <el-input name="loginName" :disabled="true" v-model="row.loginName" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="createTime" label="注册时间">
        <el-date-picker
          name="createTime"
          :disabled="true"
          v-model="row.createTime"
          type="datetime"
          default-time="12:00:00"
          placeholder="设置注册时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="inviteUrl" label="推广链接">
        <el-input
          name="inviteUrl"
          :readonly="true"
          v-model="row.inviteUrl"
          style="width:310px"
          onfocus="this.select()"
        ></el-input>
      </el-form-item>
      <el-form-item prop="recom" label="主推">
        <el-radio name="recom" :disabled="disabled" v-model="row.recom" label="Y">是</el-radio>
        <el-radio name="recom" :disabled="disabled" v-model="row.recom" label="N">否</el-radio>
      </el-form-item>
      <el-form-item prop="allRound" label="全能">
        <el-radio name="allRound" :disabled="disabled" v-model="row.allRound" label="Y">是</el-radio>
        <el-radio name="allRound" :disabled="disabled" v-model="row.allRound" label="N">否</el-radio>
      </el-form-item>
      <el-form-item prop="recomWeight" label="推荐权重">
        <el-input name="recomWeight" :disabled="disabled" v-model="row.recomWeight" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-select v-model="row.type" name="type" :disabled="disabled">
          <el-option label="护工" value="0"></el-option>
          <el-option label="护士" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="realName" label="姓名">
        <el-input name="realName" :disabled="disabled" v-model="row.realName" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="age" label="年龄">
        <el-input name="age" :disabled="disabled" v-model.number="row.age" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="gender" label="性别">
        <el-radio name="gender" :disabled="disabled" v-model="row.gender" label="1">男</el-radio>
        <el-radio name="gender" :disabled="disabled" v-model="row.gender" label="0">女</el-radio>
      </el-form-item>
      <el-form-item prop="birthday" label="出生日期">
        <el-date-picker
          name="birthday"
          :disabled="disabled"
          value-format="yyyy-MM-dd"
          v-model="row.birthday"
          type="date"
          placeholder="请选择出生日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="idCard" label="身份证号" style="width:310px">
        <el-input name="idCard" :disabled="disabled" v-model="row.idCard"></el-input>
      </el-form-item>
      <el-form-item prop="placeOfBirth" label="籍贯" style="width:310px">
        <el-input name="placeOfBirth" :disabled="disabled" v-model="row.placeOfBirth"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="手机号" style="width:310px">
        <el-input name="phone" :disabled="disabled" v-model="row.phone"></el-input>
      </el-form-item>
      <el-form-item prop="wechat" label="微信号" style="width:310px">
        <el-input name="wechat" :disabled="disabled" v-model="row.wechat"></el-input>
      </el-form-item>
      <el-form-item prop="address" label="家庭地址">
        <el-input name="address" :disabled="disabled" v-model="row.address"></el-input>
      </el-form-item>
      <el-form-item prop="height" label="身高(cm)">
        <el-input name="height" :disabled="disabled" v-model="row.height" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="weight" label="体重(kg)">
        <el-input name="weight" :disabled="disabled" v-model="row.weight" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="degree" label="学历">
        <el-select v-model="row.degree" name="degree" :disabled="disabled">
          <el-option v-for="item in toDegree" :key="item.key" :value="item.key" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="nation" label="民族">
        <el-input name="nation" :disabled="disabled" v-model="row.nation" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="maritalStatus" label="婚姻状态">
        <el-select v-model="row.maritalStatus" name="maritalStatus" :disabled="disabled">
          <el-option
            v-for="item in maritalStatus"
            :key="item.key"
            :value="item.key"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="level" label="等级">
        <el-select v-model="row.level" name="level" :disabled="disabled">
          <el-option v-for="item in toLevel" :key="item.key" :value="item.key" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="description" label="简介">
        <el-input name="description" :disabled="disabled" v-model="row.description"></el-input>
      </el-form-item>
      <el-form-item prop="workStatus" label="接单状态">
        <el-select v-model="row.workStatus" name="workStatus" :disabled="disabled">
          <el-option
            v-for="item in workStatus"
            :key="item.key"
            :value="item.key"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="skillLbl" label="技能(,分隔)">
        <el-input name="skillLbl" :disabled="disabled" v-model="row.skillLbl" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="workYears" label="工作年限">
        <el-input
          name="workYears"
          :disabled="disabled"
          v-model.number="row.workYears"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="approveDate" label="审核日期">
        <el-input name="approveDate" :disabled="true" v-model="row.approveDate" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="bankAccount" label="银行卡号">
        <el-input
          name="bankAccount"
          :disabled="disabled"
          v-model="row.bankAccount"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="openBank" label="开户行">
        <el-input name="openBank" :disabled="disabled" v-model="row.openBank" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="orderNum" label="累计订单数">
        <el-input name="orderNum" :disabled="disabled" v-model="row.orderNum" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="currShareOrder" label="实时拼单数">
        <el-input
          name="currShareOrder"
          :disabled="true"
          v-model="row.currShareOrder"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="avgScore" label="平均得分">
        <el-input name="avgScore" :disabled="true" v-model="row.avgScore" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="totalProfit" label="累计收益">
        <el-input name="totalProfit" :disabled="true" v-model="row.totalProfit" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="totalAvlProfit" label="累计可提现">
        <el-input
          name="totalAvlProfit"
          :disabled="true"
          v-model="row.totalAvlProfit"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="totalWithdraw" label="累计提现">
        <el-input
          name="totalWithdraw"
          :disabled="true"
          v-model="row.totalWithdraw"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="refProfitRate" label="推荐收益率">
        <el-input
          name="refProfitRate"
          :disabled="disabled"
          v-model="row.refProfitRate"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="refWorkerTotal" label="推荐护工数">
        <el-input
          name="refWorkerTotal"
          :disabled="true"
          v-model="row.refWorkerTotal"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="refOrderTotal" label="推荐订单数">
        <el-input
          name="refOrderTotal"
          :disabled="true"
          v-model="row.refOrderTotal"
          style="width:310px"
        ></el-input>
      </el-form-item>
      <br />
      <el-form-item prop="idCardFrontUrl" label="身份证正面">
        <el-button
          v-if="row.idCardFrontUrl"
          type="primary"
          size="mini"
          plain
          @click="dialogPic(row.idCardFrontUrl)"
        >点击查看大图</el-button>
        <upload
          class="idCard"
          :disabled="disabled"
          :rowId="String(row.rowId)"
          :imgUrl="row.idCardFrontUrl"
          :newImgUrl="row.newIdCardFront"
          :id="2"
          @getUrl="getIdCardFrontUrl"
        ></upload>
      </el-form-item>
      <el-form-item prop="idCardBackUrl" label="身份证反面">
        <el-button
          v-if="row.idCardBackUrl"
          type="primary"
          size="mini"
          plain
          @click="dialogPic(row.idCardBackUrl)"
        >点击查看大图</el-button>
        <upload
          class="idCard"
          :disabled="disabled"
          :rowId="String(row.rowId)"
          :imgUrl="row.idCardBackUrl"
          :newImgUrl="row.newIdCardBack"
          :id="3"
          @getUrl="getIdCardBackUrl"
        ></upload>
      </el-form-item>
      <el-form-item prop="healthCertUrl" label="健康证">
        <el-button
          v-if="row.healthCertUrl"
          type="primary"
          size="mini"
          plain
          @click="dialogPic(row.healthCertUrl)"
        >点击查看大图</el-button>
        <upload
          class="idCard"
          :disabled="disabled"
          :rowId="String(row.rowId)"
          :imgUrl="row.healthCertUrl"
          :newImgUrl="row.newHealthCert"
          :id="4"
          @getUrl="getHealthCertUrl"
        ></upload>
      </el-form-item>
      <br />

      <el-form-item prop="introVideoUrl" class="introVideo" label="短视频">
        <uploadVideo
          class="idCard"
          :disabled="disabled"
          :rowId="String(row.rowId)"
          :imgUrl="row.introVideoUrl"
          :newImgUrl="row.newIntroVideo"
          @getUrl="getIntroVideoUrl"
        ></uploadVideo>
      </el-form-item>
      <br />
    </el-form>
    <vue-qr
      v-show="false"
      ref="Qrcode" 
      :text="row.inviteUrl" 
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
import { fetchList, editWorker, doDelete } from "@/api/nurse";
import upload from "@/components/Upload/upload";
import uploadVideo from "@/components/Upload/upload-video";
import { async } from "q";
import { checkPhone, checkId, checkAge } from "@/utils/validate.js";
import vueQr from 'vue-qr'

export default {
  name: "detail",
  data() {
    return {
      toDegree: this.GLOBAL.toDegree,
      maritalStatus: this.GLOBAL.maritalStatus,
      toLevel: this.GLOBAL.toLevel,
      workStatus: this.GLOBAL.workStatus,
      isEdit: true,
      row: null,
      disabled: null,
      rules: {
        realName: [{ required: true, message: "姓名必填", trigger: "blur" }],
        age: [
          { required: true, message: "年龄必填", trigger: "blur" },
          { type: "number", message: "年龄必须是数字", trigger: "blur" },
          { validator: checkAge, trigger: "blur" }
        ],
        idCard: [
          { required: true, message: "身份证号必填", trigger: "blur" },
          { validator: checkId, trigger: "blur" }
        ],
        placeOfBirth: [
          { required: true, message: "籍贯必填", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号必填", trigger: "blur" } /* ,
          { validator: checkPhone, trigger: "blur" } */
        ],
        nation: [{ required: true, message: "民族必填", trigger: "blur" }],
        workYears: [
          { required: true, message: "工作年限必填", trigger: "blur" },
          { type: "number", message: "工作年限必须是数字", trigger: "blur" }
        ],
        level: [{ required: true, message: '等级必选', trigger: "blur"  }],
        skillLbl: [{ required: true, message: "技能必填", trigger: "blur" }],
        avatarUrl: [
          { required: true, message: "头像必须上传", trigger: "blur" }
        ],
        idCardFrontUrl: [
          { required: true, message: "身份证必须上传", trigger: "blur" }
        ] /* ,
        idCardBackUrl: [
          { required: true, message: "身份证必须上传", trigger: "blur" }
        ],
        healthCertUrl: [
          { required: true, message: "健康证必须上传", trigger: "blur" }
        ] */
      },
      img: require('../../../assets/images/logo.jpg')
    };
  },
  created() {
    const { id, disabled } = this.$route.query;
    this.disabled = Boolean(disabled);
    if (id) {
      fetchList({ rowId: id }).then(response => {
        this.row = response.result.list[0];
        // console.log(this.row)
      });
    } else {
      this.$router.push({
        path: "/according"
      });
    }
  },
  methods: {
    handleToEdit(){
      this.disabled = false;
      this.isEdit = !this.isEdit;
    },
    dialogPic(url) {
      if (url.indexOf(".com") == -1) {
        url = "http://file.xmpeihu.com" + url;
      }
      // console.log(url)
      this.$alert(`<img src="${url}" />`, {
        dangerouslyUseHTMLString: true,
        closeOnClickModal: true
      });
    },
    getIdCardFrontUrl(val) {
      if (!this.row.idCardFrontUrl) {
        this.row.idCardFrontUrl = val;
      }
      this.row.newIdCardFront = val;
    },
    getIdCardBackUrl(val) {
      if (!this.row.idCardBackUrl) {
        this.row.idCardBackUrl = val;
      }
      this.row.newIdCardBack = val;
    },
    getHealthCertUrl(val) {
      if (!this.row.healthCertUrl) {
        this.row.healthCertUrl = val;
      }
      this.row.newHealthCert = val;
    },
    getAvatarUrl(val) {
      if (!this.row.avatarUrl) {
        this.row.avatarUrl = val;
      }
      this.row.newAvatar = val;
    },
    getIntroVideoUrl(val) {
      this.row.newIntroVideo = val;
    },
    handleToSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确定保存?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "success"
          })
            .then(() => {
              editWorker(this.row)
                .then(res => {
                  if (res.code == "00000000") {
                    this.$notify({
                      title: "保存成功",
                      message: "已保存该照护士信息",
                      type: "success",
                      duration: 6000
                    });
                    this.$router.go(-1);
                  } else {
                    this.$message.error("保存失败，请重试！");
                  }
                })
                .catch(() => {
                  this.$message.error("保存失败，请重试！");
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消"
              });
            });
        } else {
          return false;
        }
      });
    },
    handleDelete() {
      const id = this.row.rowId;
      this.$confirm("确定删除该护工?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(async () => {
          try {
            await doDelete({ rowId: id });
          } catch (err) {
            this.$message.error("删除失败，请重试！");
            return;
          }
          this.$notify({
            title: "操作成功",
            message: "已删除该护工",
            type: "success",
            duration: 6000
          });
          this.$store.state.tagsView.visitedViews.map(item => {
            if (item.name == "详情") {
              this.$store.dispatch("tagsView/delView", item); //关闭当前页标签
            }
          });
          this.$router.go(-1);
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    downloadImg () {
      const iconUrl = this.$refs.Qrcode.$el.src
      let a = document.createElement('a')
      let event = new MouseEvent('click')
      a.download = this.row.realName
      a.href = iconUrl
      a.dispatchEvent(event)
    }
  },
  components: {
    upload,
    uploadVideo,
    vueQr
  }
};
</script>

<style lang="scss">
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
.el-upload--picture-card,
.el-upload-list__item.is-success {
  width: 310px;
  height: 166px;
}
.detail{
  .el-form-item {
    display: inline-block;
    min-width: 400px;
    margin-left: 20px;
  }
}

.idCard {
  width: 320px;
}
.introVideo {
  width: 70%;
}
.introVideo .el-upload,
video {
  width: 100%;
}
.el-message-box {
  width: auto;
  min-width: 420px;
  img {
    max-width: 700px;
    max-height: 600px;
  }
}
</style>