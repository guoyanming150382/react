<template>
  <div>
    <el-form ref="ValidateForm" :rules="rules" label-width="95px" :model="row">
      <el-form-item prop="avatarUrl" label="头像" style="margin-top: 20px;">
        <el-button
          v-if="row.avatarUrl"
          type="primary"
          size="mini"
          plain
          @click="dialogPic(row.avatarUrl)"
        >点击查看大图</el-button>
        <upload
          class="avatar-uploader"
          :rowId="String(row.rowId)"
          :imgUrl="row.avatarUrl"
          :newImgUrl="row.newAvatar"
          :id="1"
          @getUrl="getAvatarUrl"
        ></upload>
      </el-form-item>
      <div class="homeBtn">
        <el-button type="success" @click="handleToPass('ValidateForm')">通 过</el-button>
        <el-button type="primary" @click="$router.go(-1)">返 回</el-button>
      </div>
      <br />
      <el-form-item label="注册时间">
        <el-date-picker
          name="createTime"
          :disabled="true"
          v-model="row.createTime"
          type="datetime"
          default-time="12:00:00"
          placeholder="设置注册时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="row.type" name="type">
          <el-option label="护工" value="0"></el-option>
          <el-option label="护士" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登录名">
        <el-input :disabled="true" name="loginName" v-model="row.loginName" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input name="realName" v-model="row.realName" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input name="age" v-model.number="row.age" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio name="gender" v-model="row.gender" label="1">男</el-radio>
        <el-radio name="gender" v-model="row.gender" label="0">女</el-radio>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          name="birthday"
          v-model="row.birthday"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="请选择出生日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard" style="width:310px">
        <el-input name="idCard" v-model="row.idCard"></el-input>
      </el-form-item>
      <el-form-item label="籍贯" prop="placeOfBirth" style="width:310px">
        <el-input name="placeOfBirth" v-model="row.placeOfBirth"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone" style="width:310px">
        <el-input name="phone" v-model="row.phone"></el-input>
      </el-form-item>
      <el-form-item label="微信号" style="width:310px">
        <el-input name="wechat" v-model="row.wechat"></el-input>
      </el-form-item>
      <el-form-item label="家庭地址">
        <el-input name="address" v-model="row.address"></el-input>
      </el-form-item>
      <el-form-item label="身高(cm)">
        <el-input name="height" v-model="row.height" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item label="体重(kg)">
        <el-input name="weight" v-model="row.weight" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item label="学历">
        <el-select v-model="row.degree" name="type">
          <el-option
            v-for="item in toDegree"
            :key="item.key"
            :value="item.key"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="nation" label="民族">
        <el-input name="nation" v-model="row.nation" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item label="婚姻状态">
        <el-select v-model="row.maritalStatus" name="maritalStatus">
          <el-option
            v-for="item in maritalStatus"
            :key="item.key"
            :value="item.key"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="等级">
        <el-select v-model="row.level" name="level">
          <el-option
            v-for="item in toLevel"
            :key="item.key"
            :value="item.key"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简介">
        <el-input name="description" v-model="row.description"></el-input>
      </el-form-item>
      <el-form-item label="接单状态">
        <el-select v-model="row.workStatus" name="workStatus">
          <el-option
            v-for="item in workStatus"
            :key="item.key"
            :value="item.key"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="skillLbl" label="技能(,分隔)">
        <el-input name="skillLbl" v-model="row.skillLbl" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item prop="workYears" label="工作年限">
        <el-input name="workYears" v-model.number="row.workYears" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号">
        <el-input name="bankAccount" v-model="row.bankAccount" style="width:310px"></el-input>
      </el-form-item>
      <el-form-item label="开户行">
        <el-input name="openBank" v-model="row.openBank" style="width:310px"></el-input>
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
          :rowId="String(row.rowId)"
          :imgUrl="row.healthCertUrl"
          :newImgUrl="row.newHealthCert"
          :id="4"
          @getUrl="getHealthCertUrl"
        ></upload>
      </el-form-item>

      <el-form-item class="introVideo" label="短视频">
        <uploadVideo
          class="idCard"
          :rowId="String(row.rowId)"
          :imgUrl="row.introVideoUrl"
          :newImgUrl="row.newIntroVideo"
          @getUrl="getIntroVideoUrl"
        ></uploadVideo>
      </el-form-item>
      <br />
    </el-form>
  </div>
</template>

<script>
import { fetchList, approveWorker } from "@/api/nurse";
import upload from "@/components/Upload/upload";
import uploadVideo from "@/components/Upload/upload-video";
import { checkPhone, checkId, checkAge } from "@/utils/validate.js";

export default {
  name: "Approve",
  data() {
    return {
      toDegree: this.GLOBAL.toDegree,
      maritalStatus: this.GLOBAL.maritalStatus,
      toLevel: this.GLOBAL.toLevel,
      workStatus: this.GLOBAL.workStatus,
      row: null,
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
          { required: true, message: "手机号必填", trigger: "blur" }/* ,
          { validator: checkPhone, trigger: "blur" } */
        ],
        nation: [{ required: true, message: "民族必填", trigger: "blur" }],
        workYears: [
          { required: true, message: "工作年限必填", trigger: "blur" },
          { type: "number", message: "工作年限必须是数字", trigger: "blur" }
        ],
        skillLbl: [{ required: true, message: "技能必填", trigger: "blur" }],
        avatarUrl: [
          { required: true, message: "头像必须上传", trigger: "blur" }
        ],
        idCardFrontUrl: [
          { required: true, message: "身份证必须上传", trigger: "blur" }
        ]/* ,
        idCardBackUrl: [
          { required: true, message: "身份证必须上传", trigger: "blur" }
        ],
        healthCertUrl: [
          { required: true, message: "健康证必须上传", trigger: "blur" }
        ] */
      }
    };
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      fetchList({ rowId: id }).then(response => {
        this.row = response.result.list[0];
      });
    } else {
      this.$router.push({
        path: "/according"
      });
    }
  },
  methods: {
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
    handleToPass(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确定通过?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "success"
          })
            .then(() => {
              approveWorker(this.row)
                .then(res => {
                  if (res.code == "00000000") {
                    this.$notify({
                      title: "审批通过成功",
                      message: "已保存通过护工提交的审批",
                      type: "success",
                      duration: 6000
                    });
                    this.$store.state.tagsView.visitedViews.map(item => {
                      if (item.name == "审核") {
                        this.$store.dispatch("tagsView/delView", item); //关闭当前页标签
                      }
                    });
                    this.$router.go(-1);
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
        } else {
          return false;
        }
      });
    },
    dialogPic(url) {
      if (url.indexOf(".com") == -1) {
        url = "http://file.xmpeihu.com" + url;
      }
      this.$alert(`<img src="${url}" />`, {
        dangerouslyUseHTMLString: true,
        closeOnClickModal: true
      });
    }
  },
  components: {
    upload,
    uploadVideo
  }
};
</script>

<style lang="scss">
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
.homeBtn {
  float: right;
  margin: 20px 100px 0 0;
}
.el-upload--picture-card,
.el-upload-list__item.is-success {
  width: 310px;
  height: 166px;
}
.el-form-item {
  display: inline-block;
  min-width: 400px;
  margin-left: 20px;
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