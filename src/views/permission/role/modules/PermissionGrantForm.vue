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

    <a-card
      size="small"
      :tab-list="tabList"
      :defaultActiveTabKey="defaultActiveTabKey"
      @tabChange="key => onTabChange(key, 'noTitleKey')">
      <template v-if="activeTabKey === 'route'">
        <permission-grant-route-form :role-id="role.id" ref="grantRouteForm"/>
      </template>
      <template v-if="activeTabKey === 'api'">
        123
      </template>
    </a-card>
  </a-modal>
</template>

<script>

import PermissionGrantRouteForm from "./PermissionGrantRouteForm";
import {updateRolePermission, getRolePermissionRoutes, getRolePermissionElements} from "@/api/role-api";


const defaultModel = {
  id: '',
  name: '',
  status: 1,
}

const defaultActiveTabKey = 'route';
const activeTabKey = 'route'

export default {
  name: 'PermissionGrantForm',
  components: {
    PermissionGrantRouteForm
  },
  props: {},
  data() {
    return {
      defaultActiveTabKey,
      activeTabKey,
      tabList: [
        {
          key: 'route',
          tab: '路由授权',
        },
        {
          key: 'api',
          tab: '接口授权',
        },
      ],
      confirmLoading: false,
      visible: false,
      role: {},
      okText: '保存路由授权',
      rolePermissionRoutes: [],
      rolePermissionElements: [],
    }
  },
  created() {
  },
  methods: {
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
    onTabChange(key) {
      this.activeTabKey = key;
      let keyName = ''
      if (key === 'route') {
        keyName = '路由'
      } else if (key === 'api') {
        keyName = '接口'
      }
      this.okText = `保存${keyName}授权`
    },
    open(role) {
      this.role = role
      this.visible = true
    },
    close() {
      this.visible = false
      this.resetForm()
    },
    resetForm() {
      this.formModel = Object.assign({}, defaultModel)
    },
    async handleOk() {
      this.toggleConfirmLoading()
      try {
        if (this.activeTabKey === 'route') {
          const checkedPermissions = this.$refs['grantRouteForm'].getCheckedPermissions()
          if (checkedPermissions && checkedPermissions.length > 0) {
            await updateRolePermission({roleId: this.role.id, permissionIds: checkedPermissions})
          }
        } else if (this.activeTabKey === 'api') {
          // updateRolePermission({roleId: this.role.id,})
        }
      } catch (e) {
      } finally {
        this.toggleConfirmLoading()
      }
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function ($form) {
      this.$emit('success', '')
      this.close()
    }
  },
}
</script>
