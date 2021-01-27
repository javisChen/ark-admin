import {post, get, del, put} from '@/utils/request'

const api = {
  roles: '/roles',
  rolesAll: '/roles/all',
  role: '/role',
  rolePermissionRoutes: '/role/permission/routes',
  rolePermissionRoute: '/role/permission/route',
  rolePermissionElements: '/role/permission/elements',
  rolePermissionApis: '/role/permission/apis',
  rolePermissionApi: '/role/permission/api',
}

export default api

export const getRoles = (data) => post({url: api.roles, data})

export const getAllRoles = (data) => get({url: api.rolesAll, data})

export const deleteRole = (params) => del({url: api.role, params})

export const addRole = (data) => post({url: api.role, data})

export const updateRole = (data) => put({url: api.role, data})

/**
 * 提交角色路由权限
 * @param data
 */
export const updateRoleRoutePermission = (data) => post({url: api.rolePermissionRoute, data})

/**
 * 提交角色api权限
 * @param data
 */
export const updateRoleApiPermission = (data) => post({url: api.rolePermissionApi, data})

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

/**
 * 获取角色下的Api权限
 * @param params
 */
export const getRolePermissionApis = (params) => get({url: api.rolePermissionApis, params})