<template>
  <div class="upload-img">
    <img v-if="newUrl" class="img" :id="`img${id}`" :src="newUrl" @click="imgClick" />
    <img v-else-if="url" class="img" :id="`img${id}`" :src="url" @click="imgClick" />
    <el-button v-else :disabled="isAble" @click="imgClick" size="mini">点击上传</el-button>
    <input
      :disabled="isAble"
      :id="`fileSelector${id}`"
      type="file"
      :ref="`fileInput${id}`"
      v-show="false"
    />
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
import $ from "jquery";
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    rowId: {
      type: String,
      default: ""
    },
    imgUrl: {
      type: String,
      default: ""
    },
    id: {
      type: Number,
      default: 0
    },
    showImg: {
      type: Boolean,
      default: true
    },
    newImgUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      url: this.imgUrl,
      newUrl: this.newImgUrl
    };
  },
  computed: {
    isAble() {
      return this.disabled ? "disabled" : false;
    }
  },
  mounted() {
    let selectedFile; //选择文件`
    let filename; // 文件名字
    const _this = this;
    $(`#fileSelector${this.id}`).change(() => {
      //这是用户操作时候执行的函数
      selectedFile = document.getElementById(`fileSelector${this.id}`).files[0]; //通过操作com拿到用户选择的文件，当然这里也可以操作jquery拿数据
      if (
        ["image/jpeg", "image/jpg", "image/png", "image/gif"].indexOf(
          selectedFile.type
        ) == -1
      ) {
        this.$message.error("请上传正确格式的图片！");
        return false;
      }
      if (selectedFile.size / 1024 / 1024 > 1) {
        this.$message.error("上传图片大小不能超过1M！");
        return false;
      }
      filename = selectedFile.name; //文件.name是获取源文件的文件名（固定用法）
      filename = filename.substring(filename.lastIndexOf(".") + 1);
      _this.uploadFile(selectedFile, filename, (val, key) => {
        _this.$emit("getUrl", key);
        if (_this.showImg) {
          _this.url = `//${val}`;
        }
      });
    });
  },
  methods: {
    imgClick() {
      this.$refs[`fileInput${this.id}`].click();
      // $("#fileSelector").click()
    },
    uploadFile(selectedFile, filename, upCallback) {
      /*这部分是获取签名*/
      const id = this.rowId;
      var cos = new COS({
        // 必选参数
        getAuthorization: function(options, callback) {
          $.ajax({
            method: "POST",
            url: "https://svc.xmpeihu.com:8443/cos/getKey",
            dataType: "json",
            success: function(data) {
              console.log(data);
              callback({
                TmpSecretId: data.result.TmpSecretId,
                TmpSecretKey: data.result.TmpSecretKey,
                XCosSecurityToken: data.result.XCosSecurityToken,
                ExpiredTime: data.result.ExpiredTime
              });
            }
          });
        }
      });
      const key = `${this.UPLOAD_URL}/worker/${
        this.rowId
      }/${new Date().getTime()}\.${filename}`;
      /*这部分是腾讯提供的上传的接口*/
      cos.putObject(
        {
          Bucket: "panda-1259088134", //存储桶用户识别   （必须有）
          Region: "ap-beijing", //地区识别（必须有）
          Key: key, //文件名字（这里需要注意的是，如果名字是一样的，那么后面的会覆盖前面的，所以这个名字不可以重复）（必须有）
          StorageClass: "STANDARD", //可以不写
          Body: selectedFile, //上传文件对象（可以不写）
          onProgress: function(progressData) {
            // console.log(""+JSON.stringify(progressData));
          }
        },
        function(err, data) {
          /*这里是为了调试你的代码，可以拿到报错信息*/
          // console.log(err || data);
          // console.log();//可以拿到文件地址
          upCallback(data.Location, key);
        }
      );
    }
  }
};
</script>


<style lang="scss">
.upload-img {
  background-size: 100% 100%;
  .img {
    width: 310px;
    height: 180px;
    border-radius: 8px;
  }
  #img1 {
    width: 130px;
    height: 130px;
    border-radius: 50%;
  }
}
</style>