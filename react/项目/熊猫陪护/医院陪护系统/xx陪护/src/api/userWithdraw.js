import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/userWithdraw/pageList',
    method: 'post',
    data
  })
}

export function updateProgress(data) {
  return request({
    url: '/userWithdraw/updateProgress',
    method: 'post',
    data
  })
}