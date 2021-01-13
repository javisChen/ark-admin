import {post, get, del, put} from '@/utils/request'

const api = {
  routeTree: '/routes/tree',
  routes: '/routes',
  route: '/route',
  routeStatus: '/route/status',
  routeElements: (routeId) => `/route/${routeId}/elements`,
}

export default api

export const getRoutesTree = (data) => post({url: api.routeTree, data})

export const getRoutes = (data) => post({url: api.routes, data})

export const getRoute = (id) => get({url: `${api.route}/${id}`})

export const addRoute = (data) => post({url: api.route, data})

export const deleteRoute = (id) => del({url: `${api.route}/${id}`})

export const updateRoute = (data) => put({url: api.route, data})

export const updateRouteStatus = (data) => put({url: api.routeStatus, data})

export const getRouteElements = (id) => get({url: `${api.route}/${id}/elements`})


