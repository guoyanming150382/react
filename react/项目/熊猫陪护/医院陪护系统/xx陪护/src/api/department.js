import request from '@/utils/request'

export function getDepartmentList(data) {
  return request({
    url: '/department/getList',
    method: 'post',
    data
  })
}