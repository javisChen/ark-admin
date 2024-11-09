import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  userGroupPages: Base.serviceName + '/v1/user-groups',
  userGroups: Base.serviceName + '/v1/user-groups',
  userGroupsDetails: Base.serviceName + '/v1/user-groups/details',
  userGroupsAll: Base.serviceName + '/v1/user-groups/all',
  userGroupsTree: Base.serviceName + '/v1/user-groups/tree',
}
export default api

export const fetchUserGroupPages = (params) => get({url: api.userGroupPages, params})

export const getUserGroup = (params) => get({url: api.userGroupsDetails, params})

export const getAllUserGroups = (data) => get({url: api.userGroupsAll, data})

export const deleteUserGroup = (params) => del({url: api.userGroups, params})

export const getUserGroupsTree = (data) => post({url: api.userGroupsTree, data})

export const addUserGroup = (data) => post({url: api.userGroups, data})

export const updateUserGroup = (data) => put({url: api.userGroups, data})