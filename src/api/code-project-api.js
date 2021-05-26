import {post, get, del, put} from '@/utils/request'

const codeProjectApi = {
  pageList: '/code-project/pageList',
}

export default codeProjectApi

export const getCodeProjectPageList = (data) => post({url: codeProjectApi.pageList, data})



