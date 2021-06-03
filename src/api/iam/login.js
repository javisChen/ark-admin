import request from '@/utils/request'
import Base from "./iam-base-api";


const userApi = {
  Login: Base.serviceName + '/auth/login',
  Logout: Base.serviceName + '/auth/logout',
  ForgePassword: Base.serviceName + '/auth/forge-password',
  Register: Base.serviceName + '/auth/register',
  twoStepCode: Base.serviceName + '/auth/2step-code',
  SendSms: Base.serviceName + '/account/sms',
  SendSmsErr: Base.serviceName + '/account/sms_err',
  UserInfo: Base.serviceName + '/user/info',
  UserMenu: Base.serviceName + '/user/routes'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha(parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav() {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step(parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
