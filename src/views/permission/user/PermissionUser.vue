<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!--      <div class="table-page-search-wrapper">-->
      <!--        <a-form layout="inline">-->
      <!--          <a-row :gutter="48">-->
      <!--            <a-col :md="8" :sm="24">-->
      <!--              <a-form-item label="规则编号">-->
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
      <!--            <template v-if="advanced">-->
      <!--              <a-col :md="8" :sm="24">-->
      <!--                <a-form-item label="调用次数">-->
      <!--                  <a-input-number v-model="queryParam.callNo" style="width: 100%"/>-->
      <!--                </a-form-item>-->
      <!--              </a-col>-->
      <!--              <a-col :md="8" :sm="24">-->
      <!--                <a-form-item label="更新日期">-->
      <!--                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>-->
      <!--                </a-form-item>-->
      <!--              </a-col>-->
      <!--              <a-col :md="8" :sm="24">-->
      <!--                <a-form-item label="使用状态">-->
      <!--                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">-->
      <!--                    <a-select-option value="0">全部</a-select-option>-->
      <!--                    <a-select-option value="1">关闭</a-select-option>-->
      <!--                    <a-select-option value="2">运行中</a-select-option>-->
      <!--                  </a-select>-->
      <!--                </a-form-item>-->
      <!--              </a-col>-->
      <!--              <a-col :md="8" :sm="24">-->
      <!--                <a-form-item label="使用状态">-->
      <!--                  <a-select placeholder="请选择" default-value="0">-->
      <!--                    <a-select-option value="0">全部</a-select-option>-->
      <!--                    <a-select-option value="1">关闭</a-select-option>-->
      <!--                    <a-select-option value="2">运行中</a-select-option>-->
      <!--                  </a-select>-->
      <!--                </a-form-item>-->
      <!--              </a-col>-->
      <!--            </template>-->
      <!--            <a-col :md="!advanced && 8 || 24" :sm="24">-->
      <!--                    <span class="table-page-search-submitButtons"-->
      <!--                          :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">-->
      <!--                      <a-button type="primary" @click="loadRouteTree">查询</a-button>-->
      <!--                      <a-button style="margin-left: 8px" @click="resetQueryParams">重置</a-button>-->
      <!--                      <a @click="toggleAdvanced" style="margin-left: 8px">-->
      <!--                        {{ advanced ? '收起' : '展开' }}-->
      <!--                        <a-icon :type="advanced ? 'up' : 'down'"/>-->
      <!--                      </a>-->
      <!--                    </span>-->
      <!--            </a-col>-->
      <!--          </a-row>-->
      <!--        </a-form>-->
      <!--      </div>-->

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="showUserForm">新建用户</a-button>
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
        :scroll="{ x: 1300 }"
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
          <!--          <a-button @click="handleDetail(record)" size="small" type="primary" shape="circle" icon="edit"/>&nbsp;-->
          <a-button @click="handleDelete(record)" alt="删除" size="small" type="danger" shape="circle" icon="delete"/>
        </template>
      </a-table>
      <a-empty v-else/>

    </a-card>

    <!-- 创建路由信息表单-->
    <permission-user-form  ref="userForm"
                           @success="handleFormOnSuccess"
                           @cancel="handleEditFormCancel"/>

  </page-header-wrapper>

</template>

<script>

import {addUser, getUsers, updateUser} from '@/api/user-api'
import {tableColumns as columns} from "./data/initData";

import PermissionUserForm from "./modules/PermissionUserForm";

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
  params: {

  }
}

export default {
  name: 'PermissionRoute',
  components: {
    PermissionUserForm
  },
  data() {
    return {
      pagination,
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam,
      tableData: [],
      columns,
      rowSelection,
      selectedRoute: {},
      routeStatusDictionary,
      userFormVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
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
      this.$refs['userForm'].open()
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
      const {data} = await getUsers(this.queryParam)
      this.tableData = data.records;
      this.pagination.total = data.total
      this.toggleLoading()
    }
  }
};
</script>