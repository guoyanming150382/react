<template>
<div >
  <div class="page-wrap">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="home">
          <v-home></v-home>
        </mt-tab-container-item>
        <mt-tab-container-item id="profit">
          <v-profit></v-profit>
        </mt-tab-container-item>
        <mt-tab-container-item id="bed">
          <v-bed></v-bed>
        </mt-tab-container-item>
        <mt-tab-container-item id="my">
          <v-center></v-center>
        </mt-tab-container-item>
      </mt-tab-container>
  </div>
  <mt-tabbar v-model="selected" fixed>
    <mt-tab-item id="home">
      <img slot="icon" src="@/assets/images/home.png">
      首页
    </mt-tab-item>
    <mt-tab-item id="profit">
      <img slot="icon" src="@/assets/images/profit.png">
      收益
    </mt-tab-item>
    <mt-tab-item id="bed">
      <img slot="icon" src="@/assets/images/bed.png">
      陪护床
    </mt-tab-item>
    <mt-tab-item id="my">
      <img slot="icon" src="@/assets/images/my.png">
      我的
    </mt-tab-item>
  </mt-tabbar>
</div>
</template>
<script>
import VHome from "../main/index"
import VProfit from "../profit/index"
import VBed from "../bed/index"
import VCenter from "../main/center"

export default {
  name: 'Login',
  components: {VHome,VProfit,VBed,VCenter},
  data() {
    return {
      selected:"home"
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
.page-wrap{
  margin-bottom: 100px;
}
</style>
