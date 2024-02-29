import {post, get, del, put} from '@/utils/request'
import Base from './iam-base-api'

const api = {
  apis: Base.serviceName + '/v1/apis/all',
  api: Base.serviceName + '/v1/apis/details',
  apiEnable: Base.serviceName + '/v1/apis/status',
  apiSync: Base.serviceName + '/v1/apis/sync',
}

export default api

export const getApis = (params) => get({url: api.apis, params})

export const addApi = (data) => post({url: api.api, data})

export const enableApi = (data) => post({url: api.apiEnable, data})

export const getApi = (params) => get({url: api.api, params})

export const deleteApi = (id) => del({url: `${api.api}/${id}`})

export const updateApi = (data) => put({url: api.api, data})

export const syncApi = (data) => post({url: api.apiSync, data})



