import {BasicLayout, BlankLayout, PageView, RouteView} from "@/layouts";

export default {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 你需要动态引入的页面组件
  'Workplace': () => import('@/views/dashboard/Workplace'),
  'Analysis': () => import('@/views/dashboard/Analysis'),

  // form
  'BasicForm': () => import('@/views/form/basicForm'),
  'StepForm': () => import('@/views/form/stepForm/StepForm'),
  'AdvanceForm': () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  'TableList': () => import('@/views/list/TableList'),
  'StandardList': () => import('@/views/list/BasicList'),
  'CardList': () => import('@/views/list/CardList'),
  'SearchLayout': () => import('@/views/list/search/SearchLayout'),
  'SearchArticles': () => import('@/views/list/search/Article'),
  'SearchProjects': () => import('@/views/list/search/Projects'),
  'SearchApplications': () => import('@/views/list/search/Applications'),
  'ProfileBasic': () => import('@/views/profile/basic'),
  'ProfileAdvanced': () => import('@/views/profile/advanced/Advanced'),

  // result
  'ResultSuccess': () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  'ResultFail': () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  'Exception403': () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // account
  'AccountCenter': () => import('@/views/account/center'),
  'AccountSettings': () => import('@/views/account/settings/Index'),
  'BasicSettings': () => import('@/views/account/settings/BasicSetting'),
  'SecuritySettings': () => import('@/views/account/settings/Security'),
  'CustomSettings': () => import('@/views/account/settings/Custom'),
  'BindingSettings': () => import('@/views/account/settings/Binding'),
  'NotificationSettings': () => import('@/views/account/settings/Notification'),

  // other
  'IconSelectorView': () => import('@/views/other/IconSelectorView'),
  'TreeList': () => import('@/views/other/TreeList'),
  'EditList': () => import('@/views/other/TableInnerEditList'),
  'UserList': () => import('@/views/other/UserList'),
  'RoleList': () => import('@/views/other/RoleList'),
  'SystemRole': () => import('@/views/role/RoleList'),
  'PermissionList': () => import('@/views/other/PermissionList'),

  // rbac
  'PermissionRoute': () => import('@/views/permission/route/PermissionRoute'),
  'PermissionUser': () => import('@/views/permission/user/PermissionUser'),
  'PermissionUserGroup': () => import('@/views/permission/usergroup/PermissionUserGroup'),
  'PermissionRole': () => import('@/views/permission/role/PermissionRole'),
  'PermissionApplication': () => import('@/views/permission/application/PermissionApplication'),
  'PermissionApi': () => import('@/views/permission/api/PermissionApi'),

  // eop
  'CodeProject': () => import('@/views/eop/codeproject/CodeProject'),

  // goods
  'GoodsCategory': () => import('@/views/product/category/GoodsCategory'),
  'GoodsBrand': () => import('@/views/product/brand/GoodsBrand'),
  'GoodsAttrTemplate': () => import('@/views/product/attr/attrTemplate/GoodsAttrTemplate'),
  'GoodsAttrGroup': () => import('@/views/product/attr/attrGroup/GoodsAttrGroup'),
  'GoodsAttr': () => import('@/views/product/attr/attr/GoodsAttr'),
  'Goods': () => import('@/views/product/goods/Goods'),
  'GoodsForm': () => import('@/views/product/goods/components/GoodsForm'),

  // order
  'Order': () => import('@/views/order/Order'),
  'OrderDetail': () => import('@/views/order/detail/OrderDetail.vue'),

}