import request from '@/utils/request-worker'

export function getHospitalList() {
  return request({
    url: '/hospital/getList',
    method: 'get'
  })
}

export function getHasNurseList() {
  return request({
    url: '/hospital/getHasNurseList',
    method: 'get'
  })
}

export function getCityList() {
  return request({
    url: '/city/getList',
    method: 'post'
  })
}

export function getDistrictList(data) {
  return request({
    url: '/district/getListByCity',
    method: 'post',
    data
  })
}