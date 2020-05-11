import request from '@/utils/request'


export function getStats() {
  return request({
    url: '/stat/getCooStatData',
    method: 'get'
  })
}

export function getProfitList(data) {
  return request({
    url: 'userStat/getMyStat',
    method: 'post',
    data
  })
}

export function myProfitList(data) {
  return request({
    url: 'profit/getMyProfitPageList',
    method: 'post',
    data
  })
}

export function myBedList(data) {
  return request({
    url: 'bed/getMyBedList',
    method: 'post',
    data
  })
}

export function myAmount(data) {
  return request({
    url: 'withdraw/getWithDrawLimit',
    method: 'post',
    data
  })
}
export function drawCash(data) {
  return request({
    url: 'withdraw/applyWithDraw',
    method: 'post',
    data
  })
}


