<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.realName"
        placeholder="姓名"
        prop="realName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-input
        v-model="listQuery.idCard"
        placeholder="身份证号"
        prop="idCard"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-select
        v-model="listQuery.workStatus"
        placeholder="接单状态"
        prop="workStatus"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in workStatus" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        prop="type"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        clearable
      >
        <el-option v-for="item in workerType" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
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
        <el-table-column style="display: none;" prop="rowId" align="center" width="0">
          <template>
            <span></span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="avatarUrl" label="头像" align="center" width="100">
          <template slot-scope="scope">
            <img
              v-if="scope.row.avatarUrl"
              style="width:45px;height:45px;border-radius: 50%;"
              :src="scope.row.avatarUrl"
            />
            <span v-else>未上传</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="realName" label="姓名" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
            <!-- <svg
              v-if="scope.row.type == 0"
              t="1576228617746"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5420"
              width="16"
              height="16"
            >
              <path
                d="M814.041346 1019.231497v-84.604812c0-140.670853-134.168348-255.765187-298.103718-255.765188-163.93537 0-298.103718 115.094334-298.103718 255.765188v84.604812z"
                fill="#5FB0E5"
                p-id="5421"
              />
              <path
                d="M233.945671 1019.231497h-32.223523v-84.604812a235.390672 235.390672 0 0 1 9.103506-65.025048l30.995273 8.886756a204.3954 204.3954 0 0 0-7.875256 56.066041z"
                fill="#0686D8"
                p-id="5422"
              />
              <path
                d="M261.689692 840.773866l-28.033021-15.895012a275.995202 275.995202 0 0 1 58.739293-71.527552l21.241516 24.276018a245.65018 245.65018 0 0 0-51.947788 63.146546z"
                fill="#0686D8"
                p-id="5423"
              />
              <path
                d="M830.153108 1019.231497h-32.223524v-84.604812c0-132.145347-126.509843-239.653426-281.775206-239.653426a314.64898 314.64898 0 0 0-160.539618 43.350032l-16.689762-28.105271a346.800254 346.800254 0 0 1 177.01263-47.540535c173.400127 0 314.21548 122.030339 314.21548 271.9492z"
                fill="#0686D8"
                p-id="5424"
              />
              <path
                d="M760.431807 461.822338L780.300572 289.000212A264.001693 264.001693 0 0 0 517.238129 25.648769 264.001693 264.001693 0 0 0 254.031186 289.000212l20.085515 172.894376a53.97079 53.97079 0 0 0 53.970789 54.04304h378.301277a53.97079 53.97079 0 0 0 54.04304-54.11529z"
                fill="#9ECFEF"
                p-id="5425"
              />
              <path
                d="M706.388767 531.97714H328.15974a70.299301 70.299301 0 0 1-70.227051-70.154802l-19.941015-171.015875a279.390955 279.390955 0 1 1 558.70966-1.806251l-20.085515 173.905877a70.299301 70.299301 0 0 1-70.227052 69.071051zM517.238129 41.832781A247.384181 247.384181 0 0 0 270.142948 289.000212l19.941014 171.015875a38.581528 38.581528 0 0 0 38.075778 39.737529h378.229027a37.931278 37.931278 0 0 0 37.786778-37.931278v-1.878501l20.157765-172.894377a247.167431 247.167431 0 0 0-247.095181-245.216679z"
                fill="#0686D8"
                p-id="5426"
              />
              <path
                d="M952.472448 799.157835a26.73252 26.73252 0 1 1-26.66027-26.660269 26.66027 26.66027 0 0 1 26.66027 26.660269zM800.602836 679.150497a15.172511 15.172511 0 1 1-15.100261-15.172511 15.028011 15.028011 0 0 1 15.100261 15.172511zM256.632188 645.409723a15.822762 15.822762 0 1 1-15.822762-15.822762 15.822762 15.822762 0 0 1 15.822762 15.822762zM901.03041 413.703803a19.146264 19.146264 0 1 1-19.146264-19.074014 19.146264 19.146264 0 0 1 19.146264 19.074014zM137.636351 398.820292a30.489522 30.489522 0 1 1-30.417272-30.345022 30.489522 30.489522 0 0 1 30.417272 30.345022zM131.422846 793.594581a24.492768 24.492768 0 1 1-24.420518-24.492768 24.420518 24.420518 0 0 1 24.420518 24.492768z"
                fill="#5FB0E5"
                p-id="5427"
              />
              <path
                d="M572.653919 724.379031v-119.935088a56.716292 56.716292 0 0 0-56.716291-56.788542 56.788542 56.788542 0 0 0-56.788542 56.788542v119.935088l56.788542 18.857263z"
                fill="#FFFFFF"
                p-id="5428"
              />
              <path
                d="M515.937628 760.215057l-72.900304-24.203768V604.443943a72.900303 72.900303 0 0 1 145.800607 0v131.567346z m-40.67678-47.540535l40.67678 13.58301L556.325407 712.674522v-108.375079a40.67678 40.67678 0 0 0-81.281309 0z"
                fill="#0686D8"
                p-id="5429"
              />
              <path
                d="M728.208283 284.520708V447.950328a212.776406 212.776406 0 0 1-212.198405 212.053905A212.776406 212.776406 0 0 1 303.811473 447.950328V284.520708l54.62104-25.504268 47.251534-60.256544 81.64256 62.496295a112.565582 112.565582 0 0 0 68.5653 23.264517z"
                fill="#FFFFFF"
                p-id="5430"
              />
              <path
                d="M516.009878 682.0405a228.599167 228.599167 0 0 1-228.310167-228.382418v-163.285119h32.223523v163.285119a196.086644 196.086644 0 0 0 392.173288 0v-163.285119H744.175545v163.285119A228.599167 228.599167 0 0 1 516.009878 682.0405z"
                fill="#0686D8"
                p-id="5431"
              />
              <path
                d="M753.640302 300.63247H549.967403a160.611868 160.611868 0 0 1-160.395118-160.467367v-27.09377h32.223524v27.09377a128.316094 128.316094 0 0 0 128.171594 128.243844h203.672899z"
                fill="#0686D8"
                p-id="5432"
              />
              <path
                d="M610.296197 240.375926a160.611868 160.611868 0 0 1-160.467368-160.467367h32.295774A128.243844 128.243844 0 0 0 610.296197 208.080152z"
                fill="#0686D8"
                p-id="5433"
              />
              <path
                d="M284.014958 300.63247l-0.867001-32.223523a105.918578 105.918578 0 0 0 106.424328-105.557328V59.823044h32.223524v103.028575a137.925351 137.925351 0 0 1-137.780851 137.780851z"
                fill="#0686D8"
                p-id="5434"
              />
              <path
                d="M619.616454 547.799901H415.654554a71.455302 71.455302 0 0 1 71.455303-71.455302h61.051294a71.455302 71.455302 0 0 1 71.455303 71.455302z"
                fill="#9ECFEF"
                p-id="5435"
              />
              <path
                d="M635.800466 563.911663H399.542793v-16.111762a87.711564 87.711564 0 0 1 87.567064-87.639314h61.051294A87.711564 87.711564 0 0 1 635.800466 547.799901z m-201.577648-32.223524h166.897622a55.488041 55.488041 0 0 0-52.959289-39.231778h-61.051294a55.343541 55.343541 0 0 0-52.887039 39.231778z"
                fill="#0686D8"
                p-id="5436"
              />
              <path
                d="M479.234601 566.657165h86.338813v32.295774H479.234601z"
                fill="#0686D8"
                p-id="5437"
              />
              <path
                d="M463.122839 512.036125h32.295774v30.778523H463.122839z"
                fill="#0686D8"
                p-id="5438"
              />
              <path
                d="M503.293869 512.036125h32.295773v30.778523h-32.295773z"
                fill="#0686D8"
                p-id="5439"
              />
              <path
                d="M543.464898 512.036125h32.295774v30.778523h-32.295774z"
                fill="#0686D8"
                p-id="5440"
              />
              <path
                d="M561.166161 452.646582H478.873351V341.16475h32.223523v79.258308h50.069287v32.223524z"
                fill="#0686D8"
                p-id="5441"
              />
              <path
                d="M405.684047 325.052988h34.246525v32.295774h-34.246525z"
                fill="#0686D8"
                p-id="5442"
              />
              <path
                d="M585.803429 325.052988h34.246525v32.295774h-34.246525z"
                fill="#0686D8"
                p-id="5443"
              />
              <path
                d="M510.446624 747.426797l-80.920059 95.65907a6.213505 6.213505 0 0 1-10.765258-2.745502l-26.73252-138.069851 52.453539-15.895011zM526.991886 747.426797l80.920059 95.65907a6.213505 6.213505 0 0 0 10.765258-2.745502l32.657024-124.559091-60.690044-21.675016z"
                fill="#D2E9F7"
                p-id="5444"
              />
              <path
                d="M424.902561 861.365131a21.675016 21.675016 0 0 1-5.635504-0.722501 21.675016 21.675016 0 0 1-16.328512-17.123262l-29.550272-152.447612 75.284556-22.831017 84.026811 77.813307-90.890566 107.435829a21.675016 21.675016 0 0 1-16.906513 7.875256z m-14.45001-147.895858l20.013264 103.317575 57.800043-67.9873-47.829535-44.289282z"
                fill="#0686D8"
                p-id="5445"
              />
              <path
                d="M612.535949 861.437381a22.036266 22.036266 0 0 1-16.906513-7.947506l-91.396317-108.013829 83.159811-69.793551 83.304311 29.911522-36.125026 138.792351a21.675016 21.675016 0 0 1-16.111762 16.328512 25.070768 25.070768 0 0 1-5.924504 0.722501z m-62.713046-112.059832l57.800042 68.63755 24.059268-92.046567-37.786778-13.65526z"
                fill="#0686D8"
                p-id="5446"
              />
            </svg>
            <svg
              v-if="scope.row.type == 1"
              t="1576228377973"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3777"
              width="16"
              height="16"
            >
              <path
                d="M457.874286 101.982041v65.898231h-65.898232a37.059048 37.059048 0 0 0 0 73.978776h65.898232v65.898231a37.059048 37.059048 0 0 0 74.118095 0v-65.898231h65.758912a37.059048 37.059048 0 1 0 0-73.978776h-65.758912V101.982041a37.059048 37.059048 0 0 0-74.118095 0zM386.403265 590.854966c-35.66585 0-64.644354 15.882449-64.644353 35.526531s28.978503 35.526531 64.644353 35.52653S451.465578 646.025578 451.465578 626.938776s-29.257143-36.08381-65.062313-36.08381zM644.702041 590.854966c-35.66585 0-64.644354 15.882449-64.644354 35.526531s28.978503 35.526531 64.644354 35.52653 64.644354-15.882449 64.644354-35.52653-28.978503-35.526531-64.644354-35.526531z"
                fill="#ED59A3"
                p-id="3778"
              />
              <path
                d="M892.969796 489.848163l39.984762-353.593469-9.891701-6.687347A729.478095 729.478095 0 0 0 510.397823 0 786.459864 786.459864 0 0 0 104.838095 114.102857l-10.17034 6.826667 40.402721 327.958639C101.076463 504.755374-1.462857 709.137415 117.098231 986.940952h247.710476a333.113469 333.113469 0 0 0 305.388844 0h245.89932s118.561088-329.073197-23.127075-497.092789zM517.503129 980.114286c-181.115646 0-328.097959-163.143401-328.097959-364.181769a399.986939 399.986939 0 0 1 10.44898-91.254422c59.907483 3.622313 211.905306 0 278.639455-125.387755l8.080545 0.696599c39.148844 29.535782 267.354558 197.137415 355.822585 173.035102a405.002449 405.002449 0 0 1 2.368435 43.467755c0.696599 200.481088-146.146395 363.62449-327.262041 363.62449z m336.875102-501.551021c-65.898231-36.08381-243.112925-122.322721-430.08-122.322721A462.402177 462.402177 0 0 0 172.826122 424.78585L137.160272 140.852245a769.184218 769.184218 0 0 1 373.237551-101.146123 688.518095 688.518095 0 0 1 380.482177 116.192654z"
                fill="#ED59A3"
                p-id="3779"
              />
            </svg> -->
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" align="center" width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center" width="70">
          <template slot-scope="scope">
            {{ scope.row.gender | toWorkerGender }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" align="center" min-width="155px">
          <template slot-scope="scope">
            <span>{{ scope.row.idCard }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="refereeName" label="推荐人" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.refereeName">{{ scope.row.refereeName }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="workStatus" align="center" label="状态" min-width="60px">
          <template slot-scope="scope">
            {{ scope.row.workStatus | workFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" align="center" label="接单数" min-width="60px">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="avgScore" align="center" label="评分" min-width="50px">
          <template slot-scope="scope">
            <span>{{ scope.row.avgScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalAvlProfit" align="center" label="可提现">
          <template slot-scope="scope">
            <span>{{ scope.row.totalAvlProfit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalProfit" align="center" label="收益">
          <template slot-scope="scope">
            <span>{{ scope.row.totalProfit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalWithdraw" align="center" label="提现">
          <template slot-scope="scope">
            <span>{{ scope.row.totalWithdraw }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" min-width="140px">
          <template slot-scope="scope">
            <el-button @click="dialogCertList(scope.row.rowId)" type="success" size="small">证书</el-button>
            <el-button @click="toDetail(scope.row)" type="danger" size="small">详情</el-button>
            <!-- <el-button @click="dialogFeeList(scope.row)" type="primary" size="small">费用</el-button> -->
            <!-- <el-button @click="toEditor(scope.row)" type="danger" size="small">编辑</el-button> -->
            <!-- <el-button @click="dialogFeeList(scope.row)" type="primary" size="small">医院</el-button>
            <el-button @click="dialogHomeFeeList(scope.row)" type="primary" size="small">家庭</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 证书弹框 -->
    <div>
      <el-dialog title="资质证书" :visible.sync="dialogVisible" width="70%">
        <div class="certList" v-if="dialogVisible">
          <div class="certItem" v-for="(item, index) in dialogData" :key="index">
            <img :src="item.fileUrl" />
            <span>
              <el-button @click="deleteItem(item)" type="danger" plain size="mini">删 除</el-button>
            </span>
          </div>
        </div>
        <el-button
          @click="uploadCert"
          size="normal"
          style="margin: 20px 0 0 20px;float: right"
          type="primary"
        >点击上传新证书</el-button>
        <input id="fileSelector" ref="fileInput" @change="handleUpload" v-show="false" type="file" />
        <div class="fixed"></div>
      </el-dialog>
    </div>
    <!-- 医院护理费用弹框 -->
    <div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFeeVisible"
        width="50%"
        :before-close="handleToFeeClose"
      >
        <el-table
          ref="selected"
          :data="feeList"
          v-loading="listLoading"
          border
          :stripe="true"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="careStandard" align="center" label="护理等级">
            <template slot-scope="scope">
              <span v-show="!isEdit">{{ scope.row.careStandard | careStandardFilter }}</span>
              <el-select v-show="isEdit" v-model="scope.row.careStandard" name="careStandard">
                <el-option
                  v-for="item in careStandard"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="dayFee" align="center" label="日护理费">
            <template slot-scope="scope">
              <span v-show="!isEdit">{{ scope.row.dayFee }}</span>
              <el-input v-show="isEdit" name="dayFee" v-model="scope.row.dayFee"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="monthFee" align="center" label="月护理费">
            <template slot-scope="scope">
              <span v-show="!isEdit">{{ scope.row.monthFee }}</span>
              <el-input v-show="isEdit" name="monthFee" v-model="scope.row.monthFee"></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.allowDel"
                @click="handleToDelete(scope.$index, feeList)"
                type="danger"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div style="margin: 5px;margin-top:-20px;">
          <el-button size="mini" @click="handleCheckAll">全选</el-button>
          <el-button size="mini" @click="handleCancel">全部取消</el-button>
        </div>
        <el-checkbox-group
          class="checkbox"
          size="mini"
          v-model="checkHospotal"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="(item, key) in hospital"
            :label="key"
            :key="key"
            :border="true"
          >{{item}}</el-checkbox>
        </el-checkbox-group>
        <el-table
          ref="selected"
          :data="feeList"
          v-loading="listLoading"
          border
          empty-text="请先选择医院"
          :stripe="true"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="careStandard" align="center" label="护理等级" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.careStandard" name="careStandard">
                <el-option
                  v-for="item in careStandard"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="singleFee12" align="center" label="12小时独单价格">
            <template slot-scope="scope">
              <el-input name="singleFee12" v-model="scope.row.singleFee12"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="shareFee12" align="center" label="12小时拼单价格">
            <template slot-scope="scope">
              <el-input name="shareFee12" v-model="scope.row.shareFee12"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="singleFee24" align="center" label="24小时独单价格">
            <template slot-scope="scope">
              <el-input name="singleFee24" v-model="scope.row.singleFee24"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="shareFee24" align="center" label="24小时拼单价格">
            <template slot-scope="scope">
              <el-input name="shareFee24" v-model="scope.row.shareFee24"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="acceptShare" align="center" label="是否接受拼单" width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.acceptShare" name="acceptShare">
                <el-option value="Y" label="是" />
                <el-option value="N" label="否" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                @click="handleToDelete(scope.$index, feeList)"
                type="danger"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>-->
        <div class="submit">
          <el-button v-if="feeList.length<4" @click="handleToAdd(feeList)" type="primary">新 增</el-button>
          <el-button v-show="!isEdit" @click="()=>{this.isEdit = !isEdit}" type="danger">编 辑</el-button>
          <el-button v-show="isEdit" @click="handleFeeSave(feeList)" type="success">完 成</el-button>
          <!-- <el-button type="primary" @click="handleFeeSave(feeList)">保 存</el-button> -->
          <!-- <el-button @click="handleToSave(feeList)" type="primary">保 存</el-button>-->
        </div>
        <div class="fixed"></div>
      </el-dialog>
    </div>
    <!-- 家庭护理费用弹框 -->
    <div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogHomeFeeVisible"
        width="60%"
        :before-close="handleToHomeFeeClose"
      >
        <div>
          <!-- 城市 -->
          <!-- <el-checkbox-group
            class="checkbox"
            size="mini"
            v-model="checkCity"
            @change="showDistrict"
          >
            <el-checkbox
              v-for="item in cityList"
              :label="item.rowId"
              :key="item.rowId"
              :border="true"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group> -->
          <!-- 行政区 -->
          <div class="district" v-if="checkCity.length > 0 || checkDistrict.length > 0">
            <div>
              <el-button size="mini" @click="handleCheckHomeAll">全选</el-button>
              <el-button size="mini" @click="handleHomeCancel">全部取消</el-button>
            </div>
            <el-checkbox-group
              class="checkbox"
              size="mini"
              v-model="checkDistrict"
              @change="handleDistrictChange"
            >
              <el-checkbox
                v-for="item in district"
                :label="item.rowId"
                :key="item.rowId"
                :border="true"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
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
            <el-table-column prop="careStandard" align="center" label="护理等级">
              <template slot-scope="scope">
                <el-select v-model="scope.row.careStandard" name="careStandard">
                  <el-option
                    v-for="item in careStandard"
                    :key="item.key"
                    :label="item.label"
                    :value="item.key"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="singleFee12" align="center" label="12小时独单价格">
              <template slot-scope="scope">
                <el-input name="singleFee12" v-model="scope.row.singleFee12"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="singleFee24" align="center" label="24小时独单价格">
              <template slot-scope="scope">
                <el-input name="singleFee24" v-model="scope.row.singleFee24"></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleToDelete(scope.$index, homeFeeList)"
                  type="danger"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="submit">
          <el-button @click="handleSaveHomeFee(homeFeeList)" type="primary">保 存</el-button>
        </div>
        <div class="fixed"></div>
      </el-dialog>
    </div>
    <!-- 分页 -->
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
import {
  fetchList,
  fetchCertificate,
  deleteCert,
  saveCert,
  getFeeList,
  updateFeeList,
  hospitalFeeBatch,
  homeFeeBatchInsert
} from "@/api/nurse";
import { getWorkerFeeDetail, doWorkerFeeEdit } from "@/api/worker/worker";
import { getHasNurseList, getCityList, getDistrictList } from "@/api/hospital";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import upload from "@/components/Upload/upload";
import $ from "jquery";
import COS from "cos-js-sdk-v5";

export default {
  name: "accordingList",
  data() {
    return {
      workerType: this.GLOBAL.workerType,
      careStandard: this.GLOBAL.careStandard,
      workStatus: this.GLOBAL.workStatus,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        status: "1",
        pageNum: 1,
        pageSize: 10
      },
      // hosFilter: this.hosFilter,
      disabled: 1,
      hospital: null, // 医院
      dialogVisible: false, // 证书弹框
      dialogFeeVisible: false, // 医院费用弹框
      dialogHomeFeeVisible: false, ///家庭费用弹框
      dialogData: [], // 证书弹框数据
      rowId: "",
      feeList: [], // 医院费用明细
      homeFeeList: [], //家庭费用明细
      hasNurseList: null, // 医院列表
      checkHospotal: [], // 选择的医院
      checkCity: [], //选择城市
      checkDistrict: [], //选择行政区
      dialogTitle: "", // 弹框title
      cityList: null, //城市
      district: [], //行政区
      isEdit: false, //编辑费用
    };
  },
  beforeRouteEnter (to, from, next) {
    if(from.path === '/'){
      localStorage.removeItem('map')
    }
    next()
  },
  beforeRouteLeave (to, from, next){
    localStorage.setItem('map', JSON.stringify(this.listQuery))
    next()
  },
  created() {
    let map = localStorage.getItem('map')
    if(map){
      this.listQuery = JSON.parse(map)
    }
    this.getList();
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.result.list;
        this.total = response.result.total;
        this.listLoading = false;
        // console.log(this.list)
      });
    },
    getCityList() {
      getCityList().then(res => {
        this.cityList = res.result;
        // console.log(this.cityList);
      });
    },
    // 家庭护理费用弹框
    dialogHomeFeeList(row) {
      this.dialogHomeFeeVisible = true;
      this.dialogTitle = row.realName + "  的家庭护理费用";
      this.rowId = row.rowId;
    },
    // 选择城市展示行政区
    // showDistrict() {
    //   this.checkCity.map(item => {
    //     getDistrictList({ cityId: item }).then(res => {
    //       this.district = res.result;
    //     });
    //   });
    // },
    //选择行政区展示列表
    handleDistrictChange() {
      // console.log(this.checkDistrict);
      if (this.checkDistrict.length > 0) {
        if (this.homeFeeList.length > 0) {
          return;
        } else {
          this.homeFeeList = [
            { careStandard: "0" },
            { careStandard: "1" },
            { careStandard: "2" }
          ];
        }
      } else {
        this.homeFeeList = [];
      }
    },
    handleToHomeFeeClose(done) {
      this.dialogHomeFeeVisible = false;
      this.homeFeeList = [];
      this.checkCity = [];
      this.checkDistrict = [];
      done();
    },
    // 保存家庭护理费用
    handleSaveHomeFee(row) {
      if (this.checkDistrict.length < 1) {
        return this.$message.error("请选择城市!");
      }
      row = this.homeRowFilter(row);
      // console.log("row", row);
      const data = {
        districtList: this.checkDistrict,
        workerId: this.rowId,
        feeList: row
      };
      // console.log("data", data);
      const loading = this.$loading({
        lock: true,
        text: "正在保存...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      homeFeeBatchInsert(data)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "批量插入护工家庭费用明细成功 (^-^)",
            type: "success",
            duration: 6000
          });
          this.homeFeeList = [];
          this.checkCity = [];
          this.checkDistrict = [];
          this.dialogHomeFeeVisible = false;
          loading.close();
        })
        .catch(err => {
          console.log(err);
          loading.close();
          this.$message.error("保存失败，请重试！");
        });
    },
    handleCheckHomeAll() {
      this.district.map(item => {
        this.checkDistrict.push(item.rowId);
      });
      this.homeFeeList = [
        { careStandard: "0" },
        { careStandard: "1" },
        { careStandard: "2" }
      ];
    },
    handleHomeCancel() {
      this.checkDistrict = [];
      this.homeFeeList = [];
    },
    // 查看
    toDetail(row) {
      this.$router.push({
        path: "detail",
        query: {
          id: row.rowId,
          disabled: 1
        }
      });
    },
    // 编辑
    toEditor(row) {
      this.$router.push({
        path: "detail",
        query: {
          id: row.rowId,
          disabled: ""
        }
      });
    },
    uploadCert() {
      this.$refs["fileInput"].click();
    },
    handleUpload() {
      var selectedFile = document.getElementById(`fileSelector`).files[0];
      var filename = selectedFile.name; //文件.name是获取源文件的文件名（固定用法）
      filename = filename.substring(filename.lastIndexOf(".") + 1);
      this.uploadFile(selectedFile, filename, (val, key) => {
        const data = {
          workerId: this.rowId,
          filePath: key
        };
        // console.log(data);
        saveCert(data).then(res => {
          const loading = this.$loading({
            lock: true,
            text: "正在上传...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          if (res.code == "00000000") {
            this.dialogCertList(this.rowId);
            setTimeout(() => {
              this.$message({
                message: "上传成功",
                type: "success"
              });
              loading.close();
            }, 700);
          } else {
            loading.close();
            this.$message.error("上传失败，请重试！");
          }
        });
      });
    },
    // 上传证书
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
      const id = this.rowId;
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
      const key = `${this.UPLOAD_URL}/worker/${
        this.rowId
      }/${new Date().getTime()}\.${filename}`;
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
    },
    // 获取证书
    dialogCertList(id) {
      this.rowId = id;
      this.dialogData = [];
      fetchCertificate({ workerId: id })
        .then(res => {
          this.dialogVisible = true;
          res.result.list.map(item => {
            if (item.workerId == id) {
              this.dialogData.push(item);
            }
          });
        })
        .catch(() => {
          this.$message.error("获取证书失败，请重试！");
        });
    },
    deleteItem(item) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "正在删除...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          deleteCert({ attachId: item.rowId })
            .then(res => {
              if (res.code == "00000000") {
                this.dialogCertList(this.rowId);

                setTimeout(() => {
                  loading.close();
                  this.$message({
                    message: "已删除",
                    type: "success"
                  });
                }, 700);
              } else {
                loading.close();
                this.$message.error("操作失败，请重试！");
              }
            })
            .catch(() => {
              loading.close();
              this.$message({
                type: "info",
                message: "操作失败，请重试！"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    // 费用明细
    // dialogFeeList(row) {
    //   this.dialogFeeVisible = true;
    //   this.rowId = row.rowId;
    //   this.feeList = [];
    //   this.dialogTitle = row.realName + "  的医院护理费用";
    // },
    //费用弹框
    dialogFeeList(row) {
      this.dialogFeeVisible = true;
      this.dialogTitle = row.realName + "  的医院护理费用";
      this.listLoading = true;
      const id = row.rowId;
      this.rowId = id;
      getWorkerFeeDetail({ workerId: id }).then(res => {
        this.feeList = res.result;
        this.listLoading = false;
        // console.log(this.feeList)
      });
    },
    // 过滤价格为空的 改为0
    homeRowFilter(row) {
      row.map(row => {
        if (row.dayFee == "" || row.dayFee == null) {
          row.dayFee = "0";
        }
        if (row.monthFee == "" || row.monthFee == null) {
          row.monthFee = "0";
        }
      });
      return row;
    },
    // 保存费用
    handleFeeSave(row) {
      // console.log(this.rowId)
      // if (!row[0]) {
      //   return;
      // }
      let feeList = []
      row.map(item=>{
        let fee = {
          careStandard: item.careStandard,
          dayFee: item.dayFee,
          monthFee: item.monthFee
        }
        feeList.push(fee)
      })
      feeList = this.homeRowFilter(feeList)
      const data = {
        workerId: this.rowId,
        feeList
      };
      // console.log(data);
      doWorkerFeeEdit(data)
        .then(res => {
          this.$notify({
            title: "操作成功",
            message: "已保存护工的费用明细",
            type: "success",
            duration: 6000
          });
          this.dialogFeeVisible = false;
          this.isEdit = false;
          this.rowId = ''
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 医院
    getHasList() {
      getHasNurseList().then(res => {
        this.hasNurseList = res.result;
        let obj = {};
        res.result.forEach(function(item, index) {
          obj[String(item.rowId)] = item.code;
        });
        this.hospital = obj;
        // console.log("医院", this.hasNurseList);
      });
    },
    handleToFeeClose(done) {
      this.dialogFeeVisible = false;
      this.feeList = [];
      this.isEdit = false;
      this.checkHospotal = [];
      done();
    },
    // 删除
    handleToDelete(index, row) {
      // this.$confirm("确定删除?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "success"
      // })
      //   .then(() => {
          row.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功"
          });
        // })
        // .catch(() => {
        //   this.$message({
        //     type: "info",
        //     message: "取消"
        //   });
        // });
    },
    // 新增
    handleToAdd(row) {
      var l = this.feeList.length;
      this.feeList[l] = {
        workerId: this.rowId,
        careStandard: "0",
        allowDel: true
      };
      this.feeList[l + 1] = {}; //直接在数组中添加一项不会更新视图
      row.splice(l + 1, 1);
      this.$refs["selected"].setCurrentRow(this.feeList[l]);
    },
    // 过滤价格为空的 改为0
    rowFilter(row) {
      row.map(row => {
        if (row.shareFee12 == "" || row.shareFee12 == null) {
          row.shareFee12 = "0";
        }
        if (row.shareFee24 == "" || row.shareFee24 == null) {
          row.shareFee24 = "0";
        }
        if (row.singleFee12 == "" || row.singleFee12 == null) {
          row.singleFee12 = "0";
        }
        if (row.singleFee24 == "" || row.singleFee24 == null) {
          row.singleFee24 = "0";
        }
      });

      return row;
    },
    // 保存
    handleToSave(row) {
      if (this.checkHospotal.length < 1) {
        return this.$message.error("请先选择医院!");
      }
      row = this.rowFilter(row);
      // console.log(row);
      const data = {
        hospitalList: this.checkHospotal,
        workerId: this.rowId,
        feeList: row
      };
      // console.log(data);
      const loading = this.$loading({
        lock: true,
        text: "正在保存...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      hospitalFeeBatch(data)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "批量插入护工医院费用明细成功 (^-^)",
            type: "success",
            duration: 6000
          });
          this.feeList = [];
          this.checkHospotal = [];
          loading.close();
          this.dialogFeeVisible = false;
        })
        .catch(err => {
          loading.close();
          console.log(err);
        });
    },
    // check
    handleCheckedChange() {
      // console.log(this.checkHospotal);
      if (this.checkHospotal.length > 0) {
        if (this.feeList.length > 0) {
          return;
        } else {
          this.feeList = [
            { careStandard: "0", acceptShare: "Y" },
            { careStandard: "1", acceptShare: "Y" },
            { careStandard: "2", acceptShare: "Y" }
          ];
        }
      } else {
        this.feeList = [];
      }
    },
    // 全选
    handleCheckAll() {
      // console.log(this.checkHospotal)
      this.feeList = [
        { careStandard: "0", acceptShare: "Y" },
        { careStandard: "1", acceptShare: "Y" },
        { careStandard: "2", acceptShare: "Y" }
      ];
      this.checkHospotal = Object.keys(this.hospital);
    },
    // 取消全选
    handleCancel() {
      this.feeList = [];
      this.checkHospotal = [];
    }
  },
  filters: {
    genderFilter(status) {
      const statusMap = {
        0: "danger",
        1: "primary",
        2: "info"
      };
      return statusMap[status];
    },
    workStatusFilter(status) {
      const statusMap = {
        0: "primary",
        1: "danger",
        2: "info"
      };
      return statusMap[status];
    }
  },
  components: {
    Pagination,
    upload
  }
};
</script>

<style lang="scss" scope>
.district {
  border: 1px dashed #dfe6ec;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px;
}
.fixed {
  height: 0;
  clear: both;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.filter-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  .filter-item {
    margin-left: 10px;
  }
}
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
.certList {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  .certItem {
    span {
      float: left;
    }
    img {
      max-width: 320px;
      max-height: 200px;
      margin: 10px 20px;
    }
    button {
      margin: 10px 0;
      margin-left: 20px;
    }
  }
}
.is-center {
  .cell {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    button {
      margin: 3px;
    }
  }
}
.submit {
  float: right;
  margin-top: 20px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
.checkbox {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  label {
    margin: 5px;
  }
}
</style>