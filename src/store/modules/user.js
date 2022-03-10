import storage from 'store'
import {login, getInfo, logout} from '@/api/iam/login'
import {getUserPageElementPermissions, getUserInfo} from '@/api/iam/user-api'
import {ACCESS_TOKEN} from '@/store/mutation-types'
import {welcome} from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    actionPermissions: [],
    info: {},
    isSuperAdmin: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {name, welcome}) => {
      state.name = name
      state.welcome = welcome
    },
    SET_IS_SUPER_ADMIN: (state, isSuperAdmin) => {
      state.isSuperAdmin = isSuperAdmin
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ACTION_PERMISSIONS: (state, actionPermissions) => {
      state.actionPermissions = actionPermissions
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(({data}) => {
          const result = data
          storage.set(ACCESS_TOKEN, result.accessToken, result.expires * 1000)
          commit('SET_TOKEN', result.accessToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({commit}) {
      return new Promise(async (resolve, reject) => {
        try {
          const userInfoResp = await getUserInfo();
          const userInfo = userInfoResp.data
          commit('SET_INFO', userInfo)
          commit('SET_NAME', {name: userInfo.username, welcome: welcome()})
          commit('SET_IS_SUPER_ADMIN', userInfo.isSuperAdmin)

          const userPermissionsResp = await getUserPageElementPermissions()
          commit('SET_ACTION_PERMISSIONS', userPermissionsResp.data)
          resolve({data: userPermissionsResp.data})
        } catch (e) {
          reject(e)
        }
      })
    },

    // 登出
    Logout({commit, state}) {
      return new Promise((resolve) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ACTION_PERMISSIONS', [])
          commit('SET_ROUTERS', [])
          commit('SET_IS_SUPER_ADMIN', false)
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ACTION_PERMISSIONS', [])
          commit('SET_ROUTERS', [])
          commit('SET_IS_SUPER_ADMIN', false)
          storage.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
