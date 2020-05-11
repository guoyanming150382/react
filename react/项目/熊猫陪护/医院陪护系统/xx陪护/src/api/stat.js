import request from '@/utils/request'

export function getStatData() {
  return request({
    url: '/stat/getStatData',
    method: 'get'
  })
}

export function hospitalStat(data) {
  return request({
    url: '/stat/getBedStatByHospital',
    method: 'post',
    data
  })
}

export function departStat(data) {
  return request({
    url: '/stat/getBedStatByDepart',
    method: 'post',
    data
  })
}

export function subDepartStat(data) {
  return request({
    url: '/stat/getDepartBedList',
    method: 'post',
    data
  })
}

export function getCooStatData(data) {
  return request({
    url: '/stat/getCooStatData',
    method: 'get'
  })
}
