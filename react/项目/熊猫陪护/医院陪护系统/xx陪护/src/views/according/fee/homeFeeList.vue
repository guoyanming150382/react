<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.workerName"
        placeholder="护工姓名"
        prop="workerName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.cityId"
        placeholder="城市"
        prop="cityId"
        style="width: 200px;"
        class="filter-item"
        @change="districtFilter"
        clearable
      >
        <el-option
          v-for="item in cityList"
          :key="item.rowId"
          :label="item.name"
          :value="item.rowId"
        />
      </el-select>
      <el-select
        ref="district"
        v-model="listQuery.districtId"
        placeholder="行政区"
        prop="districtId"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in districtList"
          :key="item.rowId"
          :label="item.name"
          :value="item.rowId"
        />
      </el-select>
      <el-select
        v-model="listQuery.careStandard"
        placeholder="护理级别"
        prop="careStandard"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option
          v-for="item in careStandard"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <!-- 列表 -->
    <div>
      <el-table
        :data="homeFeeList"
        v-loading="listLoading"
        border
        empty-text="请先选择城市"
        :stripe="true"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="workerName" align="center" label="护工姓名">
          <template slot-scope="scope">
            <span>{{scope.row.workerName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cityId" align="center" label="城市">
          <template slot-scope="scope">
            <span v-show="!scope.row.isEdit">{{scope.row.city}}</span>
            <el-select
              v-show="scope.row.isEdit"
              v-model="scope.row.cityId"
              @change="handleCityChange(scope.row)"
              name="cityId"
            >
              <el-option
                v-for="item in cityList"
                :key="item.rowId"
                :label="item.name"
                :value="item.rowId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="districtId" align="center" label="行政区" >
          <template slot-scope="scope">
            <span v-show="!scope.row.isEdit">{{scope.row.district}}</span>
            <el-select v-show="scope.row.isEdit" v-model="scope.row.districtId" name="districtId">
              <el-option
                v-for="item in district"
                :key="item.rowId"
                :label="item.name"
                :value="item.rowId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="careStandard" align="center" label="护理级别" >
          <template slot-scope="scope">
            <span v-show="!scope.row.isEdit">{{scope.row.careStandard | careStandardFilter }}</span>
            <el-select
              v-show="scope.row.isEdit"
              v-model="scope.row.careStandard"
              name="careStandard"
            >
              <el-option
                v-for="item in careStandard"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="singleFee12" align="center" label="12小时费用">
          <template slot-scope="scope">
            <span v-show="!scope.row.isEdit">{{scope.row.singleFee12}}</span>
            <el-input
              class="input"
              v-show="scope.row.isEdit"
              name="singleFee12"
              v-model="scope.row.singleFee12"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="singleFee24" align="center" label="24小时费用">
          <template slot-scope="scope">
            <span v-show="!scope.row.isEdit">{{scope.row.singleFee24}}</span>
            <el-input
              class="input"
              v-show="scope.row.isEdit"
              name="singleFee24"
              v-model="scope.row.singleFee24"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button
              v-show="!scope.row.isEdit"
              @click="handleToEdit(scope.row)"
              type="primary"
              size="small"
            >编辑</el-button>
            <el-button
              v-show="scope.row.isEdit"
              @click="handleToDone(scope.row)"
              type="success"
              size="small"
            >完成</el-button>
            <el-button @click="handleToAdd(scope.row)" type="primary" size="small">新增</el-button>
            <el-button @click="handleToDelete(scope.row)" type="danger" size="small">删除</el-button>
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
import { getHomeFeeList, editHomeFee } from "@/api/nurse";
import { getCityList, getDistrictList } from "@/api/hospital";
import Pagination from "@/components/Pagination";

export default {
  name: "homeFeeList",
  data() {
    return {
      careStandard: this.GLOBAL.careStandard,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      homeFeeList: null,
      cityList: null,
      districtList: null,
      district: null
    };
  },
  created() {
    this.getList();
    this.getCity();
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 选了城市才能选行政区
    districtFilter() {
      this.handleFilter();
      this.listQuery.pageNum = 1;
      const id = this.listQuery.cityId;
      if (id) {
        getDistrictList({ cityId: id }).then(res => {
          this.districtList = res.result;
        });
      } else {
        this.districtList = [];
        this.$set(this.listQuery, "districtId", "");
        return;
      }
    },
    // 编辑时 城市改变时 清空 改变行政区列表
    handleCityChange(row) {
      const id = row.cityId;
      if (id) {
        this.district = [];
        this.$set(row, "districtId", ""); // 清除当前选中的
        getDistrictList({ cityId: id }).then(res => {
          this.district = res.result;
        });
      } else {
        return;
      }
    },
    getCity() {
      getCityList().then(res => {
        this.cityList = res.result;
      });
    },
    getList() {
      this.listLoading = true;
      getHomeFeeList(this.listQuery).then(res => {
        this.homeFeeList = res.result.list;
        this.total = res.result.total;
        this.listLoading = false;
      });
    },
    handleToEdit(row) {
      this.$set(row, "isEdit", true);
      // console.log(row)
      const id = row.cityId;
      getDistrictList({ cityId: id }).then(res => {
        this.district = res.result;
        // console.log(this.district)
      });
    },
    // 行内编辑完成
    handleToDone(row) {
      this.$set(row, "isEdit", false);
      const data = {
        rowId: row.rowId,
        cityId: row.cityId,
        districtId: row.districtId,
        workerId: row.workerId,
        careStandard: row.careStandard,
        singleFee12: row.singleFee12,
        singleFee24: row.singleFee24
      };
      // console.log(data)
      editHomeFee(data)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "更新费用明细成功 (^-^)",
            type: "success",
            duration: 6000
          });
          this.getList();
        })
        .catch(err => {
          console.log(err);
          // this.$message.error('更新费用明细失败，请重试！')
          this.getList();
        });
    },
    // 新增
    handleToAdd(row) {
      console.log(row);
    },
    handleToDelete(row) {
      console.log(row);
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss" scoped>
</style>