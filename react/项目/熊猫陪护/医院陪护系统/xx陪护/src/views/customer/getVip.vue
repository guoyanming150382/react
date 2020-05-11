<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.showNickName"
        placeholder="客户昵称"
        prop="showNickName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.type"
        placeholder="交易类型"
        prop="type"
        style="width: 150px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in vipLevel" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-date-picker
        v-model="listQuery.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        class="filter-item"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="handleFilter"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <!-- 列表 -->
    <div>
      <el-table
        :data="list"
        v-loading="listLoading"
        border
        :stripe="true"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="showNickName" label="微信昵称" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.showNickName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="VIP等级" align="center" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.type | vipLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vaildStart" label="生效日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.vaildStart }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vaildEnd" label="失效日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.vaildEnd }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="认购日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getVipTransPageList } from "@/api/worker/worker";
import Pagination from "@/components/Pagination";

export default {
  data() {
    return {
        vipLevel: this.GLOBAL.vipLevel,
        pickerOptions: this.GLOBAL.pickerOptions[0],
        total: 0,
        listLoading: true,
        listQuery: {
            pageNum: 1,
            pageSize: 10
        },
        list: null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
        this.listLoading = true 
        getVipTransPageList(this.listQuery).then(res=>{
            this.list = res.result.list
            this.total = res.result.total
            this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    }
  },
  filters: {
    statusFilter(status){
        const val = {
            0: '待支付',
            1: '生效',
            2: '失效'
        }
        return val[status]
    }
  },
  components: { Pagination }
};
</script>

<style>
</style>