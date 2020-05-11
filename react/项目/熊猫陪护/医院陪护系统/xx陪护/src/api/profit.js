import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/profit/pageList',
    method: 'post',
    data
  })
}

export function getMyProfitPageList(data) {
  return request({
    url: '/profit/getMyProfitPageList',
    method: 'post',
    data
  })
}
