import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/card/getCustomerCardPageList',
    method: 'post',
    data
  })
}

export function updateCustomerCard(data) {
  return request({
    url: '/card/updateCustomerCard',
    method: 'post',
    data
  })
}
