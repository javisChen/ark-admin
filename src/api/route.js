import request from '@/utils/request'

const api = {
  routeTree: '/route/tree'
}

export default api

export function getRouteTree (parameter) {
  return request({
    url: api.routeTree,
    method: 'post',
    params: parameter
  })
}
