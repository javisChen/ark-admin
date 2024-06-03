import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  users: Base.serviceName + '/v1/users',
  user: Base.serviceName + '/v1/users/details',
  userInfo: Base.serviceName + '/v1/users/self',
  userPermissionRoutes: Base.serviceName + '/v1/users/self/menus',
  userPermissionElements: Base.serviceName + '/v1/users/self/elements',
}

export default api

export const getUsers = (params) => get({url: api.users, params})

export const getUser = (params) => get({url: api.user, params})

export const deleteUser = (params) => del({url: api.user, params})

export const getUserInfo = (params) => get({url: api.userInfo, params})

export const getUserRoutes = (params) => get({url: api.userPermissionRoutes, params})

export const getUserPageElementPermissions = (params) => get({url: api.userPermissionElements, params})

export const addUser = (data) => post({url: api.users, data})

export const updateUser = (data) => put({url: api.users, data})
