import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/withdraw/pageList',
    method: 'post',
    data
  })
}

export function updateProgress(data) {
  return request({
    url: '/withdraw/updateProgress',
    method: 'post',
    data
  })
}