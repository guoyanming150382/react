import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    code: username,
    passwd: password
  }
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/getUserInfo',
    method: 'get',
    params: { token }
  })
}


