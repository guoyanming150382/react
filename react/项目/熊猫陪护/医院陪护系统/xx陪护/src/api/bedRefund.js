import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/bedRefund/pageList',
    method: 'post',
    data
  })
}

export function updateProgress(data) {
  return request({
    url: '/bedRefund/updateProgress',
    method: 'post',
    data
  })
}