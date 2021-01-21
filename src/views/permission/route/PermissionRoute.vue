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
        <a-button type="primary" icon="plus" @click="openForm('add')">添加路由</a-button>
      </div>

      <a-table
        bordered
        @change="handleTableChange"
        :pagination="pagination"
        :loading="tableLoading"
        :defaultExpandAllRows="defaultExpandAllRows"
        :expandRowByClick="false"
        :size="'middle'"
        :scroll="scroll"
        :indent-size="15"
        :row-key="rowKey"
        :columns="columns"
        :data-source="routes">

        <template slot="status" slot-scope="text, record">
          <a-dropdown :trigger="['click']">
            <a-menu slot="overlay" @click="routeStatusChange($event, record)">
              <a-menu-item v-for="(value, key) in routeStatusDictionary" :key="key">
                {{ value }}
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
          <k-tooltip-button title="添加子路由" @click="openForm('addChildren', record)" icon="plus"/>&nbsp;
          <k-tooltip-button title="查看" @click="openForm('view', record)" icon="search"/>&nbsp;
          <k-tooltip-button title="编辑" @click="openForm('edit', record)" icon="edit"/>&nbsp;
          <k-tooltip-button title="删除" @click="handleDelete(record)" type="danger" icon="delete"/>
        </template>

        <template slot="type" slot-scope="text, record">
          {{ getTypeDesc(record.type) }}
        </template>

        <template slot="isHideChildren" slot-scope="text, record">
          {{ record.isHideChildren ? '是' : '否' }}
        </template>

        <template slot="icon" slot-scope="text, record">
          <a-icon v-if="record.icon" :type="record.icon"></a-icon>
        </template>
      </a-table>

    </a-card>

    <!-- 创建路由信息表单-->
    <permission-route-form :routes="routes" ref="routeForm"
                           @success="handleFormOnSuccess"
                           @cancel="handleEditFormCancel"/>

  </page-header-wrapper>
</template>

<script>

import {getRoutes, deleteRoute, updateRouteStatus, getRoute} from '@/api/route-api'
import PermissionRouteForm from './components/PermissionRouteForm'
import ApplicationSelect from '@/views/permission/application/components/ApplicationSelect'

import {filterNonChildren} from "@/utils/util";

const routeStatusDictionary = {
  1: '已启用',
  2: '已禁用'
}

const routeTypeDictionary = {
  1: '菜单路由',
  2: '页面路由'
}

const pagination = {
  showSizeChanger: true,
  position: 'bottom',
  size: 'default',
  showQuickJumper: true,
  pageSizeOptions: ['15', '25', '35', '50'],
  defaultCurrent: 1,
  defaultPageSize: 15,
  total: 0
}

const queryParam = {
  current: pagination.defaultCurrent,
  size: pagination.defaultPageSize,
  applicationId: null
}

export default {
  name: 'PermissionRoute',
  components: {
    PermissionRouteForm,
    ApplicationSelect
  },
  data() {
    return {
      selectedApplication: {},
      applications: [],
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam,
      routes: [],
      pagination,
      columns: [
        {
          title: '路由名称',
          dataIndex: 'name',
          width: 180,
          filtered: true,
          sortOrder: 'descend',
          fixed: 'left',
        },
        {
          title: '组件名',
          dataIndex: 'component',
          width: 180,
          align: "left",
          customRender: (text, row, index) => {
            return text || '-'
          },
        },
        {
          title: '路径',
          dataIndex: 'path',
          width: 220,
          ellipsis: true,
          customRender: (text, row, index) => {
            return text || '-'
          },
        },
        {
          title: '层级',
          dataIndex: 'level',
          width: 50,
          ellipsis: true,
          customRender: (text, row, index) => {
            return text || '-'
          },
        },
        {
          title: '所属应用',
          align: "center",
          dataIndex: 'applicationName',
          width: 100,
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 100,
          align: "center",
          ellipsis: true,
          scopedSlots: {customRender: 'type'},
        },
        {
          title: '图标',
          dataIndex: 'icon',
          align: "center",
          width: 100,
          scopedSlots: {customRender: 'icon'},
        },
        {
          title: '是否隐藏子菜单',
          dataIndex: 'isHideChildren',
          width: 150,
          align: "center",
          scopedSlots: {customRender: 'isHideChildren'},
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: "center",
          width: 100,
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '排序',
          dataIndex: 'sequence',
          align: "center",
          width: 100,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: "center",
          width: 180,
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          align: "center",
          width: 180,
        },
        {
          title: '操作',
          fixed: 'right',
          width: 150,
          align: 'center',
          scopedSlots: {customRender: 'action'},
        },
      ],
      selectedRoute: {},
      routeStatusDictionary,
      addFormVisible: false,
      scroll: {x: 1000},
      replaceFields: {children: 'children', title: 'name', key: 'permissionId'},
    };
  },
  created() {
    this.initQueryParams()
    this.loadTableData()
  },
  methods: {
    onApplicationSelectChange(val) {
      this.loadTableData()
    },
    onSelect(selectedKeys, info) {
      this.selectedApplication = info.node.dataRef
      this.queryParam.applicationId = this.selectedApplication.id
      this.loadTableData();
    },
    initQueryParams() {
      const {query} = this.$route
      if (query) {
        this.queryParam.applicationId = query.applicationId || 1
      }
    },
    getTypeDesc(value) {
      return routeTypeDictionary[value]
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
    async routeStatusChange(value, route) {
      try {
        await updateRouteStatus({id: route.id, status: +value.key})
        await this.loadTableData()
        this.$message.success('修改成功')
      } catch (e) {
      }
    },
    getStatusDesc(status) {
      return routeStatusDictionary[status]
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
        case 'addChildren':
          const {levelPath, code, id, path, applicationId} = record
          model = {
            levelPath,
            code: code + ':',
            path: path + '/',
            pid: id,
            applicationId
          }
          break
        case 'edit':
        case 'view':
          const {data} = await getRoute(record.id)
          model = data
          break
        default:
          break;
      }
      this.$refs['routeForm'].open(model, type)
    },
    handleDelete(record) {
      this.$confirm({
        title: `确认要删除[${record.name}]路由及其子路由吗？`,
        content: `删除操作会把子路由也一并删除掉，请慎重！`,
        onOk: async () => {
          const {data} = await deleteRoute(record.id)
          await this.loadTableData();
        }
      })
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadTableData() {
      this.toggleLoading()
      const {data} = await getRoutes(this.queryParam)
      this.routes = data.records.map(item => {
        filterNonChildren(item);
        return item;
      });
      this.pagination.total = data.total
      this.toggleLoading()
    }
  }
};
</script>