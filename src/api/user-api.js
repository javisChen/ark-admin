import {post, get, del, put} from '@/utils/request'

const api = {
  users: '/users',
  user: '/user',
  userPermissionRoutes: '/user/permission/routes',
  userPermissionElements: '/user/permission/elements',
}

export default api

export const getUsers = (data) => post({url: api.users, data})

export const getUser = (params) => get({url: api.user, params})

export const getUserRoutes = (params) => get({url: api.userPermissionRoutes, params})

export const getUserPageElementPermissions = (params) => get({url: api.userPermissionElements, params})

export const addUser = (data) => post({url: api.user, data})

export const updateUser = (data) => put({url: api.user, data})
