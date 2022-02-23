import {post, get, del, put} from '@/utils/request'
import Base  from './eop-base-api'

const api = {
  pageList: Base.serviceName + '/v1/code-project/pageList',
  create: Base.serviceName + '/v1/code-project/create',
  info: Base.serviceName + '/v1/code-project/info',
}

export default api

export const pageListCodeProject = (data) => post({url: api.pageList, data})

export const createCodeProject = (data) => post({url: api.create, data})

export const getCodeProjectInfo = (params) => get({url: api.info, params})