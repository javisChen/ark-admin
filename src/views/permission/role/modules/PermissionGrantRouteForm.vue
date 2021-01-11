<template>
  <a-row :gutter="16">
    <a-col :span="6">
      <a-card title="路由列表"
              size="small">
        <a-tree
          v-model="checkedKeys"
          checkable
          :replaceFields="replaceFields"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :selected-keys="selectedKeys"
          @expand="onExpand"
          :tree-data="treeData"
          @select="onSelect"
          @check="onCheck">
        </a-tree>
      </a-card>
    </a-col>

    <a-col :span="18">
      <a-table
        bordered
        :pagination="false"
        :loading="tableLoading"
        :expandRowByClick="true"
        :size="'small'"
        :indent-size="15"
        :row-key="rowKey"
        :columns="columns"
        :row-selection="rowSelection"
        :data-source="tableData">
      </a-table>
    </a-col>

  </a-row>
</template>

<script>

import {getPageElementPermission} from "@/api/permission-api";
import {pageElementTypeDictionary} from "../../dictionary";
import {getRoutesTree} from '@/api/route-api'
import {updateRolePermission, getRolePermissionRoutes, getRolePermissionElements} from "@/api/role-api";

const columns = [
  {
    title: '权限编号',
    dataIndex: 'code',
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
      rolePermissionRoutes: [],
      rolePermissionElements: [],
      replaceFields: {children: 'children', title: 'name', key: 'permissionId'},
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      checkedPermissions: new Set(),
      columns,
      tableData: [],
      pageElementTypeDictionary,
      tableLoading: false,
      selectedRowKeys: []
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  watch: {
    checkedPermissions(val) {
      console.log('已选中的权限', val)
    }
  },
  created() {
    this.loadTreeData()
    this.loadRolePermissionRoutes()
    this.loadRolePermissionElements()
  },
  methods: {
    loadRolePermissionElements() {
      getRolePermissionElements({roleId: this.roleId})
        .then(({data}) => this.rolePermissionElements = data)
        .catch()
    },
    loadRolePermissionRoutes() {
      getRolePermissionRoutes({roleId: this.roleId})
        .then(({data}) => {
          this.rolePermissionRoutes = data;
          this.selectedKeys = this.rolePermissionRoutes.map(item => item.permissionId)
          console.log(this.selectedKeys)
        })
        .catch()
    },
    getCheckedPermissions() {
      return this.checkedPermissions;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.checkedPermissions = [...this.checkedPermissions, ...selectedRowKeys]
    },
    async loadTreeData() {
      const {data} = await getRoutesTree({})
      this.treeData = data
    },
    rowKey(record) {
      return record.id
    },
    onCheck(checked, {halfCheckedKeys}) {
      this.checkedPermissions = new Set([...checked, ...halfCheckedKeys])
      console.log('已选中', checked)
      console.log('半选中', halfCheckedKeys)
    },
    onSelect(selectedKeys, info) {
      console.log(info)
      this.loadElementsData(selectedKeys[0])
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    toggleTableLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadElementsData(routePermissionId) {
      this.toggleTableLoading()
      try {
        const {data} = await getPageElementPermission({routePermissionId: routePermissionId})
        this.tableData = data
      } catch (e) {
      } finally {
        setTimeout(() => this.toggleTableLoading(), 200)
      }
    },
  }
  ,
}
;
</script>

<style scoped>
.btn {
  width: 20px;
}
</style>