const useRole = [
  { key: '0', label: 'Admin' },
  { key: '1', label: 'Manager' },
  { key: '2', label: 'School Dept. Staff' },
  /* { key: '3', label: 'Market Dept. (Agent)' }, */
  { key: '4', label: 'Accountant' },
  { key: '5', label: 'Normal Staff' }
]

const usageFlag = [
  { key: 'Y', label: '使用中' },
  { key: 'N', label: '未使用' }
]

const orderPayMethod = [
  { key: '0', label: '预付卡' },
  { key: '1', label: '陪护卡' },
  { key: '2', label: '开锁码' },
  { key: '3', label: 'VIP' }
]

const orderStatus = [
  { key: '0', label: '开锁中' },
  { key: '1', label: '使用中' },
  { key: '2', label: '开锁异常' },
  { key: '3', label: '欠费代缴' },
  { key: '4', label: '退款中' },
  { key: '5', label: '正常结束' },
  { key: '7', label: '异常结束' }
]

const customerGender = [
  { key: '0', label: '未知' },
  { key: '1', label: '男' },
  { key: '2', label: '女' }
]

const cardType = [
  { key: '0', label: '小时卡' },
  { key: '1', label: '包天卡' },
  { key: '2', label: '周卡' },
  { key: '3', label: '月卡' },
  { key: '4', label: '次卡' }
]

const transStatus = [
  { key: '0', label: '付款中' },
  { key: '1', label: '成功' },
  { key: '2', label: '失败' }
]

const refundStatus = [
  { key: '0', label: '不退款' },
  { key: '1', label: '可退款' },
  { key: '2', label: '退款中' },
  { key: '3', label: '已退款' }
]

const profitType = [
  { key: '0', label: '公司收益' },
  { key: '1', label: '运营商收益' },
  { key: '2', label: '渠道商收益' },
  { key: '3', label: '床主收益' }
]

const withdrawStatus = [
  { key: '0', label: '待审批' },
  { key: '1', label: '审批通过' },
  { key: '2', label: '审批被拒' },
  { key: '3', label: '提现完成' },
  { key: '4', label: '提现失败' }
]

const bedBuyRecordStatus = [
  { key: '0', label: '未签字' },
  { key: '1', label: '签字完成' },
  { key: '2', label: '付款中' },
  { key: '3', label: '认购完成' },
  { key: '4', label: '认购失败' },
  { key: '5', label: '已退购' }
]

const bedBuyPayMethod = [
  { key: '0', label: '线上' },
  { key: '1', label: '线下' }
]

const yesNo = [
  { key: 'Y', label: '是' },
  { key: 'N', label: '否' }
]

const workerGender = [
  { key: '0', label: '女' },
  { key: '1', label: '男' }
]

const bedRefundStatus = [
  { key: '0', label: '审批中' },
  { key: '1', label: '已退款' },
  { key: '2', label: '已驳回' }
]

const careOrderStatus = [
  { key: '0', label: '待提交' },
  { key: '1', label: '待支付' },
  { key: '2', label: '待发布' },
  { key: '3', label: '发布中' },
  { key: '4', label: '服务中' },
  { key: '5', label: '尾款待退' },
  { key: '6', label: '尾款待缴' },
  { key: '7', label: '已完成' },
  { key: '8', label: '已取消' },
  { key: '9', label: '取消退款中' },
  { key: '10', label: '已退款' },
  { key: '11', label: '未支付取消' },
]

const sourceFilter = [
  { key: '0', label: '小程序'},
  { key: '1', label: '公众号'}
]

const careStandard = [
  { key: '0', label: '可以自理' },
  { key: '1', label: '协助自理' },
  { key: '2', label: '不能自理' },
  { key: '3', label: '气切' }
]

const workStatus = [
  { key: '0', label: '空闲' },
  { key: '1', label: '忙碌' }
]

const toStatusQuery = [
  { key: '0', label: '审批中' },
  { key: '1', label: '通过' },
  { key: '2', label: '未通过' }
]

const approveStatus = [
  { key: '0', label: '未提交' },
  { key: '1', label: '待审核' },
  { key: '2', label: '审核通过' },
  { key: '3', label: '未通过' }
]

const toDegree = [
  { key: '0', label: '小学' },
  { key: '1', label: '初中' },
  { key: '2', label: '高中' },
  { key: '3', label: '本科' },
  { key: '4', label: '硕士' }
]

const maritalStatus = [
  { key: '0', label: '未婚' },
  { key: '1', label: '已婚' },
  { key: '2', label: '离异' },
  { key: '3', label: '丧偶' }
]

const toLevel = [
  { key: '0', label: '初级护理员' },
  { key: '1', label: '中级护理员' },
  { key: '2', label: '高级护理员' }
]

const careType = [
  { key: '0', label: '医院护理' },
  { key: '1', label: '家庭护理' }
]

const bedType = [
  { key: '0', label: '床头柜' },
  { key: '1', label: '走廊折叠床' }
]

const enableFlag = [
  { key: 'Y', label: '启用' },
  { key: 'N', label: '停用' }
]

const lockType = [
  { key: '0', label: 'NokeLock(2G)' },
  { key: '1', label: 'YKP(NB)' }
]

const workerType = [
  {key: '0', label: '照护师'},
  {key: '1', label: '护士'}
]

const workerProfitType = [
  {key: '0', label: '签到收益'},
  {key: '1', label: '订单收益'},
  {key: '2', label: '推荐收益'}
]

const workerProfitStatus = [
  {key: '0', label: '未提现'},
  {key: '1', label: '审核中'},
  {key: '2', label: '已提现'}
]

const profitStatus = [
  {key: '0', label: '失效'},
  {key: '1', label: '生效'}
]

const peopleTypeG = [
  {key: '0', label: '客户'},
  {key: '1', label: '平台'}
]

const timeTypeG = [
  {key: '0', label: '天'},
  {key: '1', label: '月'}
]

const orderStatusG = [
  {key: '0', label: '待下单'},
  {key: '1', label: '待支付'},
  {key: '2', label: '发布中'},
  {key: '3', label: '已接单'},
  {key: '4', label: '订单撤销'},
  {key: '5', label: '支付失败'}
]

const cusGender = [
  {key: '0', label: '女'},
  {key: '1', label: '男'},
  {key: '2', label: '不限'}
]

const billType = [
  {key: '0', label: '日单预付'},
  {key: '1', label: '月单预付'},
  {key: '2', label: '日续预付'},
  {key: '3', label: '月续预付'},
  {key: '4', label: '提价'},
  {key: '5', label: '周期结款'},
  {key: '6', label: '尾款'},
  {key: '7', label: '提前退款'},
  {key: '8', label: '提前尾款'},
  {key: '9', label: '取消退款'},
  {key: '10', label: '提前结全款'},
]

const billStatus = [
  {key: '0', label: '待付'},
  {key: '1', label: '已付'},
  {key: '2', label: '退款中'},
  {key: '3', label: '退款完成'}
] 

const workerBillType = [
  {key: '0', label: '首笔结款'},
  {key: '1', label: '正常结款'},
  {key: '2', label: '尾款结款'},
  {key: '3', label: '押金结款'},
  {key: '4', label: '提前结束结款'}
]

const workerBillStatus = [
  {key: '0', label: '待结款'},
  {key: '1', label: '已结款'}
]

const creditType = [
  {key: '0', label: '签到积分'},
  {key: '1', label: '账单支付'},
  {key: '2', label: '账单逾期'}
]

const withDrawType = [
  {key: '0', label: '微信'},
  {key: '1', label: '银行卡'},
  {key: '2', label: '线下'}
]

const transType = [
  {key: '0', label: '签到收益'},
  {key: '1', label: '结款收益'},
  {key: '2', label: '提现收益'},
  {key: '3', label: '订单推荐收益'},
  {key: '4', label: '订单取消补偿'}
]

const accType = [
  {key: '0', label: '代金券账户'},
  {key: '1', label: '现金账户'},
  {key: '2', label: '余额账户'}
]

const vipLevel = [
  {key: '0', label: '会员'},
  {key: '1', label: 'VIP会员'},
  {key: '2', label: '银牌会员'},
  {key: '3', label: '金牌会员'}
]

const pickerOptions = [
  {
    shortcuts: [
      {
        text: "最近一天",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近一周",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近一个月",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近三个月",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
        }
      }
    ]
  }
]

export default
{
  useRole,
  usageFlag,
  orderPayMethod,
  orderStatus,
  customerGender,
  cardType,
  transStatus,
  refundStatus,
  profitType,
  yesNo,
  withdrawStatus,
  bedBuyPayMethod,
  bedBuyRecordStatus,
  workerGender,
  bedRefundStatus,
  careOrderStatus,
  sourceFilter,
  careStandard,
  workStatus,
  toStatusQuery,
  approveStatus,
  toDegree,
  maritalStatus,
  toLevel,
  careType,
  bedType,
  enableFlag,
  lockType,
  workerType,
  workerProfitType,
  workerProfitStatus,
  profitStatus,
  peopleTypeG,
  timeTypeG,
  orderStatusG,
  cusGender,
  billType,
  billStatus,
  workerBillType,
  workerBillStatus,
  creditType,
  withDrawType,
  transType,
  accType,
  vipLevel,
  pickerOptions
}
