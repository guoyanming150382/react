<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input  v-model="role.name"  placeholder="角色名称"  style="width: 200px;"  class="filter-item"
        @keyup.enter.native="handleFilter"></el-input>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
        @click="handleFilter">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit"
        @click="toCreate">新建</el-button>
    </div>  
    <el-table :key="tableKey" v-loading="listLoading" :data="list"  border :stripe="true"  highlight-current-row
      style="width: 100%;" >
       <el-table-column label="序号" align="center"  type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色编码" align="center"  :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
        <el-table-column label="角色类型" align="center"  :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center"  :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="150px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      
      <el-table-column  label="操作"  align="center"  width="200"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button  type="warning" size="mini" style="width:80px" @click="toAuth(scope.row)" >
            角色授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination  v-show="total>0"  :total="total"  :page.sync="role.pageNum"  :limit.sync="role.pageSize"
      @pagination="getList"  />

    <el-dialog title="新建角色" :visible.sync="dialogVisable">
      <el-form ref="form" :model="form" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色编码:">
          <el-input placeholder="角色编码"  v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="角色名称:">
          <el-input placeholder="角色名称"    v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色授权" :visible.sync="authDialogVisable">
      <el-form ref="form" :model="form" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色编码:">
          <el-input placeholder="角色编码"  v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="角色名称:">
          <el-input placeholder="角色名称"    v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAuth">取消</el-button>
        <el-button type="primary" @click="saveAuth">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPage , addRole } from '@/api/role'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      role: {
        pageNum: 1,
        pageSize: 10,
        name:null
      },
      form: {},
      authDialogVisable: false,
      dialogVisable: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toCreate() {
      this.form = {}
      this.dialogVisable = true
    },
    toAuth(row){
      this.authDialogVisable=true;
    },
    getList() {
      this.listLoading = true
      fetchPage(this.role).then(response => {
        this.list = response.result.list
        this.total = response.result.total
        this.listLoading = false
      })
    },
    save() {
      this.listLoading = true
      addRole(this.form).then(response => {
        if(response.code === '00000000' && response.result != 'N' ){
          this.listLoading = false;
          this.dialogVisable = false;
          this.$message({
            message: '角色添加完成。',
            type: 'success'
          });
          this.getList()
        }else{
          this.$message({message: ""+response.message, type: 'warning'});
        }
        
      })
    },
    cancel(){
      this.dialogVisable = false;
      this.$message('新增已取消。');
    },
    handleFilter() {
      this.role.pageNum = 1
      this.getList()
    },
    saveAuth(){

    },
    cancelAuth(){

    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
    /* EXCEL导出End */
  }
}
</script>
