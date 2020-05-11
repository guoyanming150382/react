<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" :statData="statData"/>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <pie-chart  :title="title" :detail="detail" :series="series"></pie-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getStatData,hospitalStat,departStat,subDepartStat } from '@/api/stat'
import PanelGroup from './components/PanelGroup'
import Simulation from './components/Simulation'
import PieChart from './components/PieChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    Simulation,
    PieChart
  },
  data() {
    return {
      statData:{},
      title:"",
      detail:"",
      series:[]
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(function () {
      setInterval(this.init, 50000);
    })
  },
  methods: {
    init(){
      let vm = this
      getStatData().then(response => {
        this.statData = response.result
      })
      
    },
   
    handleSetLineChartData(type) {
      
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

 .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
