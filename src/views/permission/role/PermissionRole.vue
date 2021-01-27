<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!--      <div class="table-page-search-wrapper">-->
      <!--        <a-form layout="inline">-->
      <!--          <a-row :gutter="48">-->
      <!--            <a-col :md="8" :sm="24">-->
      <!--              <a-form-item label="用户名称">-->
      <!--                <a-input v-model="queryParam.name" placeholder=""/>-->
      <!--              </a-form-item>-->
      <!--            </a-col>-->
      <!--            <a-col :md="8" :sm="24">-->
      <!--              <a-form-item label="使用状态">-->
      <!--                <a-select v-model="queryParam.status" placeholder="请选择" :default-value="0"-->
      <!--                          @change="handleQueryStatusChange">-->
      <!--                  <a-select-option v-for="(value, key) in routeStatusDictionary"-->
      <!--                                   :key="key"-->
      <!--                                   :value="key">-->
      <!--                    {{ value }}-->
      <!--                  </a-select-option>-->
      <!--                </a-select>-->
      <!--              </a-form-item>-->
      <!--            </a-col>-->
      <!--            <a-col :md="!advanced && 8 || 24" :sm="24">-->
      <!--                          <span class="table-page-search-submitButtons"-->
      <!--                                :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">-->
      <!--                            <a-button type="primary" @click="loadTableData">查询</a-button>-->
      <!--                            <a-button style="margin-left: 8px" @click="resetQueryParams">重置</a-button>-->
      <!--                          </span>-->
      <!--            </a-col>-->
      <!--          </a-row>-->
      <!--        </a-form>-->
      <!--      </div>-->

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="showRoleForm">新建角色</a-button>
      </div>

      <a-table
        v-if="tableData && tableData.length > 0"
        bordered
        @change="handleTableChange"
        :pagination="pagination"
        :loading="tableLoading"
        :defaultExpandAllRows="defaultExpandAllRows"
        :expandRowByClick="true"
        :size="'middle'"
        :indent-size="15"
        :row-key="rowKey"
        :columns="columns"
        :data-source="tableData">

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
          <k-tooltip-button title="编辑" @click="handleEdit(record)" icon="edit"/>&nbsp;
          <k-tooltip-button title="路由授权" @click="handleGrant('route', record)" type="primary" icon="safety"/>&nbsp;
          <k-tooltip-button title="接口授权" @click="handleGrant('api', record)" type="primary" icon="api"/>&nbsp;
          <k-tooltip-button title="删除" @click="handleDelete(record)" type="danger" icon="delete"/>
        </template>
      </a-table>
      <a-empty v-else/>


      <!-- 创建路由信息表单-->
      <permission-role-form ref="roleForm"
                            @success="handleFormOnSuccess"
                            @cancel="handleEditFormCancel"/>

      <!-- 菜单授权窗口-->
      <permission-route-grant-form ref="routeGrantForm"
                                   @success="handleFormOnSuccess"
                                   @cancel="handleEditFormCancel"/>

      <!-- api授权窗口-->
      <permission-api-grant-form ref="apiGrantForm"
                                 @success="handleFormOnSuccess"
                                 @cancel="handleEditFormCancel"/>

    </a-card>

  </page-header-wrapper>

</template>

<script>

import {getRoles, deleteRole} from '@/api/role-api'
import PermissionRoleForm from "./components/PermissionRoleForm";
import PermissionRouteGrantForm from "./components/PermissionRouteGrantForm";
import PermissionApiGrantForm from "./components/PermissionApiGrantForm";

const routeStatusDictionary = {
  1: '已启用',
  2: '已禁用'
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
  current: 1,
  size: 15,
}

export default {
  name: 'PermissionRole',
  components: {
    PermissionRoleForm,
    PermissionRouteGrantForm,
    PermissionApiGrantForm
  },
  data() {
    return {
      pagination,
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam,
      tableData: [],
      columns: [
        {
          title: '角色名称',
          dataIndex: 'name',
          width: 100
        },
        {
          title: '创建时间',
          align: 'center',
          width: 200,
          dataIndex: 'createTime',
        },
        {
          title: '更新时间',
          align: 'center',
          width: 200,
          dataIndex: 'updateTime',
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          scopedSlots: {customRender: 'action'},
        },
      ],
      selectedRoute: {},
      routeStatusDictionary,
      roleFormVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    async handleEdit(record) {
      this.$refs['roleForm'].open(record, 'edit')
    },
    handleTableChange(pagination, filters, sorter) {
      this.queryParam.current = pagination.current
      this.loadTableData()
    },
    resetQueryParams() {
      this.queryParam = Object.assign({}, queryParam)
      this.loadTableData()
    },
    handleQueryStatusChange(value) {
      this.loadTableData()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    async routeStatusChange(value, route) {
      // try {
      //   await updateRouteStatus({id: route.id, status: +value.key})
      //   await this.loadTableData()
      //   this.$message.success('修改成功')
      // } catch (e) {
      // }
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
    showRoleForm() {
      this.$refs['roleForm'].open()
    },
    rowKey(record) {
      return record.id
    },
    handleGrant(type, record) {
      this.$refs[`${type}GrantForm`].open(record)
    },
    handleDelete(record) {
      this.$confirm({
        title: `提示`,
        content: `确定要禁用[${record.name}]角色吗？`,
        onOk: async () => {
          deleteRole({id: record.id})
          .then(() => this.loadTableData())
        }
      })
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadTableData() {
      this.toggleLoading()
      const {data} = await getRoles(this.queryParam)
      this.tableData = data.records;
      this.pagination.total = data.total
      this.toggleLoading()
    }
  }
};
</script>