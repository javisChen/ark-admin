import {post, get, del, put} from '@/utils/request'

const api = {
  apis: '/apis',
  api: '/api',
}

export default api

export const getApis = (data) => post({url: api.apis, data})

export const addApi = (data) => post({url: api.api, data})

export const deleteApi = (id) => del({url: `${api.api}/${id}`})

export const updateApi = (data) => put({url: api.api, data})



