import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  applications: Base.serviceName + '/v1/applications',
  applicationCreate: Base.serviceName + '/v1/applications',
  applicationUpdate: Base.serviceName + '/v1/applications',
  applicationDelete: Base.serviceName + '/v1/applications',
}

export default api

export const getApplications = (params) => get({url: api.applications, params})

export const addApplication = (data) => post({url: api.applicationCreate, data})

export const deleteApplication = (id) => del({url: `${api.applicationDelete}/${id}`})

export const updateApplication = (data) => put({url: api.applicationUpdate, data})



