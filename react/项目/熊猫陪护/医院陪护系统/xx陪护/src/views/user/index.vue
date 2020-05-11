<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        clearable
        v-model="user.name"
        placeholder="用户名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button  v-waves  class="filter-item"  type="primary"
        icon="el-icon-search"  @click="handleFilter">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit"
        @click="toCreate">新建</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      :stripe="true"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
    <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
      <el-table-column label="用户名称" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户编码" align="center" width="150px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center" width="120px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" width="160px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否激活" align="center" width="80px">
        <template slot-scope="scope">
         <span>{{ scope.row.activeFlag | toYesNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160">
        <template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="150px">
        <template slot-scope="scope">
        <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
     
      <el-table-column  label="操作"  align="center"  width="220" fixed="right"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toAuthRole(scope.row)">
            授权
          </el-button>
          <el-button v-if="scope.row.activeFlag == 'Y'" type="warning" size="mini" @click="toggleAuth(scope.row)">
            禁用
          </el-button>
          <el-button v-if="scope.row.activeFlag == 'N'" type="success" size="mini" @click="toggleAuth(scope.row)">
            启用
          </el-button>
          <el-button type="success" size="mini" @click="doDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="user.pageNum" 
      :limit.sync="user.pageSize" @pagination="getList" />

    <el-dialog title="角色分配" :visible.sync="authDialogVisable">
      <el-form ref="form" :model="form" label-position="left" label-width="100px" style="margin-left:50px;">
        <el-form-item label="角色:">
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRoleChange">
            <el-checkbox v-for="role in roles" :label="role.id"   :key="role.id">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAuth">取消</el-button>
        <el-button type="primary" @click="saveAuth">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加用户" :visible.sync="dialogVisable">
      <el-form ref="form" :model="userForm" label-position="left" label-width="100px" style="margin-left:50px;">
        <el-form-item label="用户编码:">
            <el-input placeholder="用户编码"  v-model="userForm.code"></el-input>
          </el-form-item>
          <el-form-item label="用户名称:">
            <el-input placeholder="用户名称"    v-model="userForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码:">
            <el-input placeholder="手机号码"    v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱:">
            <el-input placeholder="用户邮箱"    v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="userForm.remark"></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPage, manualClose,auth,toggle,userRoles,addUser,deleteUser } from '@/api/user'
import { fetchList as roleFetchList } from '@/api/role'
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
      user: {
        pageNum: 1,
        pageSize: 10
      },
      form: {
        roles:[],
        userId:null
      },
      userForm: {},
      dialogVisable: false,
      authDialogVisable: false,
      roles:[],
      checkedRoles:[]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toCreate(){
      this.dialogVisable = true;
    },
    cancel(){
      this.dialogVisable = false;
      this.userForm = {};
    },
    save(){
      this.listLoading = true
      addUser(this.userForm).then(response => {
        if(response.code === '00000000' && response.result != 'N' ){
          this.listLoading = false;
          this.dialogVisable = false;
          this.$message({message: '用户添加完成。', type: 'success'});
          this.getList()
        }else{
          this.$message({message: ""+response.message, type: 'warning'});
        }
        
      })
    },
    doDelete(row){
       this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log("doDelete")
          deleteUser(row.id).then(response => {
            if(response.code === '00000000' && response.result != 'N' ){
              this.listLoading = false;
              this.dialogVisable = false;
              this.$message({message: '用户添加完成。', type: 'success'});
              this.getList()
            }else{
              this.$message({message: ""+response.message, type: 'warning'});
            }
            
          })
        }).catch((e) => {
           
        });
      
    },
    sortChange() {

    },
    getList() {
      this.listLoading = true
      fetchPage(this.user).then(response => {
        this.list = response.result.list
        this.total = response.result.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.user.pageNum = 1
      this.getList()
    },
    toAuthRole(row) {  
      this.listLoading = true
      this.form.id = row.id;
      this.form.roles = [];
      userRoles(row.id).then(response => {
        this.checkedRoles =  response.result
        
      })
      roleFetchList().then(response => {
        this.roles = response.result
        this.listLoading = false
        this.authDialogVisable = true
      })
    },
    handleCheckedRoleChange(value) {
      this.form.roles = value

    },
    saveAuth(){
      auth(this.form).then(response => {
        this.roles = []
        this.listLoading = false
        this.authDialogVisable = false
      })
    },
    cancelAuth(){
      this.authDialogVisable = false;
      this.form = {};
    },
    toggleAuth(row){
      toggle(row.id).then(response => {
         this.getList()
      })
    }
  }
}
</script>
