import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/bedBuy/pageList',
    method: 'post',
    data
  })
}

export function confirmOffLinePay(data) {
  return request({
    url: '/bedBuy/confirmOffLinePay',
    method: 'post',
    data
  })
}
