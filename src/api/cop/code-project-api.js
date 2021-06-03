import {post, get, del, put} from '@/utils/request'
import Base  from './cop-base-api'

const api = {
  pageList: Base.serviceName + '/code-project/pageList',
}

export default api

export const pageListCodeProject = (data) => post({url: api.pageList, data})