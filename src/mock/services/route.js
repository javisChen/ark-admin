import Mock from 'mockjs2'
import {builder} from '../util'

const routeTree = () => {
  return builder(
    {
      "routes": [
        {
          "children": [
            {
              "children": [],
              "icon": "",
              "id": 10,
              "key": "basic-form",
              "pid": 1,
              "title": "基础表单"
            },
            {
              "children": [],
              "icon": "",
              "id": 11,
              "key": "step-form",
              "pid": 1,
              "title": "分步表单"
            },
            {
              "children": [],
              "icon": "",
              "id": 12,
              "key": "advanced-form",
              "pid": 1,
              "title": "高级表单"
            }
          ],
          "group": true,
          "icon": "form",
          "id": 1,
          "key": "form",
          "pid": 0,
          "title": "表单页"
        },
        {
          "children": [
            {
              "children": [],
              "icon": "",
              "id": 24,
              "key": "center",
              "pid": 2,
              "title": "个人中心"
            },
            {
              "children": [
                {
                  "children": [],
                  "icon": "",
                  "id": 28,
                  "key": "BasicSettings",
                  "pid": 25,
                  "title": "基本设置"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 29,
                  "key": "SecuritySettings",
                  "pid": 25,
                  "title": "安全设置"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 30,
                  "key": "CustomSettings",
                  "pid": 25,
                  "title": "个性化设置"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 31,
                  "key": "BindingSettings",
                  "pid": 25,
                  "title": "账户绑定"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 32,
                  "key": "NotificationSettings",
                  "pid": 25,
                  "title": "新消息通知"
                }
              ],
              "group": true,
              "icon": "",
              "id": 25,
              "key": "settings",
              "pid": 2,
              "title": "个人设置"
            },
            {
              "children": [],
              "icon": "",
              "id": 33,
              "key": "test-route",
              "pid": 2,
              "title": "测试路由"
            }
          ],
          "group": true,
          "icon": "user",
          "id": 2,
          "key": "account",
          "pid": 0,
          "title": "个人页"
        },
        {
          "children": [
            {
              "children": [],
              "icon": "",
              "id": 19,
              "key": "success",
              "pid": 3,
              "title": "成功"
            },
            {
              "children": [],
              "icon": "",
              "id": 20,
              "key": "fail",
              "pid": 3,
              "title": "失败"
            }
          ],
          "group": true,
          "icon": "check-circle-o",
          "id": 3,
          "key": "result",
          "pid": 0,
          "title": "结果页"
        },
        {
          "children": [
            {
              "children": [],
              "icon": "",
              "id": 17,
              "key": "basic",
              "pid": 4,
              "title": "基础详情页"
            },
            {
              "children": [],
              "icon": "",
              "id": 18,
              "key": "advanced",
              "pid": 4,
              "title": "高级详情页"
            }
          ],
          "group": true,
          "icon": "profile",
          "id": 4,
          "key": "profile",
          "pid": 0,
          "title": "详情页"
        },
        {
          "children": [
            {
              "children": [],
              "icon": "",
              "id": 13,
              "key": "table-list",
              "pid": 5,
              "title": "查询表格"
            },
            {
              "children": [],
              "icon": "",
              "id": 14,
              "key": "basic-list",
              "pid": 5,
              "title": "标准列表"
            },
            {
              "children": [],
              "icon": "",
              "id": 15,
              "key": "card",
              "pid": 5,
              "title": "卡片列表"
            },
            {
              "children": [
                {
                  "children": [],
                  "icon": "",
                  "id": 26,
                  "key": "project",
                  "pid": 16,
                  "title": "搜索列表（项目）"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 27,
                  "key": "application",
                  "pid": 16,
                  "title": "搜索列表（应用）"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 34,
                  "key": "article",
                  "pid": 16,
                  "title": "搜索列表（文章）"
                }
              ],
              "group": true,
              "icon": "",
              "id": 16,
              "key": "search",
              "pid": 5,
              "title": "搜索列表"
            }
          ],
          "group": true,
          "icon": "table",
          "id": 5,
          "key": "list",
          "pid": 0,
          "title": "列表页"
        },
        {
          "children": [
            {
              "children": [],
              "icon": "",
              "id": 8,
              "key": "workplace",
              "pid": 6,
              "title": "工作台"
            },
            {
              "children": [],
              "icon": "",
              "id": 9,
              "key": "Analysis",
              "pid": 6,
              "title": "分析页"
            }
          ],
          "group": true,
          "icon": "dashboard",
          "id": 6,
          "key": "dashboard",
          "pid": 0,
          "title": "仪表盘"
        },
        {
          "children": [
            {
              "children": [],
              "icon": "",
              "id": 21,
              "key": "403",
              "pid": 7,
              "title": "403"
            },
            {
              "children": [],
              "icon": "",
              "id": 22,
              "key": "404",
              "pid": 7,
              "title": "404"
            },
            {
              "children": [],
              "icon": "",
              "id": 23,
              "key": "500",
              "pid": 7,
              "title": "500"
            }
          ],
          "group": true,
          "icon": "warning",
          "id": 7,
          "key": "exception",
          "pid": 0,
          "title": "异常页"
        },
        {
          "children": [
            {
              "children": [],
              "icon": "tool",
              "id": 36,
              "key": "TestIconSelect",
              "pid": 35,
              "title": "IconSelector"
            },
            {
              "children": [
                {
                  "children": [],
                  "icon": "",
                  "id": 38,
                  "key": "TreeList",
                  "pid": 37,
                  "title": "树目录表格"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 39,
                  "key": "EditList",
                  "pid": 37,
                  "title": "内联编辑表格"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 40,
                  "key": "PermissionList",
                  "pid": 37,
                  "title": "权限列表"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 41,
                  "key": "UserList",
                  "pid": 37,
                  "title": "用户列表"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 42,
                  "key": "RoleList",
                  "pid": 37,
                  "title": "角色列表"
                },
                {
                  "children": [],
                  "icon": "",
                  "id": 43,
                  "key": "SystemRole",
                  "pid": 37,
                  "title": "角色列表2"
                }
              ],
              "icon": "layout",
              "id": 37,
              "key": "bizLayout",
              "pid": 35,
              "title": "业务布局"
            }
          ],
          "group": true,
          "icon": "slack",
          "id": 35,
          "key": "other",
          "pid": 0,
          "title": "其他组件"
        },
        {
          "children": [
            {
              "children": [],
              "icon": "",
              "id": 45,
              "key": "permission:route",
              "pid": 44,
              "title": "路由管理"
            }
          ],
          "group": true,
          "icon": "slack",
          "id": 44,
          "key": "permission",
          "pid": 0,
          "title": "权限管理"
        }
      ]
    }
  )
}


// Mock.mock(/\/route\/tree/, 'post', routeTree)
