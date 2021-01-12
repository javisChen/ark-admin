import {post, get, del, put} from '@/utils/request'

const api = {
  usergroups: '/usergroups',
  usergroupsAll: '/usergroups/all',
  usergroupsTree: '/usergroups/tree',
  usergroup: '/usergroup',
}

export default api

export const getUserGroups = (data) => post({url: api.usergroups, data})

export const getAllUserGroups = (data) => get({url: api.usergroupsAll, data})

export const getUserGroupsTree = (data) => post({url: api.usergroupsTree, data})

export const addUserGroup = (data) => post({url: api.usergroup, data})

export const updateUserGroup = (data) => put({url: api.usergroup, data})