import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";

const api = {
  applications: Base.serviceName + '/v1/applications',
  applicationCreate: Base.serviceName + '/v1/application/create',
  applicationUpdate: Base.serviceName + '/v1/application/update',
  applicationDelete: Base.serviceName + '/v1/application/delete',
}

export default api

export const getApplications = (data) => post({url: api.applications, data})

export const addApplication = (data) => post({url: api.applicationCreate, data})

export const deleteApplication = (id) => del({url: `${api.applicationDelete}/${id}`})

export const updateApplication = (data) => put({url: api.applicationUpdate, data})



