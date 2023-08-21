<template>

  <a-modal
    :width="1200"
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

    <permission-api
      @selectedKeyChange="onSelectElementChange"
      :selectedRowKeys="rolePermissionApiIds"
      :grant="true"/>

  </a-modal>
</template>

<script>

import ApplicationSelect from '../../application/components/ApplicationSelect'
import {updateRoleApiPermission, getRolePermissionApis} from "@/api/iam/role-api";
import PermissionApi from "@/views/permission/api/PermissionApi";

const defaultModel = {
  id: '',
  name: '',
  status: 1,
}

export default {
  name: 'PermissionGrantForm',
  components: {
    PermissionApi,
    ApplicationSelect
  },
  props: {},
  data() {
    return {
      apis: [],
      rolePermissionApiIds: [],
      checkedRoutePermissions: new Set(),
      checkedApiPermissionIds: [],
      selectedApplicationId: '1',
      confirmLoading: false,
      visible: false,
      role: {},
      okText: '保存授权',

      toAddApiPermissionIds: [],
      toRemoveApiPermissionIds: [],
    }
  },
  created() {
  },
  watch: {
    checkedApiPermissionIds(checkedPermission) {
      const {rolePermissionApiIds} = this
      this.toAddApiPermissionIds = this.filterToAddPermissionIds(rolePermissionApiIds, checkedPermission);
      this.toRemoveApiPermissionIds = this.filterToRemovePermissionIds(rolePermissionApiIds, checkedPermission);
    }
  },
  methods: {
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
    // 加载角色所拥有的api权限
    loadRolePermissionApis() {
      getRolePermissionApis({roleId: this.role.id, applicationId: this.selectedApplicationId})
        .then(({data}) => {
          this.rolePermissionApis = data;
          this.rolePermissionApiIds = this.rolePermissionApis.map(item => item.permissionId)
          this.checkedApiPermissionIds = this.checkedApiPermissionIds.concat(this.rolePermissionApis)
        })
        .catch()
    },
    onSelectElementChange(selectedRowKeys, selectedRows) {
      this.checkedApiPermissionIds = selectedRowKeys
    },
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
    open(role) {
      this.role = role
      this.visible = true
      this.loadRolePermissionApis()
    },
    close() {
      this.visible = false
      this.resetForm()
    },
    resetForm() {
      this.formModel = Object.assign({}, defaultModel)
      this.toAddApiPermissionIds = []
      this.checkedApiPermissionIds = []
      this.rolePermissionApiIds = []
    },
    async handleOk() {
      this.toggleConfirmLoading()
      try {
        const data = {
          applicationId: this.selectedApplicationId,
          roleId: this.role.id,
          toAddApiPermissionIds: this.toAddApiPermissionIds,
          toRemoveApiPermissionIds: this.toRemoveApiPermissionIds
        };
        await updateRoleApiPermission(data)
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
      this.handleClose()
      this.$message.success('保存成功')
    }
  },
}
</script>
