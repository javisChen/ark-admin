import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  routesAll:Base.serviceName + '/v1/menus/all',
  routes:Base.serviceName + '/v1/menus',
  routeCreate:Base.serviceName + '/v1/menus',
  routeUpdate:Base.serviceName + '/v1/menus',
  route:Base.serviceName + '/v1/menus/details',
  routeDelete:Base.serviceName + '/v1/menus',
  routeStatus:Base.serviceName + '/v1/menus/status',
  routeElements:Base.serviceName + '/v1/menus/elements',
}

export default api

export const getRoutesTree = (data) => post({url: api.routesAll, data})

export const getRoutes = (data) => post({url: api.routes, data})

export const getRoute = (params) => get({url: `${api.route}`, params})

export const addRoute = (data) => post({url: api.routeCreate, data})

export const deleteRoute = (params) => del({url: api.routeDelete, params})

export const updateRoute = (data) => put({url: api.routeUpdate, data})

export const updateRouteStatus = (data) => put({url: api.routeStatus, data})

export const getRouteElements = (params) => get({url: api.routeElements, params})


