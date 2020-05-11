import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/bed/getPageList',
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

export function getDetail(data){
  return request({
    url: '/bed/getDetail',
    method: 'post',
    data
  })
}

export function doEditBed(data){
  return request({
    url: '/bed/doEdit',
    method: 'post',
    data
  })
}

export function doEnable(data){
  return request({
    url: '/bed/doEnable',
    method: 'post',
    data
  })
}

export function queryStatus(data){
  return request({
    url: '/bed/queryStatus',
    method: 'post',
    data
  })
}