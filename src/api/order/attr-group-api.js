import {post, get, del, put} from '@/utils/request'
import Base  from './order-base-api'

const api = {
  pageList: Base.serviceName + '/v1/attr/group/page',
  create: Base.serviceName + '/v1/attr/group/create',
  update: Base.serviceName + '/v1/attr/group/update',
  info: Base.serviceName + '/v1/attr/group/info',
}

export default api

export const getPageList = (data) => post({url: api.pageList, data})

export const create = (data) => post({url: api.create, data})

export const update = (data) => post({url: api.update, data})

export const getInfo = (params) => get({url: api.info, params})