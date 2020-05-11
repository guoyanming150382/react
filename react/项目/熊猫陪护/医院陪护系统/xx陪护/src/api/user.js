import request from '@/utils/request'


export function fetchList(data) {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function fetchPage(data) {
  return request({
    url: '/user/page',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getUserInfo',
    method: 'get'
  })
}

export function userRoles(userId) {
  return request({
    url: '/role/user/'+userId,
    method: 'get'
  })
}
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: '/user/'+id,
    method: 'delete'
  })
}

export function toggle(userId) {
  return request({
    url: '/user/toggle/'+userId,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function auth(data) {
  return request({
    url: '/user/auth',
    method: 'post',
    data
  })
}
