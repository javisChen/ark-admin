import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  applications: Base.serviceName + '/applications',
  application: Base.serviceName + '/application',
}

export default api

export const getApplications = (data) => post({url: api.applications, data})

export const addApplication = (data) => post({url: api.application, data})

export const deleteApplication = (id) => del({url: `${api.application}/${id}`})

export const updateApplication = (data) => put({url: api.application, data})



