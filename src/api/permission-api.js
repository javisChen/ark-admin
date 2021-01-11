import {post, get, del, put} from '@/utils/request'

const api = {
  permissionsElement: '/permission/elements',
}

export default api

export const getPageElementPermission = (params) => get({url: api.permissionsElement, params})

