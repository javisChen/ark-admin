import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  roles: Base.serviceName + '/v1/roles',
  rolesAll: Base.serviceName + '/v1/roles/all',
  roleCreate: Base.serviceName + '/v1/roles',
  roleUpdate: Base.serviceName + '/v1/roles',
  roleDelete: Base.serviceName + '/v1/roles',
  rolePermissionRoutes: Base.serviceName + '/v1/role/permission/menus',
  rolePermissionRoute: Base.serviceName + '/v1/role/permission/menus',
  rolePermissionElements: Base.serviceName + '/v1/role/permission/elements',
  rolePermissionApis: Base.serviceName + '/v1/role/permission/apis',
  rolePermissionApi: Base.serviceName + '/v1/role/permission/apis',
}

export default api

export const getRoles = (params) => get({url: api.roles, params})

export const getAllRoles = (params) => get({url: api.rolesAll, params})

export const deleteRole = (params) => del({url: api.roleDelete, params})

export const addRole = (data) => post({url: api.roleCreate, data})

export const updateRole = (data) => put({url: api.roleUpdate, data})

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