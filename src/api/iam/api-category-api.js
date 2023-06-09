import {post, get, del, put} from '@/utils/request'
import Base from "./iam-base-api";


const api = {
  apiCategories: Base.serviceName + '/v1/api/categories',
  apiCategoryCreate: Base.serviceName + '/v1/api/category/create',
  apiCategoryUpdate: Base.serviceName + '/v1/api/category/update',
  apiCategoryDelete: Base.serviceName + '/v1/api/category/delete',
}

export default api

export const getApiCategories = (params) => get({url: api.apiCategories, params})

export const addApiCategory = (data) => post({url: api.apiCategoryCreate, data})

export const deleteApiCategory = (params) => del({url: `${api.apiCategoryDelete}`, params})

export const updateApiCategory = (data) => put({url: api.apiCategoryUpdate, data})


