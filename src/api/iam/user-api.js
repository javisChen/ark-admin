import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  users:Base.serviceName +  '/users',
  user:Base.serviceName +  '/user',
  userInfo:Base.serviceName +  '/user/info',
  userPermissionRoutes:Base.serviceName +  '/user/permission/routes',
  userPermissionElements:Base.serviceName +  '/user/permission/elements',
}

export default api

export const getUsers = (data) => post({url: api.users, data})

export const getUser = (params) => get({url: api.user, params})

export const deleteUser = (params) => del({url: api.user, params})

export const getUserInfo = (params) => get({url: api.userInfo, params})

export const getUserRoutes = (params) => get({url: api.userPermissionRoutes, params})

export const getUserPageElementPermissions = (params) => get({url: api.userPermissionElements, params})

export const addUser = (data) => post({url: api.user, data})

export const updateUser = (data) => put({url: api.user, data})
