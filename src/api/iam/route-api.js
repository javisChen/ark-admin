import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  routesAll:Base.serviceName + '/v1/routes/all',
  routes:Base.serviceName + '/v1/routes',
  route:Base.serviceName + '/v1/route',
  routeStatus:Base.serviceName + '/v1/route/status'
}

export default api

export const getRoutesTree = (data) => post({url: api.routesAll, data})

export const getRoutes = (data) => post({url: api.routes, data})

export const getRoute = (params) => get({url: `${api.route}`, params})

export const addRoute = (data) => post({url: api.route, data})

export const deleteRoute = (id) => del({url: `${api.route}/${id}`})

export const updateRoute = (data) => put({url: api.route, data})

export const updateRouteStatus = (data) => put({url: api.routeStatus, data})

export const getRouteElements = (id) => get({url: `${api.route}/${id}/elements`})


