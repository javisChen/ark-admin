import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  users: Base.serviceName + '/v1/users',
  user: Base.serviceName + '/v1/user',
  createUser: Base.serviceName + '/v1/user/create',
  updateUser: Base.serviceName + '/v1/user/update',
  userInfo: Base.serviceName + '/v1/user/info',
  userPermissionRoutes: Base.serviceName + '/v1/user/permission/routes',
  userPermissionElements: Base.serviceName + '/v1/user/permission/elements',
}

export default api

export const getUsers = (data) => post({url: api.users, data})

export const getUser = (params) => get({url: api.user, params})

export const deleteUser = (params) => del({url: api.user, params})

export const getUserInfo = (params) => get({url: api.userInfo, params})

export const getUserRoutes = (params) => get({url: api.userPermissionRoutes, params})

export const getUserPageElementPermissions = (params) => get({url: api.userPermissionElements, params})

export const addUser = (data) => post({url: api.createUser, data})

export const updateUser = (data) => post({url: api.updateUser, data})
