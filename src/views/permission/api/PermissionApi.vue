<template>

  <a-card :bordered="false">

    <div class="table-page-search-wrapper">

      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="所属应用">
              <application-select @change="onApplicationSelectChange"
                                  v-model="queryParam.applicationId"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div v-if="!grant" class="table-operator">
      <a-button type="primary" icon="plus" @click="openForm('add')">添加接口</a-button>
      <a-button type="primary" icon="reload" @click="updateApiCache">更新缓存</a-button>
    </div>

    <a-row :gutter="8">
      <a-col :span="4">
        <api-category-tree
          :categories="categories"
          :show-action="!grant"
          @update="onCategoryUpdate"
          @change="onCategoryChange"
          :application-id="queryParam.applicationId"/>
      </a-col>
      <a-col :span="20">
        <a-table
          bordered
          @change="handleTableChange"
          :row-selection="grant ? rowSelection : null"
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
      </a-col>
    </a-row>

    <permission-api-form
      :categories="categories"
      :application-id="queryParam.applicationId"
      ref="apiForm"
      @success="handleFormOnSuccess"
      @cancel="handleEditFormCancel"/>

  </a-card>
</template>

<script>

import {getApis, updateApi, deleteApi, updateCache, getApi} from '@/api/api-api'
import PermissionApiForm from './components/PermissionApiForm'
import PermissionApiCategoryForm from "@/views/permission/api/components/PermissionApiCategoryForm";
import ApplicationSelect from '@/views/permission/application/components/ApplicationSelect'
import {authTypeOptions, routeStatusOptions} from "./variable";
import ApiCategoryTree from "@/views/permission/api/components/ApiCategoryTree";
import {getApiCategories} from "@/api/api-category-api";

const queryParam = {
  applicationId: null,
  categoryId: null,
  authType: null
}

const NEED_AUTHORIZATION = 3

const defaultColumns = [
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
  }
]

const grantColumns = [
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
    title: '认证授权类型',
    dataIndex: 'authType',
    align: "center",
    width: 100,
    scopedSlots: {customRender: 'authType'},
  },
]

export default {
  name: 'PermissionApi',
  components: {
    ApiCategoryTree,
    PermissionApiCategoryForm,
    PermissionApiForm,
    ApplicationSelect
  },
  props: {
    grant: {
      type: Boolean,
      required: false,
      default: () => false
    },
    selectedRowKeys: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedApiKeys,
        onChange: this.onSelectChange
      }
    }
  },
  watch: {
    selectedRowKeys(val) {
      this.selectedApiKeys = this.$cloneDeep(val)
    }
  },
  data() {
    return {
      selectedApiKeys: [],
      categories: [],
      replaceFields: {children: 'children', title: 'name', key: 'permissionId'},
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam: Object.assign({}, queryParam),
      apis: [],
      applications: [],
      columns: defaultColumns,
      selectedApplication: 0,
      routeStatusOptions,
      addFormVisible: false,
    };
  },
  created() {
    this.initQueryParams()
    if (this.grant) {
      this.columns = grantColumns
    }
    this.loadApiCategories()
    console.log('grant', this.grant)
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedApiKeys = selectedRowKeys
      this.$emit('selectedKeyChange', selectedRowKeys, selectedRows)
    },
    loadApiCategories() {
      this.toggleLoading()
      getApiCategories({applicationId: this.queryParam.applicationId})
        .then(({data}) => {
          this.categories = data
          if (this.categories.length > 0) {
            this.queryParam.categoryId = this.categories[0].id
            this.loadTableData()
          } else {
            this.queryParam.categoryId = 0
            this.apis = []
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.toggleLoading();
          }, 200)
        })
    },
    onCategoryUpdate() {
      this.loadApiCategories()
    },
    onCategoryChange(category) {
      this.queryParam.categoryId = category.id
      this.loadTableData()
    },
    initQueryParams() {
      const {query} = this.$route
      if (query) {
        this.queryParam.applicationId = query.applicationId || 1
      }
    },
    onApplicationSelectChange(val) {
      this.selectedApplication = val
      this.queryParam.applicationId = val
      this.loadApiCategories()
    },
    getAuthTypeOptionDesc(value) {
      return authTypeOptions.find(item => item.value === value).desc
    },
    getStatusDesc(value) {
      return routeStatusOptions.find(item => item.value === value).desc
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
      if (this.grant) {
        return record.permissionId
      }
      return record.id
    },
    async openForm(type, record) {
      let model;
      switch (type) {
        case 'edit':
          const {data} = await getApi({id: record.id})
          model = data
          break
        case 'add':
          model = {
            categoryId: this.queryParam.categoryId,
            applicationId: this.queryParam.applicationId,
          }
          break
        default:
          break;
      }
      this.$refs['apiForm'].open(model, type)
    },
    updateApiCache() {
      updateCache()
        .then((resp) => {
          this.$message.success('缓存更新成功')
        })
        .catch((e) => e)
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
      // 如果是授权调用组件的时候只筛选需要授权的api
      if (this.grant) {
        console.log('2312313123123')
        this.queryParam.authType = NEED_AUTHORIZATION
      }
      console.log(this.queryParam)
      const {data} = await getApis(this.queryParam)
      this.apis = data
      this.toggleLoading()
    }
  }
};
</script>
<style type="text/css" scoped>

</style>