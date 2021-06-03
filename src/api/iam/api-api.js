import {post, get, del, put} from '@/utils/request'
import Base from './iam-base-api'

const api = {
  apis: Base.serviceName + '/apis',
  api: Base.serviceName + '/api',
  apiCache: Base.serviceName + '/api/cache',
}

export default api

export const getApis = (data) => post({url: api.apis, data})

export const addApi = (data) => post({url: api.api, data})

export const getApi = (params) => get({url: api.api, params})

export const deleteApi = (id) => del({url: `${api.api}/${id}`})

export const updateApi = (data) => put({url: api.api, data})

export const updateCache = (data) => put({url: api.apiCache, data})



