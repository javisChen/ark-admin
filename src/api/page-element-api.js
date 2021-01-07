import {post, get, del, put} from '@/utils/request'

const api = {
  pageElements: '/page-elements',
  pageElement: '/pageElement',
}

export default api

export const getPageElements = (data) => post({url: api.pageElements, data})

export const addPageElement = (data) => post({url: api.pageElement, data})

export const deletePageElement = (id) => del({url: `${api.pageElement}/${id}`})

export const updatePageElement = (data) => put({url: api.pageElement, data})


