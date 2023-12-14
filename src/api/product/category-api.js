import {post, get, del, put} from '@/utils/request'
import Base  from './product-base-api'

const api = {
  pageList: Base.serviceName + '/v1/admin/category/pages',
  tree: Base.serviceName + '/v1/admin/category/tree',
  save: Base.serviceName + '/v1/admin/category/save',
  details: Base.serviceName + '/v1/admin/category/details',
  remove: Base.serviceName + '/v1/admin/category/delete',
}

export default api

export const getPageList = (data) => post({url: api.pageList, data})
export const save = (data) => post({url: api.save, data})

export const getInfo = (params) => get({url: api.details, params})

export const getTree = (data) => post({url: api.tree, data})

export const remove = (params) => del({url: api.remove, params})