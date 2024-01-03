import {post, get, del, put} from '@/utils/request'
import Base  from './product-base-api'

const api = {
  pageList: Base.serviceName + '/v1/admin/goods/pages',
  save: Base.serviceName + '/v1/admin/goods/save',
  info: Base.serviceName + '/v1/admin/goods/details',
  changeShelfStatus: Base.serviceName + '/v1/admin/goods/shelf',
}

export default api

export const getPageList = (data) => post({url: api.pageList, data})

export const save = (data) => post({url: api.save, data})

export const getInfo = (params) => get({url: api.info, params})

export const changeShelfStatus = (data) => post({url: api.changeShelfStatus, data})