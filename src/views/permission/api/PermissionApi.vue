<template>
  <page-header-wrapper>
    <a-card :bordered="false">

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属应用">
                <application-select @change="onApplicationSelectChange" v-model="queryParam.applicationId"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="openForm('add')">添加接口</a-button>
      </div>

      <a-table
        bordered
        @change="handleTableChange"
        :pagination="false"
        :loading="tableLoading"
        :defaultExpandAllRows="defaultExpandAllRows"
        :expandRowByClick="false"
        :size="'small'"
        :indent-size="15"
        :row-key="rowKey"
        :columns="columns"
        :data-source="apis">

        <template slot="status" slot-scope="text, record">
          <a-dropdown :trigger="['click']">
            <a-menu slot="overlay" @click="routeStatusChange($event, record)">
              <a-menu-item v-for="(item) in routeStatusOptions" :key="item.value">
                {{ item.desc }}
              </a-menu-item>
            </a-menu>
            <a-button
              :style="record.status === 1 ? {'background-color': '#52c41a',border: 'none', 'color': 'white'}: {}"
              shape="round" size="small" :type="record.status !== 1 ? 'danger' : ''">
              {{ getStatusDesc(record.status) }}
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </template>

        <template slot="action" slot-scope="text, record">
          <k-tooltip-button title="编辑" @click="openForm('edit', record)" icon="edit"/>&nbsp;
          <k-tooltip-button title="删除" @click="handleDelete(record)" type="danger" icon="delete"/>
        </template>

        <template slot="authType" slot-scope="text, record">
          {{ getAuthTypeOptionDesc(record.authType) }}
        </template>

      </a-table>

    </a-card>

    <!-- 创建路由信息表单-->
    <permission-api-form :application-id="queryParam.applicationId"
                         ref="apiForm"
                         @success="handleFormOnSuccess"
                         @cancel="handleEditFormCancel"/>

  </page-header-wrapper>
</template>

<script>

import {getApis, updateApi, deleteApi} from '@/api/api-api'
import PermissionApiForm from './components/PermissionApiForm'
import ApplicationSelect from '@/views/permission/application/components/ApplicationSelect'
import {authTypeOptions, routeStatusOptions} from "./variable";

const queryParam = {
  applicationId: null
}

export default {
  name: 'PermissionRoute',
  components: {
    PermissionApiForm,
    ApplicationSelect
  },
  data() {
    return {
      replaceFields: {children: 'children', title: 'name', key: 'permissionId'},
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam,
      apis: [],
      applications: [],
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
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 80,
          align: "center",
          ellipsis: true,
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '认证授权类型',
          dataIndex: 'authType',
          align: "center",
          width: 100,
          scopedSlots: {customRender: 'authType'},
        },
        {
          title: '操作',
          width: 60,
          align: 'center',
          scopedSlots: {customRender: 'action'},
        },
      ],
      selectedApplication: {},
      currentApplicationId: 0,
      routeStatusOptions,
      addFormVisible: false,
    };
  },
  created() {
    this.initQueryParams()
    this.loadTableData();
  },
  methods: {
    initQueryParams() {
      const {query} = this.$route
      console.log(query)
      if (query) {
        this.queryParam.applicationId = query.applicationId || 1
      }
    },
    onApplicationSelectChange(val) {
      this.loadTableData()
    },
    getAuthTypeOptionDesc(value) {
      return authTypeOptions.find(item => item.value === value).desc
    },
    getStatusDesc(value) {
      return routeStatusOptions.find(item => item.value === value).desc
    },
    onSelect(selectedKeys, info) {
      this.selectedApplication = info.node.dataRef
      this.queryParam.applicationId = this.selectedApplication.id
      this.loadTableData();
    },
    handleTableChange(pagination, filters, sorter) {
      this.queryParam.current = pagination.current
      this.loadTableData()
    },
    resetQueryParams() {
      this.queryParam = {}
      this.loadTableData()
    },
    handleQueryStatusChange(value) {
      this.loadTableData()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    async routeStatusChange(value, item) {
      try {
        await updateApi({id: item.id, status: +value.key})
        await this.loadTableData()
        this.$message.success('修改成功')
      } catch (e) {
      }
    },
    handleFormOnSuccess() {
      this.$message.success('保存成功')
      this.loadTableData()
    },
    handleEditFormCancel() {
    },
    rowKey(record) {
      return record.id
    },
    async openForm(type, record) {
      let model;
      switch (type) {
        case 'edit':
          model = record
          break
        default:
          break;
      }
      this.$refs['apiForm'].open(model, type)
    },
    handleDelete(record) {
      this.$confirm({
        title: `提示`,
        content: `确认要删除[${record.name}]？`,
        onOk: async () => {
          const {data} = await deleteApi(record.id)
          await this.loadTableData();
        }
      })
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadTableData() {
      this.toggleLoading()
      const {data} = await getApis(this.queryParam)
      this.apis = data
      this.toggleLoading()
    }
  }
};
</script>
<style type="text/css" scoped>
</style>