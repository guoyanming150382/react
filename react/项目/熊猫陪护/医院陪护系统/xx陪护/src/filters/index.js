// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function toUserRole(role) {
  const roleValue = {
    '0': 'Admin',
    '1': 'Manager',
    '2': 'School Dept.',
    '3': 'Market Detp. Agent',
    '4': 'Accountant',
    '5': 'Staff'
  }
  return roleValue[role]
}

export function toUsageFlag(type) {
  const typeValue = {
    'N': '未使用',
    'Y': '使用中'
  }
  return typeValue[type]
}

export function toEnableFlag(type) {
  const typeValue = {
    'N': '未启用',
    'Y': '已启用'
  }
  return typeValue[type]
}

export function toYesNo(type) {
  const typeValue = {
    'N': '否',
    'Y': '是'
  }
  return typeValue[type]
}

export function toOrderPayMethod(type) {
  const typeValue = {
    '0': '预付卡',
    '1': '陪护卡',
    '2': '开锁码',
    '3': 'VIP'
  }
  return typeValue[type]
}

export function toOrderStatus(type) {
  const typeValue = {
    '0': '开锁中',
    '1': '使用中',
    '2': '开锁异常',
    '3': '欠费代缴',
    '4': '退款中',
    '5': '正常结束',
    '7': '异常结束'
  }
  return typeValue[type]
}

export function toReturnStatus(type) {
  const typeValue = {
    '0': '提前还床',
    '1': '准时还床',
    '2': '超时还床'
  }
  return typeValue[type]
}

export function toCustomerGender(type) {
  const typeValue = {
    '0': '未知',
    '1': '男',
    '2': '女'
  }
  return typeValue[type]
}

export function toWorkerGender(type) {
  const typeValue = {
    '0': '女',
    '1': '男',
    '2': '未知'
  }
  return typeValue[type]
}

export function toCardType(type) {
  const typeValue = {
    '0': '小时卡',
    '1': '包天卡',
    '2': '周卡',
    '3': '月卡',
    '4': '次卡'
  }
  return typeValue[type]
}

export function toTransStatus(type) {
  const typeValue = {
    '0': '付款中',
    '1': '成功',
    '2': '失败'
  }
  return typeValue[type]
}

export function toCustomerCardStatus(type) {
  const typeValue = {
    '0': '失效',
    '1': '生效'
  }
  return typeValue[type]
}

export function toRefundStatus(type) {
  const typeValue = {
    '0': '不退款',
    '1': '可退款',
    '2': '退款中',
    '3': '已退款'
  }
  return typeValue[type]
}

export function toProfitType(type) {
  const typeValue = {
    '0': '公司',
    '1': '运营商',
    '2': '渠道商',
    '3': '床主'
  }
  return typeValue[type]
}

export function toWithdrawStatus(type) {
  const typeValue = {
    '0': '待审批',
    '1': '审批通过',
    '2': '审批被拒',
    '3': '提现完成',
    '4': '提现失败'

  }
  return typeValue[type]
}

export function toBedBuyRecordStatus(type) {
  const typeValue = {
    '0': '未签字',
    '1': '签字完成',
    '2': '付款中',
    '3': '认购完成',
    '4': '认购失败',
    '5': '已退购'
  }
  return typeValue[type]
}

export function toBedBuyPayMethod(type) {
  const typeValue = {
    '0': '线上',
    '1': '线下'
  }
  return typeValue[type]
}

export function toBedRefundStatus(type) {
  const typeValue = {
    '0': '待审批',
    '1': '已退款',
    '2': '已驳回'
  }
  return typeValue[type]
}

export function toApproveStatus(type) {
  const typeValue = {
    '0': '未提交',
    '1': '待审核',
    '2': '审核通过',
    '3': '未通过'
  }
  return typeValue[type]
}

export function toCareOrderType(type) {
  const typeValue = {
    '0': '独单',
    '1': '拼单'
  }
  return typeValue[type]
}

export function toCareOrderStatus(type) {
  const typeValue = {
    '0': '待支付',
    '1': '待接单',
    '2': '已拒单',
    '3': '待服务',
    '4': '服务中',
    '5': '待评价',
    '6': '订单完成',
    '7': '申请取消',
    '8': '申请终止',
    '9': '订单取消'
  }
  return typeValue[type]
}

export function toCareSource(type) {
  const typeValue = {
    0: '小程序',
    1: '公众号'
  }
  return typeValue[type]
}

export function toStatus(type) {
  const typeValue = {
    0: '审批中',
    1: '通过',
    2: '未通过'
  }
  return typeValue[type]
}

export function workFilter(type) {
  const typeValue = {
    0: '空闲',
    1: '忙碌'
  }
  return typeValue[type]
}

export function levelFilter(type) {
  const typeValue = {
    0: "初级护理员",
    1: "中级护理员",
    2: "高级护理员"
  }
  return typeValue[type]
}

export function careStandardFilter(type) {
  const typeValue = {
    0: "可以自理",
    1: "协助自理",
    2: "不能自理",
    3: "器切"
  }
  return typeValue[type]
}

export function careTypeFilter(type) {
  const typeValue = {
    0: "医院护理",
    1: "生活照护",
    2: "随心护"
  }
  return typeValue[type]
}

export function orderStatusFilter(type) {
  const typeValue = {
    0: "待提交",
    1: "待支付",
    2: "待发布",
    3: "发布中",
    4: "服务中",
    5: "尾款待退",
    6: "尾款待缴",
    7: "已完成",
    8: "已取消",
    9: "取消退款中",
    10: "已退款",
    11: "未支付退款"
  }
  return typeValue[type]
}

export function orderTypeFilter(type) {
  const typeValue = {
    0: "按日计费",
    1: "包月收费"
  }
  return typeValue[type]
}

export function timeTypeFilter(type) {
  const typeValue = {
    0: "12小时",
    1: "24小时"
  }
  return typeValue[type]
}

export function discountTypeFilter(type) {
  const typeValue = {
    0: "无折扣",
    1: "优惠券",
    2: "首单立减"
  }
  return typeValue[type]
}

export function formatZero(val) {
  if (val == null || val == undefined) {
    return 0
  }
  return val
}

export function bedTypeFilter(type) {
  const typeValue = {
    0: "床头柜",
    1: "走廊折叠床"
  }
  return typeValue[type]
}

export function lockTypeFilter(type) {
  const typeValue = {
    0: "NokeLock(2G)",
    1: "YKP(NB)"
  }
  return typeValue[type]
}

export function updateStatusFilter(type) {
  const typeValue = {
    0: "异常",
    1: "正常"
  }
  return typeValue[type]
}

export function workerProfitFilter(type) {
  const typeValue = {
    0: "签到收益",
    1: "订单收益",
    2: "推荐收益"
  }
  return typeValue[type]
}

export function profitStatusFilter(type) {
  const typeValue = {
    0: "未提现",
    1: "审核中",
    2: "已提现"
  }
  return typeValue[type]
}

export function peopleType(type) {
  const typeValue = {
    0: "客户",
    1: "平台",
    2: "门户"
  }
  return typeValue[type]
}

export function timeType(type) {
  const typeValue = {
    0: "天",
    1: "月"
  }
  return typeValue[type]
}

export function cusGender(type) {
  const typeValue = {
    0: "女",
    1: "男",
    2: "不限"
  }
  return typeValue[type]
}

export function cusOrderStatus(type) {
  const typeValue = {
    0: "待下单",
    1: "待支付",
    2: "发布中",
    3: "已接单",
    4: "订单撤销",
    5: "支付失败"
  }
  return typeValue[type]
}

export function payMethodFilter(type) {
  const typeValue = {
    0: "全额预付",
    1: "首月预付",
    2: "7天付款",
  }
  return typeValue[type]
}

export function billTypeFilter(type) {
  const typeValue = {
    0: "日单预付",
    1: "月单预付",
    2: "日续预付",
    3: "月续预付",
    4: "提价",
    5: "周期结款",
    6: "尾款",
    7: "提前退款",
    8: "提前尾款",
    9: "取消退款",
    10: "提前结全款",
  }
  return typeValue[type]
}

export function billStatusFilter(type) {
  const typeValue = {
    0: "待付",
    1: "已付",
    2: "退款中",
    3: "退款完成",
  }
  return typeValue[type]
}

export function workerBillType(type) {
  const typeValue = {
    0: "首笔结款",
    1: "正常结款",
    2: "尾款结款",
    3: "押金结款",
    4: "提前结束结款",
  }
  return typeValue[type]
}

export function workerBillStatus(type) {
  const typeValue = {
    0: "待结款",
    1: "已结款",
  }
  return typeValue[type]
}

export function creditFilter(type) {
  const typeValue = {
    0: "签到积分",
    1: "账单支付",
    2: "账单逾期",
  }
  return typeValue[type]
}

export function withDrawStatus(type) {
  const typeValue = {
    0: "待处理",
    1: "审批通过",
    2: "审批被拒",
    3: "提现完成",
    4: "提现失败",
  }
  return typeValue[type]
}

export function workerTransType(type) {
  const typeValue = {
    0: "签到收益",
    1: "结款收益",
    2: "提现收益",
    3: "订单推荐收益",
    4: "订单取消补偿",
  }
  return typeValue[type]
}

export function careOrderFilter(type) {
  const typeValue = {
    0: "实时定制单",
    1: "预约定制订单",
    2: "定向单",
  }
  return typeValue[type]
}

export function anyCareTypeFilter(type) {
  const typeValue = {
    0: "其他定制",
    1: "医院陪检",
    2: "做饭",
    3: "水电维修",
    4: "扫地拖地",
    5: "遛狗",
    6: "餐具清洁",
    7: "代取代送"
  }
  return typeValue[type]
}

export function accTypeFilter(type) {
  const typeValue = {
    0: "代金券账户",
    1: "现金账户",
    2: "余额账户",
  }
  return typeValue[type]
}

export function vipLevel(type) {
  const typeValue = {
    0: "会员",
    1: "vip会员",
    2: "银牌会员",
    3: "金牌会员"
  }
  return typeValue[type]
}