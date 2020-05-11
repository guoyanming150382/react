import request from '@/utils/request-worker'

//查询医院护理费用
export function getWorkerFeeDetail(data){
  return request({
    url: '/admin/hosFee/getWorkerFeeDetail',
    method: 'post',
    data
  })
}

//编辑医院护理费用
export function doWorkerFeeEdit(data){
  return request({
    url: '/admin/hosFee/doWorkerFeeEdit',
    method: 'post',
    data
  })
}

//查询医院护理费用列表
export function getHosFeeList(data){
  return request({
    url: '/admin/hosFee/getPageList',
    method: 'post',
    data
  })
}

//医院费用明细编辑
export function doHosFeeUpdate(data){
  return request({
    url: '/admin/hosFee/doUpdate',
    method: 'post',
    data
  })
}

//医院费用明细删除
export function doHosFeeDelete(data){
  return request({
    url: '/admin/hosFee/doDelete',
    method: 'post',
    data
  })
}

// 定制单列表查询
export function getCustomOrder(data){
  return request({
    url: '/admin/cusOrder/getPageList',
    method: 'post',
    data
  })
}

// 定制单发布
export function createCusOrder(data){
  return request({
    url: '/admin/careOrder/createCusOrder',
    method: 'post',
    data
  })
}

// 发布定制单
export function doPublishOrder(data){
  return request({
    url: '/admin/cusOrder/doPublish',
    method: 'post',
    data
  })
}

// 拒绝定制单
export function rejectPublish(data){
  return request({
    url: '/admin/cusOrder/rejectPublish',
    method: 'post',
    data
  })
}

// 查看定制单抢单人列表
export function getCusOrderList(data){
  return request({
    url: '/admin/careOrder/getCusOrderWorkerList',
    method: 'post',
    data
  })
}

// 定制单派单
export function cusOrderConfirm(data){
  return request({
    url: '/admin/careOrder/cusOrderConfirm',
    method: 'post',
    data
  })
}

// 定制单派单
export function removeCusWorker(data){
  return request({
    url: '/admin/careOrder/rmvCusWorker',
    method: 'post',
    data
  })
}

// 客户账单
export function getCusBill(data){
  return request({
    url: '/admin/bill/getCusBillPageList',
    method: 'post',
    data
  })
}

// 护工账单
export function getWorkerBill(data){
  return request({
    url: '/admin/bill/getWorkerBillPageList',
    method: 'post',
    data
  })
}

// 护工结款
export function workerBillCheck(data){
  return request({
    url: '/admin/bill/workerBillCheck',
    method: 'post',
    data
  })
}

// 客户积分明细
export function getCusCredit(data){
  return request({
    url: '/admin/cus/getCreditPageList',
    method: 'post',
    data
  })
}

// 护工积分明细
export function getWorkerCredit(data){
  return request({
    url: '/admin/worker/getCreditPageList',
    method: 'post',
    data
  })
}

// 护工资金流水列表
export function getWorkerTrans(data){
  return request({
    url: '/admin/worker/getTransPageList',
    method: 'post',
    data
  })
}

// 护工提现列表
export function getWithDraw(data){
  return request({
    url: '/admin/worker/getWithDrawPageList',
    method: 'post',
    data
  })
}

// 护工提现确认
export function processWithdraw(data){
  return request({
    url: '/admin/worker/processWithdraw',
    method: 'post',
    data
  })
}

// 红包流水
export function getRedPackPageList(data){
  return request({
    url: '/admin/trans/getRedPackPageList',
    method: 'post',
    data
  })
}

// 发红包
export function sendRedPack(data){
  return request({
    url: '/admin/trans/sendRedPack',
    method: 'post',
    data
  })
}

// 资金明细
export function getCusTrans(data){
  return request({
    url: '/admin/cus/getTransPageList',
    method: 'post',
    data
  })
}

// vip认购
export function getVipTransPageList(data){
  return request({
    url: '/admin/cus/getVipTransPageList',
    method: 'post',
    data
  })
}