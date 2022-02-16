import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  usergroups: Base.serviceName + '/v1/usergroups',
  usergroupsAll: Base.serviceName + '/v1/usergroups/all',
  usergroupsTree: Base.serviceName + '/v1/usergroups/tree',
  usergroup: Base.serviceName + '/v1/usergroup',
}

export default api

export const getUserGroups = (data) => post({url: api.usergroups, data})

export const getUserGroup = (params) => get({url: api.usergroup, params})

export const getAllUserGroups = (data) => get({url: api.usergroupsAll, data})

export const deleteUserGroup = (params) => del({url: api.usergroup, params})

export const getUserGroupsTree = (data) => post({url: api.usergroupsTree, data})

export const addUserGroup = (data) => post({url: api.usergroup, data})

export const updateUserGroup = (data) => put({url: api.usergroup, data})