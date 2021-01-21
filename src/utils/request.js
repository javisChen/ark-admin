import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import {VueAxios} from './axios'
import {SUCCESS_CODE} from './code'
import {ACCESS_TOKEN} from '@/store/mutation-types'
import api from "@/api/route-api";

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

const post = ({url, params, data}) => request({url, method: 'post', params, data})

const get = ({url, params, data}) => request({url, method: 'get', params, data})

const put = ({url, params, data}) => request({url, method: 'put', params, data})

const del = ({url, params, data}) => request({url, method: 'delete', params, data})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    if (error.response.status === 400 || error.response.status === 500) {
      const result = error.response.data
      let description;
      const {code, msg, data} = result
      if (code === 'A0003') {
        description = result.data.defaultMsg
      } else {
        description = result.msg
      }
      notification.error({
        message: '出了点小问题~',
        description,
        duration: 4
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  // config.headers['X-DEV-MODE'] = `DEV`
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  const serverResponse = response.data
  if (serverResponse.code === SUCCESS_CODE) {
    return Promise.resolve({data: serverResponse.data, resp: serverResponse})
  }
  return Promise.reject(serverResponse)
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios,
  post,
  get,
  del,
  put,
}
