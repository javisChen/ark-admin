import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  permissionsElement: Base.serviceName + '/permission/elements',
}

export default api

export const getPageElementPermission = (params) => get({url: api.permissionsElement, params})

