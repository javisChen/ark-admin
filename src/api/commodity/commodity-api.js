import {post, get, del, put} from '@/utils/request'
import Base  from './commodity-base-api'

const api = {
  pageList: Base.serviceName + '/v1/admin/commodity/pages',
  save: Base.serviceName + '/v1/admin/commodity/save',
  info: Base.serviceName + '/v1/admin/commodity/details',
}

export default api

export const getPageList = (data) => post({url: api.pageList, data})

export const save = (data) => post({url: api.save, data})

export const getInfo = (params) => get({url: api.info, params})