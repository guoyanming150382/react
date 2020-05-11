<template>
  <div class="edit_container">
    <input
      id="fileSelector"
      class="uploadImage"
      ref="fileInput"
      @change="handleUpload"
      v-show="false"
      type="file"
    />
    <quill-editor v-loading="loading" v-model="content" ref="myQuillEditor" :options="editorOption"></quill-editor>
    <el-button class="btn" @click="saveHtml" type="primary" size="small">保存</el-button>
  </div>
</template>
<script>
import $ from "jquery";
import COS from "cos-js-sdk-v5";
import imageResize from "quill-image-resize-module";
import Quill from "quill";
import { ImageResize } from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);

// 工具栏
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  // ["blockquote", "code-block"],
  // [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }],
  [{ background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image"],
  ["clean"] // remove formatting button
];
// 提示
const titleConfig = {
  "ql-bold": "加粗",
  "ql-color": "字体颜色",
  "ql-font": "字体",
  "ql-code": "插入代码",
  "ql-italic": "斜体",
  "ql-link": "添加链接",
  "ql-background": "背景颜色",
  "ql-size": "字体大小",
  "ql-strike": "删除线",
  "ql-script": "上标/下标",
  "ql-underline": "下划线",
  "ql-blockquote": "引用",
  "ql-header": "标题",
  "ql-indent": "缩进",
  "ql-list": "列表",
  "ql-align": "文本对齐",
  "ql-direction": "文本方向",
  "ql-code-block": "代码块",
  "ql-formula": "公式",
  "ql-image": "上传图片",
  "ql-video": "视频",
  "ql-clean": "清除字体样式",
  "ql-upload": "文件"
};

export default {
  name: "App",
  data() {
    return {
      content: "",
      loading: false,
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector("#fileSelector").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          },
          imageResize: true
        }
      }
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.addQuillTitle();
  },
  methods: {
    saveHtml: function(event) {
      console.log(this.content);
    },
    // 工具提示
    addQuillTitle() {
      const oToolBar = document.querySelector(".ql-toolbar"),
        aButton = oToolBar.querySelectorAll("button"),
        aSelect = oToolBar.querySelectorAll("select");
      aButton.forEach(function(item) {
        if (item.className === "ql-script") {
          item.value === "sub" ? (item.title = "下标") : (item.title = "上标");
        } else if (item.className === "ql-indent") {
          item.value === "+1"
            ? (item.title = "向右缩进")
            : (item.title = "向左缩进");
        } else {
          item.title = titleConfig[item.classList[0]];
        }
      });
      aSelect.forEach(function(item) {
        item.parentNode.title = titleConfig[item.classList[0]];
      });
    },
    // 上传图片
    handleUpload() {
      var selectedFile = document.getElementById(`fileSelector`).files[0];
      var filename = selectedFile.name; //文件.name是获取源文件的文件名（固定用法）
      filename = filename.substring(filename.lastIndexOf(".") + 1);
      this.loading = true;
      this.uploadFile(selectedFile, filename, (val, key) => {
        console.log(key);
        let quill = this.$refs.myQuillEditor.quill;
        let length = quill.getSelection().index;
        quill.insertEmbed(length, "image", `http://file.xmpeihu.com${key}`);
        quill.setSelection(length + 1);
        this.loading = false;
      });
      document.querySelector("#fileSelector").value = ""; // 上传成功 清空input
    },
    // 腾讯云
    uploadFile(selectedFile, filename, upCallback) {
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
      /*这部分是获取签名*/
      var cos = new COS({
        // 必选参数
        getAuthorization: function(options, callback) {
          $.ajax({
            method: "POST",
            url: "https://svc.xmpeihu.com:8443/cos/getKey",
            dataType: "json",
            success: function(data) {
              // console.log(data);
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
      const key = `${
        this.UPLOAD_URL
      }/worker/${new Date().getTime()}\.${filename}`;
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
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.snow.css";
@import "~quill/dist/quill.bubble.css";
.edit_container {
  padding: 20px 40px;
  .quill-editor {
    .ql-container {
      min-height: 200px !important;
    }
  }
  .btn {
    float: right;
    margin-top: 20px;
  }
}
</style>