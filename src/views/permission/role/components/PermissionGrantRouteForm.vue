<template>
  <a-row :gutter="16">
    <a-col :span="6">
      <a-card title="路由列表"
              size="small">
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
          :tree-data="treeData"
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
</template>

<script>

import {pageElementTypeDictionary} from "../../dictionary";
import {getRoutesTree, getRouteElements} from '@/api/route-api'
import {getRolePermissionRoutes, getRolePermissionElements} from "@/api/role-api";

const columns = [
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
];

function getPageElementTypeDictionary(value) {
  return pageElementTypeDictionary[value]
}

export default {
  name: 'PermissionGrantRouteTree',
  props: {
    roleId: {
      type: Number,
      required: false
    },
  },
  data() {
    return {
      loadTreeDataSuccess: false,
      rolePermissionRoutes: [],
      rolePermissionElements: [],
      replaceFields: {children: 'children', title: 'name', key: 'permissionId'},
      expandedKeys: [],
      autoExpandParent: true,
      routeCheckedKeys: {
        checked: []
      },
      defaultExpandedKeys: [],
      selectedKeys: [],
      treeData: [],
      checkedRoutePermissions: new Set(),
      checkedElementPermissions: [],
      columns,
      tableData: [],
      pageElementTypeDictionary,
      tableLoading: false,
      selectedRowKeys: [],
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectElementChange
      }
    }
  },
  watch: {
  },
  created() {
    this.loadTreeData()
    this.loadRolePermissionElements()
  },
  methods: {
    // 加载角色所拥有的页面元素权限
    loadRolePermissionElements() {
      getRolePermissionElements({roleId: this.roleId})
        .then(({data}) => {
          this.rolePermissionElements = data;
          this.selectedRowKeys = this.rolePermissionElements.map(item => item.permissionId)
        })
        .catch()
    },
    // 加载角色所拥有的路由权限
    loadRolePermissionRoutes() {
      getRolePermissionRoutes({roleId: this.roleId})
        .then(({data}) => {
          this.rolePermissionRoutes = data;
          this.routeCheckedKeys = this.rolePermissionRoutes.map(item => item.permissionId)
          this.defaultExpandedKeys = this.routeCheckedKeys;
          this.expandedKeys = this.defaultExpandedKeys;
          this.loadTreeDataSuccess = true
        })
        .catch()
    },
    getCheckedPermission() {
      const {checkedElementPermissions} = this
      return {
        checkedElementPermissions: checkedElementPermissions,
        checkedRoutePermissions: this.routeCheckedKeys.checked || this.routeCheckedKeys
      };
    },
    onSelectElementChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.checkedElementPermissions = selectedRowKeys
    },
    async loadTreeData() {
      const {data} = await getRoutesTree({})
      this.treeData = data
      await this.loadRolePermissionRoutes()
    },
    elementTableRowKey(record) {
      return record.permissionId
    },
    onCheckRoute({checked}, event) {
      this.checkedRoutePermissions = new Set([...checked])
      const node = event.node
      const nodeChecked = event.checked
      const children = node.dataRef.children
      // 自己实现了全选和反选
      this.updateChildNodeChecked(nodeChecked, children)
      this.routeCheckedKeys.checked = [...this.checkedRoutePermissions]
      // 选中/反选后自动展开/折叠节点
      this.expandedKeys = [...this.checkedRoutePermissions]
    },
    checkOrUnCheckNode (checked, item) {
      const routeCheckedKeys = this.checkedRoutePermissions
      if (checked) {
        routeCheckedKeys.add(item.permissionId)
      } else {
        routeCheckedKeys.delete(item.permissionId)
      }
      this.updateChildNodeChecked(checked, item.children)
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
  }
}
;
</script>

<style scoped>
.btn {
  width: 20px;
}
</style>