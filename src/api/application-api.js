import {post, get, del, put} from '@/utils/request'

const api = {
  applications: '/applications',
  application: '/application',
}

export default api

export const getApplications = (data) => post({url: api.applications, data})

export const addApplication = (data) => post({url: api.application, data})

export const deleteApplication = (id) => del({url: `${api.application}/${id}`})

export const updateApplication = (data) => put({url: api.application, data})



