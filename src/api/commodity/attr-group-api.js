import {post, get, del, put} from '@/utils/request'
import Base  from './commodity-base-api'

const api = {
  pageList: Base.serviceName + '/v1/attr/group/pages',
  create: Base.serviceName + '/v1/attr/group/save',
  details: Base.serviceName + '/v1/attr/group/details',
}

export default api
export const getPageList = (data) => post({url: api.pageList, data})
export const create = (data) => post({url: api.create, data})

export const getInfo = (params) => get({url: api.details, params})