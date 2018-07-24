import request from '@/utils/request'

export function loginByUsername(params) {
  return request({
    url: '/oauth/token',
    method: 'post',
    data: params
  })
}

export function logout() {
  return request({
    url: '/revoke/token',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getUserPrivilege() {
  return request({
    url: '/user/privilege',
    method: 'get'
  })
}

export function sendsms(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    params: data
  })
}

