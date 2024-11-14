import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import {VueAxios} from './axios'
import {SUCCESS_CODE} from './code'
import {ACCESS_TOKEN} from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 1000 * 60 // 请求超时时间
})

const post = ({url, params, data}) => request({url, method: 'post', params, data})

const get = ({url, params, data}) => request({url, method: 'get', params, data})

const put = ({url, params, data}) => request({url, method: 'put', params, data})

const del = ({url, params, data}) => request({url, method: 'delete', params, data})

// 异常拦截处理器
const errorHandler = (error) => {
  const response = error.response;
  if (response) {
    const responseStatus = response.status;
    const data = response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (responseStatus === 403) {
      notification.error({
        message: '拒绝访问：权限不足',
        // description: data.msg
        description: '请联系管理员授权'
      })
    } else if (responseStatus === 404) {
      notification.error({
        message: '服务器找不到资源~',
        description: data.msg
      })
    } else if (responseStatus === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: '认证已失效，请重新登录',
        description: response.msg
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    } else if (responseStatus === 400 || responseStatus === 500) {
      const result = response.data
      let description;
      const {code, msg, data} = result
      if (code === 'A0003') {
        description = result.data.defaultMsg
      } else {
        description = result.msg
      }

      description = description || '服务器有点小问题，请稍等...'
      message.error({
        content: description,
        duration: 4
      })
    } else if (responseStatus === 503) {
      let msg
      if (response.data) {
        msg = response.data.msg
      } else {
        msg = response.statusText
      }
      message.error({
        content: msg,
        duration: 10
      })
    } else {
      message.error({
        content: response.data.msg,
        duration: 4
      })
    }
  } else {
    message.error({
      content: '服务器长时间未响应，请检查网络连接或稍后再试。',
      duration: 4
    });
    return Promise.reject(error);
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
  return config

}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  const serverResponse = response.data
  if (serverResponse.code === SUCCESS_CODE) {
    return Promise.resolve({data: serverResponse.data, resp: serverResponse})
  }
  message.error({
    content: serverResponse.msg,
    duration: 4
  })
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
