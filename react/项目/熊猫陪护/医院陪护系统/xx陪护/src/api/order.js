import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/order/getPageList',
    method: 'post',
    data
  })
}

export function manualClose(data) {
  return request({
    url: '/order/manualClose',
    method: 'post',
    data
  })
}