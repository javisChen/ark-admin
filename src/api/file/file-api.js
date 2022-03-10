import {post, get, del, put} from '@/utils/request'
import Base  from './file-base-api'

const api = {
  upload: Base.serviceName + '/v1/oss/upload',
}

export default api

export const upload = (data) => post({url: api.upload, data})
