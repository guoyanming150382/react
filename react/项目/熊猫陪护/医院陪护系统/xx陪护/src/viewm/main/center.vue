<template>
  <div class="center">
    <mt-header fixed title="熊猫陪护"></mt-header>
    <div class="actions">

      <mt-cell title="零钱" >
        <span @click="toDraw"><span style="line-height: normal;">￥{{amount}}</span>&nbsp;&nbsp;<img slot="icon" src="@/assets/images/right.png" width="20" height="20"></span>
        <img slot="icon" src="@/assets/images/profit1.png" width="20" height="20">
      </mt-cell>
    </div>
    <mt-button type="danger" size="large" @click="logout">
      <img src="@/assets/images/exit.png" height="20" width="20" slot="icon">
      退出
    </mt-button>
  </div>
</template>
<script>

import { MessageBox,Toast } from 'mint-ui';
import {myAmount, drawCash} from '@/api/mobile'

export default {
  name:"center",
  data(){
    return {
      amount:0
    }
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      myAmount({}).then(response => {
        console.log(response)
        this.amount = response.result;
      })
    },
    toDraw(){
      MessageBox.prompt('可用余额'+this.amount,'提现',{
        inputPlaceholder: '输入提现金额',
        //inputPattern:/^(\d{1,2}(.\d{1,2})?)|100$/,
        inputErrorMessage:'输入合法金额',
        inputValidator:(val) => {
          var pattern = /^(\d{1,2}(.\d{1,2})?)|100$/;
          if(!pattern.test(val)){
            return false;
          }
          if(val>this.amount){
            return'余额不足！'
          }
        },
        showCancelButton: true
      }).then(({ value, action }) => {
        if('confirm' === action){
          this.drawCash(value)
        }
      });
    },
    drawCash(amount){
      var param = {"amount":amount}
      drawCash(param).then(response => {
        if('00000000'===response.code){
          Toast({  message: '提现申请已提交,客户人员会尽快与您联系。',  iconClass: 'el-icon-check',className:"toast" });
          this.init()
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/mobile')
    }
  }
}
</script>
<style scoped>
.center{
  background-color: #f3f4f3;
  height: 100%;
}
.actions{
  margin: 45px 0px;
}
.toast{
  color: red;
}
</style>
