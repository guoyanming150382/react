import request from '@/utils/request-bed'

// 床列表
export function fetchList(data) {
  return request({
    url: '/admin/bed/getPageList',
    method: 'post',
    data
  })
}

export function fetchMyBedList(data) {
  return request({
    url: '/bed/getMyBedList',
    method: 'post',
    data
  })
}

export function updateBed(data) {
  return request({
    url: '/bed',
    method: 'put',
    data
  })
}

export function remoteOpen(data) {
  return request({
    url: '/bed/remoteOpen',
    method: 'post',
    data
  })
}

// 查询陪护床详情
export function getDetail(data){
  return request({
    url: '/admin/bed/getDetail',
    method: 'post',
    data
  })
}

// 编辑陪护床详情
export function doEditBed(data){
  return request({
    url: '/admin/bed/doEdit',
    method: 'post',
    data
  })
}

// 陪护床启停
export function doEnable(data){
  return request({
    url: '/admin/bed/doEnable',
    method: 'post',
    data
  })
}

// 床查询
export function queryStatus(data){
  return request({
    url: '/admin/bed/queryStatus',
    method: 'post',
    data
  })
}

// 查询陪护床订单列表
export function fetchOrderList(data) {
  return request({
    url: '/admin/order/getPageList',
    method: 'post',
    data
  })
}

// 手动结束订单
export function manualClose(data) {
  return request({
    url: '/admin/order/manualClose',
    method: 'post',
    data
  })
}

// 陪护卡认购记录列表
export function fetchCardList(data) {
  return request({
    url: '/admin/cusCard/pageList',
    method: 'post',
    data
  })
}