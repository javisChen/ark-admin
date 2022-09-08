import {post, get, del, put} from '@/utils/request'
import Base  from './commodity-base-api'

const api = {
  pageList: Base.serviceName + '/v1/admin/category/page',
  tree: Base.serviceName + '/v1/admin/category/tree',
  create: Base.serviceName + '/v1/admin/category/create',
  update: Base.serviceName + '/v1/admin/category/update',
  info: Base.serviceName + '/v1/admin/category/info',
  remove: Base.serviceName + '/v1/admin/category',
}

export default api

export const getPageList = (data) => post({url: api.pageList, data})

export const create = (data) => post({url: api.create, data})

export const update = (data) => post({url: api.update, data})

export const getInfo = (params) => get({url: api.info, params})

export const getTree = (data) => post({url: api.tree, data})

export const remove = (params) => del({url: api.remove, params})