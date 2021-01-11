import {post, get, del, put} from '@/utils/request'

const api = {
  roles: '/roles',
  role: '/role',
  rolePermissionRoutes: '/role/permission/routes',
  rolePermissionElements: '/role/permission/elements',
}

export default api

export const getRoles = (data) => post({url: api.roles, data})

export const addRole = (data) => post({url: api.role, data})

export const updateRole = (data) => put({url: api.role, data})

/**
 * 提交角色路由权限
 * @param data
 * @returns {AxiosPromise}
 */
export const updateRolePermission = (data) => post({url: api.rolePermissionRoutes, data})

/**
 * 获取角色下的路由权限
 * @param params
 */
export const getRolePermissionRoutes = (params) => get({url: api.rolePermissionRoutes, params})

/**
 * 获取角色下的页面元素权限
 * @param params
 */
export const getRolePermissionElements = (params) => get({url: api.rolePermissionElements, params})