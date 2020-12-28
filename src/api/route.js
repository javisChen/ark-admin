import request from '@/utils/request'

const api = {
  routeTree: '/route/tree',
  routes: '/routes'
}

export default api

export function getRouteTree (parameter) {
  return request({
    url: api.routeTree,
    method: 'post',
    params: parameter
  })
}

export function getRoute (id) {
  return request({
    url: `${api.routes}/${id}`,
    method: 'get',
  })
}
