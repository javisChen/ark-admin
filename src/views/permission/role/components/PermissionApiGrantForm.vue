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
      <a-col :span="24">
        <a-table
          bordered
          :pagination="false"
          :loading="tableLoading"
          :expandRowByClick="false"
          :size="'small'"
          :indent-size="15"
          :row-key="rowKey"
          :columns="columns"
          :row-selection="rowSelection"
          :data-source="apis">

          <template slot="method" slot-scope="text, record">
            {{ getMethodOptionDesc(record.method) }}
          </template>

          <template slot="authType" slot-scope="text, record">
            {{ getAuthTypeOptionDesc(record.authType) }}
          </template>

        </a-table>
      </a-col>

    </a-row>


  </a-modal>
</template>

<script>

import {getApis} from '@/api/api-api'
import ApplicationSelect from '../../application/components/ApplicationSelect'
import {updateRoleApiPermission, getRolePermissionApis} from "@/api/role-api";
import {authTypeOptions, methodOptions} from "@/views/permission/api/variable";

const defaultModel = {
  id: '',
  name: '',
  status: 1,
}

export default {
  name: 'PermissionGrantForm',
  components: {
    ApplicationSelect
  },
  props: {},
  data() {
    return {
      apis: [],
      rolePermissionApis: [],
      checkedRoutePermissions: new Set(),
      checkedApiPermissions: [],
      columns: [
        {
          title: '接口名称',
          dataIndex: 'name',
          width: 150,
          filtered: true,
          sortOrder: 'descend',
        },
        {
          title: 'Url',
          dataIndex: 'url',
          width: 150,
          align: "left",
          customRender: (text, row, index) => {
            return text || '-'
          },
        },
        {
          title: 'method',
          dataIndex: 'method',
          align: "center",
          width: 60,
          scopedSlots: {customRender: 'method'},
        },
        {
          title: '认证授权类型',
          dataIndex: 'authType',
          align: "center",
          width: 100,
          scopedSlots: {customRender: 'authType'},
        },
      ],
      tableData: [],
      tableLoading: false,
      selectedRowKeys: [],
      selectedApplicationId: 1,
      confirmLoading: false,
      visible: false,
      role: {},
      okText: '保存授权',
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
  created() {
    this.loadTableData()
  },
  methods: {
    // 加载角色所拥有的api权限
    loadRolePermissionApis() {
      getRolePermissionApis({roleId: this.role.id, applicationId: this.selectedApplicationId})
        .then(({data}) => {
          this.rolePermissionApis = data;
          this.selectedRowKeys = this.rolePermissionApis.map(item => item.permissionId)
        })
        .catch()
    },
    rowKey(record) {
      return record.permissionId
    },
    onApplicationSelectChange(val) {
      this.loadTableData()
    },
    getAuthTypeOptionDesc(value) {
      return authTypeOptions.find(item => item.value === value).desc
    },
    getMethodOptionDesc(value) {
      return methodOptions.find(item => item.value === value).desc
    },
    async loadTableData() {
      this.toggleLoading()
      const {data} = await getApis({applicationId: this.selectedApplicationId})
      this.apis = data
      this.toggleLoading()
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    onSelectElementChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.checkedApiPermissions = selectedRowKeys
      console.log(selectedRowKeys)
    },
    toggleTableLoading() {
      this.tableLoading = !this.tableLoading
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
    },
    async handleOk() {
      this.toggleConfirmLoading()
      try {
        const data = {
          roleId: this.role.id,
          applicationId: this.selectedApplicationId,
          apiPermissionIds: this.checkedApiPermissions
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
      this.$message.success('保存成功')
    }
  },
}
</script>
