import {post, get, del, put} from '@/utils/request'
import Base  from './cop-base-api'

const api = {
  pageList: Base.serviceName + '/code-project/pageList',
  create: Base.serviceName + '/code-project/create',
  info: Base.serviceName + '/code-project/info',
}

export default api

export const pageListCodeProject = (data) => post({url: api.pageList, data})

export const createCodeProject = (data) => post({url: api.create, data})

export const getCodeProjectInfo = (params) => get({url: api.info, params})