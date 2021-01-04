import {post, get, del, put} from '@/utils/request'

const api = {
  users: '/users',
  user: '/user',
}

export default api

export const getUsers = (data) => post({url: api.users, data})

export const addUser = (data) => post({url: api.user, data})

export const updateUser = (data) => put({url: api.user, data})