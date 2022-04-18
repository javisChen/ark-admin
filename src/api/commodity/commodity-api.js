import {post, get, del, put} from '@/utils/request'
import Base  from './commodity-base-api'

const api = {
  pageList: Base.serviceName + '/v1/commodity/page',
  create: Base.serviceName + '/v1/commodity/create',
  update: Base.serviceName + '/v1/commodity/update',
  info: Base.serviceName + '/v1/commodity/info',
}

export default api

export const getPageList = (data) => post({url: api.pageList, data})

export const create = (data) => post({url: api.create, data})

export const update = (data) => post({url: api.update, data})

export const getInfo = (params) => get({url: api.info, params})