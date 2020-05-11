import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/customer/pageList',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/customer',
    method: 'put',
    data
  })
}
