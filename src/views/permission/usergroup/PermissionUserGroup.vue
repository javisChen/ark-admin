<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row :gutter="8">
        <a-col :span="5">
          <permission-user-group-tree></permission-user-group-tree>
        </a-col>
        <a-col :span="19">

          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="用户组名称">
                    <a-input v-model="queryParam.name" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="使用状态">
                    <a-select v-model="queryParam.status" placeholder="请选择" :default-value="0"
                              @change="handleQueryStatusChange">
                      <a-select-option v-for="(value, key) in routeStatusDictionary"
                                       :key="key"
                                       :value="key">
                        {{ value }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="!advanced && 8 || 24" :sm="24">
                          <span class="table-page-search-submitButtons"
                                :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                            <a-button type="primary" @click="loadTableData">查询</a-button>
                            <a-button style="margin-left: 8px" @click="resetQueryParams">重置</a-button>
                          </span>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <div class="table-operator">
            <a-button type="primary" icon="plus" @click="showUserForm">新建用户组</a-button>
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
              <!--          <a-button v-if="!record.children || record.children.length === 0"-->
              <!--                    @click="handleAddChildren(record)" size="small" type="primary" shape="circle" icon="plus"/>&nbsp;-->
              <a-button @click="handleEdit(record)" size="small" type="primary" shape="circle" icon="edit"/>&nbsp;
              <a-button @click="handleDelete(record)" alt="删除" size="small" type="danger" shape="circle" icon="delete"/>
            </template>
          </a-table>
          <a-empty v-else/>
        </a-col>
      </a-row>
    </a-card>

    <!-- 创建路由信息表单-->
    <permission-user-group-form ref="userGroupForm"
                                @success="handleFormOnSuccess"
                                @cancel="handleEditFormCancel"/>


  </page-header-wrapper>

</template>

<script>

import {getUserGroups} from '@/api/usergroup-api'
import PermissionUserGroupForm from "./modules/PermissionUserGroupForm";
import PermissionUserGroupTree from "./modules/PermissionUserGroupTree";

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

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
  params: {}
}

export default {
  name: 'PermissionUserGroup',
  components: {
    PermissionUserGroupForm,
    PermissionUserGroupTree
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
          title: '用户组名称',
          dataIndex: 'name',
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: "center",
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '操作',
          width: 100,
          align: 'center',
          scopedSlots: {customRender: 'action'},
        }
      ],
      rowSelection,
      selectedRoute: {},
      routeStatusDictionary,
      userGroupFormVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    async handleEdit(record) {
      this.$refs['userGroupForm'].open(record, 'edit')
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
    showUserForm() {
      this.$refs['userGroupForm'].open()
    },
    rowKey(record) {
      return record.id
    },
    handleDelete(record) {
      this.$confirm({
        title: `提示`,
        content: `确定要禁用[${record.name}]用户吗？`,
        onOk: async () => {
        }
      })
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadTableData() {
      this.toggleLoading()
      const {data} = await getUserGroups(this.queryParam)
      this.tableData = data.records;
      this.pagination.total = data.total
      this.toggleLoading()
    }
  }
};
</script>