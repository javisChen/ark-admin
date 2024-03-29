import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import {setDocumentTitle, domTitle} from '@/utils/domUtil'
import {ACCESS_TOKEN} from '@/store/mutation-types'
import {i18nRender} from '@/locales'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    // 登录成功后，如果路由到登录页的话就重定向到默认首页
    if (to.path === loginRoutePath) {
      next({path: defaultRoutePath})
      NProgress.done()
    } else {
      // check login user.roles is null
      if (store.getters.addRouters.length === 0) {
        store.dispatch('GetInfo')
          .then(({data}) => {
            // generate dynamic router
            store.dispatch('GenerateRoutes').then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              let params
              let query
              if (to.path) {
                params = to.params
                query = to.query
              }
              if (to.path === redirect) {
                next({path: to.path, replace: true, params, query})
              } else {
                // 跳转到目的路由
                next({path: redirect})
              }
            })
          })
          .catch((e) => {
            console.log('logout')
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({path: loginRoutePath, query: {redirect: to.fullPath}})
            })
              .catch((e) => {
                console.log(e)
              })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({path: loginRoutePath, query: {redirect: to.fullPath}})
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
