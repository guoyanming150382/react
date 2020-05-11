<template>
  <div>
    <video v-if="newUrl" :src="newUrl" @click="imgClick"></video>
    <video v-else-if="url" :src="url" @click="imgClick"></video>
    <el-button v-else :disabled="isAble" @click="imgClick" size="mini">点击上传</el-button>
    <input :disabled="isAble" id="fileSelector" type="file" v-show="false" />
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
    let selectedFile; //选择文件
    let filename; // 文件名字
    const _this = this;
    $("#fileSelector").change(function() {
      //这是用户操作时候执行的函数
      selectedFile = document.getElementById("fileSelector").files[0]; //通过操作com拿到用户选择的文件，当然这里也可以操作jquery拿数据
      console.log(selectedFile.type);
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb",
          "video/x-matroska"
        ].indexOf(selectedFile.type) == -1
      ) {
        _this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (selectedFile.size / 1024 / 1024 > 10) {
        _this.$message.error("上传视频大小不能超过10MB!");
        return false;
      }
      filename = selectedFile.name; //文件.name是获取源文件的文件名（固定用法）
      _this.uploadFile(selectedFile, filename, (val, key) => {
        _this.$emit("getUrl", key);
        _this.url = `//${val}`;
      });
    });
  },
  methods: {
    imgClick() {
      $("#fileSelector").click();
    },
    uploadFile(selectedFile, filename, upCallback) {
      /*这部分是获取签名*/
      var cos = new COS({
        // 必选参数
        getAuthorization: function(options, callback) {
          $.ajax({
            method: "POST",
            url: " https://svc.xmpeihu.com:8443/cos/getKey",
            dataType: "json",
            success: function(data) {
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
      }/${new Date().getTime()}${filename}`;
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
<style lang="postcss">
video {
  width: 100%;
  height: 100%;
  border: 1px solid #999;
}
.btn {
  font-weight: 100;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
}
</style>
