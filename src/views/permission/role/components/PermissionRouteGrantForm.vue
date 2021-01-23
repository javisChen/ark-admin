<template>

  <a-modal
    :width="1000"
    :centered="false"
    v-model="visible"
    :title="'角色授权：' + this.role.name"
    :ok-text="okText"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :closable="true"
    @ok="handleOk"
    @cancel="handleClose"
    cancel-text="取消">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="所属应用">
              <application-select @change="onApplicationSelectChange" v-model="selectedApplicationId"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-row :gutter="16">
      <a-col :span="6">
        <a-card title="路由列表"
                size="small">
          <template slot="extra">
            <a href="#" @click="checkAll">全选/反选</a>&nbsp;
          </template>

          <a-tree
            v-if="loadTreeDataSuccess"
            v-model="routeCheckedKeys"
            :checkable="true"
            :checkStrictly="true"
            :replaceFields="replaceFields"
            :default-expanded-keys="defaultExpandedKeys"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            @expand="onExpand"
            :tree-data="routesTreeData"
            @select="onSelect"
            @check="onCheckRoute">
          </a-tree>
        </a-card>
      </a-col>

      <a-col :span="18">
        <a-table
          bordered
          :pagination="false"
          :loading="tableLoading"
          :size="'small'"
          :indent-size="15"
          :row-key="elementTableRowKey"
          :columns="columns"
          :row-selection="rowSelection"
          :data-source="tableData">
        </a-table>
      </a-col>

    </a-row>


  </a-modal>
</template>

<script>

import ApplicationSelect from '../../application/components/ApplicationSelect'
import {updateRoleRoutePermission, getRolePermissionRoutes, getRolePermissionElements} from "@/api/role-api";

import {pageElementTypeDictionary} from "../../dictionary";
import {getRoutesTree, getRouteElements} from '@/api/route-api'

function getPageElementTypeDictionary(value) {
  return pageElementTypeDictionary[value]
}

const defaultModel = {
  id: '',
  name: '',
  status: 1,
}

export default {
  components: {
    ApplicationSelect
  },
  props: {},
  data() {
    return {
      loadTreeDataSuccess: false,
      // 角色所拥有的路由权限
      rolePermissionRoutes: [],
      rolePermissionRouteIds: [],
      // 角色所拥有的页面元素权限
      rolePermissionElements: [],
      rolePermissionElementIds: [],
      replaceFields: {children: 'children', title: 'name', key: 'permissionId'},
      expandedKeys: [],
      autoExpandParent: true,
      routeCheckedKeys: {
        checked: []
      },
      defaultExpandedKeys: [],
      selectedKeys: [],
      routesTreeData: [],
      routesData: [],
      checkedRoutePermissions: new Set(),
      checkedElementPermissions: [],
      columns: [
        {
          title: '权限编号',
          dataIndex: 'permissionCode',
          width: '33%',
        },
        {
          title: '元素名称',
          dataIndex: 'name',
          width: '33%',
        },
        {
          title: '元素类型',
          dataIndex: 'age',
          width: '33%',
          customRender: (text, row, index) => {
            return getPageElementTypeDictionary(row.type)
          },
        }
      ],
      tableData: [],
      pageElementTypeDictionary,
      tableLoading: false,
      selectedRowKeys: [],
      selectedApplicationId: 1,
      confirmLoading: false,
      visible: false,
      role: {},
      okText: '保存授权',

      toAddRoutePermissionIds: [],
      toRemoveRoutePermissionIds: [],
      toAddElementPermissionIds: [],
      toRemoveElementPermissionIds: [],

      checkOrInvertAll: true
    }
  },
  watch: {
    checkedRoutePermissions(val) {
      const {rolePermissionRouteIds} = this
      const checkedPermissionIds = [...val];
      console.log(rolePermissionRouteIds)
      this.toAddRoutePermissionIds = this.filterToAddPermissionIds(rolePermissionRouteIds, checkedPermissionIds);
      this.toRemoveRoutePermissionIds = this.filterToRemovePermissionIds(rolePermissionRouteIds, checkedPermissionIds);
    },
    checkedElementPermissions(val) {
      const {rolePermissionElementIds} = this
      this.toAddElementPermissionIds = this.filterToAddPermissionIds(rolePermissionElementIds, val)
      this.toRemoveElementPermissionIds = this.filterToRemovePermissionIds(rolePermissionElementIds, val)
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectElementChange,
      }
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    checkAll() {
      this.updateNode(this.checkOrInvertAll, this.routesTreeData)
      this.checkOrInvertAll = !this.checkOrInvertAll
      // 重新赋值，不然触发不到watch
      this.checkedRoutePermissions = new Set(this.checkedRoutePermissions)
    },
    invertCheckAll() {
      this.updateNode(false, this.routesTreeData)
    },
    onApplicationSelectChange(val) {
      this.loadTreeData()
    },
    // 加载角色所拥有的页面元素权限
    loadRolePermissionElements() {
      getRolePermissionElements({roleId: this.role.id, applicationId: this.selectedApplicationId})
        .then(({data}) => {
          this.rolePermissionElements = data;
          this.rolePermissionElementIds = this.rolePermissionElements.map(item => item.permissionId);
          this.selectedRowKeys = this.rolePermissionElementIds
        })
        .catch()
    },
    // 加载角色所拥有的路由权限
    loadRolePermissionRoutes() {
      getRolePermissionRoutes({roleId: this.role.id, applicationId: this.selectedApplicationId})
        .then(({data}) => {
          this.rolePermissionRoutes = data;
          this.rolePermissionRouteIds = this.rolePermissionRoutes.map(item => item.permissionId);
          this.routeCheckedKeys = this.rolePermissionRouteIds
          this.defaultExpandedKeys = this.routeCheckedKeys;
          this.expandedKeys = this.defaultExpandedKeys;
          this.loadTreeDataSuccess = true

          this.loadRolePermissionElements()

        })
        .catch()
    },
    onSelectElementChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.checkedElementPermissions = selectedRowKeys
    },
    buildNormalRouteData(data) {
      data.forEach(item => {
        this.routesData.push(item)
        if (item.children && item.children.length > 0) {
          this.buildNormalRouteData(item.children)
        }
      })
    },
    async loadTreeData() {
      const {data} = await getRoutesTree({applicationId: this.selectedApplicationId})
      this.routesTreeData = data
      this.buildNormalRouteData(data);
    },
    elementTableRowKey(record) {
      return record.permissionId
    },
    onCheckRoute({checked}, event) {
      this.checkedRoutePermissions = new Set([...checked])
      const node = event.node
      const nodeChecked = event.checked
      const nodeData = node.dataRef;
      const children = nodeData.children
      console.log('on check route')
      if (!children || children.length === 0) {
        this.updateParentNode(nodeChecked, nodeData)
      } else {
        this.updateNode(nodeChecked, children);
      }
    },
    updateParentNode(nodeChecked, nodeData) {
      const routeCheckedKeys = this.checkedRoutePermissions
      let {pid, level} = nodeData
      // 选中子节点的时候，把所有父节点都选上
      for (let i = 0; i < level - 1; i++) {
        const route = this.routesData.find(item => item.id === pid);
        routeCheckedKeys.add(route.permissionId)
        pid = route.pid
      }
      this.updateRouteCheckedKeys()
    },
    checkOrUnCheckNode(checked, item) {
      const routeCheckedKeys = this.checkedRoutePermissions
      if (checked) {
        routeCheckedKeys.add(item.permissionId)
      } else {
        routeCheckedKeys.delete(item.permissionId)
      }
      this.updateChildNodeChecked(checked, item.children)
    },
    updateRouteCheckedKeys() {
      if (this.routeCheckedKeys.checked) {
        this.routeCheckedKeys.checked = [...this.checkedRoutePermissions]
      } else {
        this.routeCheckedKeys = [...this.checkedRoutePermissions]
      }
      // 选中/反选后自动展开/折叠节点
      this.expandedKeys = [...this.checkedRoutePermissions]
    },
    updateNode(nodeChecked, children) {
      // 自己实现了全选和反选
      this.updateChildNodeChecked(nodeChecked, children)
      // ant的bug，如果一进来没有做过勾选操作的话，是没有checked属性的，如果有勾选过就有
      this.updateRouteCheckedKeys();
    },
    updateChildNodeChecked(checked, children) {
      if (!children || children.length === 0) {
        return
      }
      children.forEach(item => this.checkOrUnCheckNode(checked, item))
    },
    onSelect(selectedKeys, info) {
      const routeId = info.node.dataRef.id;
      this.loadElementsData(routeId)
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = true;
    },
    toggleTableLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadElementsData(routeId) {
      this.toggleTableLoading()
      try {
        const {data} = await getRouteElements(routeId)
        this.tableData = data
      } catch (e) {
      } finally {
        setTimeout(() => this.toggleTableLoading(), 200)
      }
    },
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
    open(role) {
      this.role = role
      this.visible = true
      this.loadRolePermissionRoutes()

    },
    close() {
      this.visible = false
      this.resetForm()
    },
    resetForm() {
      this.formModel = Object.assign({}, defaultModel)
      this.toAddRoutePermissionIds = []
      this.toRemoveRoutePermissionIds = []
      this.toAddElementPermissionIds = []
      this.toRemoveElementPermissionIds = []
      this.selectedRowKeys = []
      this.routeCheckedKeys = []
      this.tableData = []
      this.expandedKeys = []
      this.rolePermissionElementIds = []
      this.rolePermissionRouteIds = []
      this.checkedRoutePermissions = new Set()
      this.checkedElementPermissions = []
    },
    filterToAddPermissionIds(originPermissions, currentPermission) {
      const toAddIds = currentPermission.filter(item => !originPermissions.includes(item));
      console.log('------------------过滤新增的权限------------------')
      console.log('原权限 ->', originPermissions);
      console.log('当前选中的权限 ->', currentPermission);
      console.log('新权限 ->', toAddIds);
      console.log('------------------过滤新增的权限------------------')
      return toAddIds;
    },
    filterToRemovePermissionIds(originPermissions, currentPermission) {
      const toRemoveIds = originPermissions.filter(item => !currentPermission.includes(item));
      console.log('------------------过滤移除的权限------------------')
      console.log('原权限 ->', originPermissions);
      console.log('当前选中的权限 ->', currentPermission);
      console.log('移除权限 ->', toRemoveIds);
      console.log('------------------过滤移除的权限------------------')
      return toRemoveIds;
    },
    async handleOk() {
      this.toggleConfirmLoading()
      try {
        const data = {
          roleId: this.role.id,
          toAddRoutePermissionIds: this.toAddRoutePermissionIds,
          toRemoveRoutePermissionIds: this.toRemoveRoutePermissionIds,
          toAddElementPermissionIds: this.toAddElementPermissionIds,
          toRemoveElementPermissionIds: this.toRemoveElementPermissionIds
        };
        console.log(data)
        // return
        await updateRoleRoutePermission(data)
        this.afterSuccess()
      } catch (e) {
      } finally {
        this.toggleConfirmLoading()
      }
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function () {
      this.$message.success('保存成功')
    }
  },
}
</script>
