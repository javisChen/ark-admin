import {post, get, del, put} from '@/utils/request'

const api = {
  roles: '/roles',
  role: '/role',
}

export default api

export const getRoles = (data) => post({url: api.roles, data})

export const addRole = (data) => post({url: api.role, data})

export const updateRole = (data) => put({url: api.role, data})