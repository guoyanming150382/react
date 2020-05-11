<template>
<div class="batteryIcon">
    <span class="batteryIconBody" :style="{borderColor:formatColor(percentage)}">
        <span  class="batteryIconProgress" :style="{width:(this.percentage / 2)+'px', background:formatColor(percentage)}"></span>
        <label class="batteryIconContent">{{percentage | formatZero}}%</label>
        <span class="batteryIconHead" :style="{background:formatColor(percentage)}"></span>
    </span>
</div>
</template>
<script>
export default {
  props: {
    percentage: {
      type: String,
      default: '0'
    }
  },
  methods: {
    formatColor(percentage) {
         if (percentage ==null || percentage == undefined ){
            return  '#ff0000';
        }
        var p = parseInt(percentage);
        if (p <= 10) {
            return  '#ff0000';
        }
        if (p > 10 && p<=50) {
            return  '#ffd909';
        }
        if (p > 50) {
           return '#147c09';
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.batteryIcon {
}

span {
    display: block;
}

.batteryIconBody {
    position: relative;
    width: 60px;
    height: 30px;
    border: 2px solid #147c09;
   
    border-radius: 1px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
}

.batteryIconHead {
    position: relative;
    height: 15px;
    width: 8px;
    background: #147c09;
    display: block;
    position: absolute;
    top: 5px;
    left: 58px;
}

.batteryIconProgress {
    margin:2px;
    height: 22px;
}

.batteryIconContent {
    position: relative;
    font-size: 12px;
    left: 4px;
    top: -24px;
    color: #000;
}
</style>
