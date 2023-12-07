import {post, get, del, put} from '@/utils/request'
import Base  from './order-base-api'

const api = {
  pages: Base.serviceName + '/v1/order/pages',
  create: Base.serviceName + '/v1/order/create',
  details: Base.serviceName + '/v1/order/details',
  deliver: Base.serviceName + '/v1/order/deliver',
}

export default api

export const getPageList = (data) => post({url: api.pages, data})
export const create = (data) => post({url: api.create, data})
export const getInfo = (params) => get({url: api.details, params})
export const deliver = (data) => post({url: api.deliver, data})