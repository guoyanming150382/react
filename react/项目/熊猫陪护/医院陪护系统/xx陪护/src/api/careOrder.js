import request from '@/utils/request-worker.js'

export function fetchList(data) {
  return request({
    url: '/admin/careOrder/getPageList',
    method: 'post',
    data
  })
}

export function progress(data) {
  return request({
    url: '/admin/careOrder/orderProgress',
    method: 'post',
    data
  })
}

export function getDetail(data) {
  return request({
    url: '/admin/careOrder/getOrderDetail',
    method: 'post',
    data
  })
}

// 确认支付
export function confirmPay(data) {
  return request({
    url: '/admin/careOrder/confirmPay',
    method: 'post',
    data
  })
}
