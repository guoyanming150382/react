import request from '@/utils/request'


export function fetchPage(data) {
  return request({
    url: '/role/page',
    method: 'post',
    data
  })
}

export function fetchList() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}
export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
