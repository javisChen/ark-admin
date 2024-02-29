import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  userGroups: Base.serviceName + '/v1/userGroups',
  userGroupsDetails: Base.serviceName + '/v1/userGroups/details',
  userGroupsAll: Base.serviceName + '/v1/userGroups/all',
  userGroupsTree: Base.serviceName + '/v1/userGroups/tree',
}
export default api

export const getUserGroups = (data) => get({url: api.userGroups, data})

export const getUserGroup = (params) => get({url: api.userGroupsDetails, params})

export const getAllUserGroups = (data) => get({url: api.userGroupsAll, data})

export const deleteUserGroup = (params) => del({url: api.userGroups, params})

export const getUserGroupsTree = (data) => post({url: api.userGroupsTree, data})

export const addUserGroup = (data) => post({url: api.userGroups, data})

export const updateUserGroup = (data) => put({url: api.userGroups, data})