import {post, get, del, put} from '@/utils/request'
import Base  from './pay-base-api'

const api = {
  notify: Base.serviceName + '/v1/pay/notify',
}

export default api
export const notify = (data) => post({url: api.notify, data})
