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
        <a-button type="primary" icon="plus" @click="showRouteForm">新建路由</a-button>
      </div>

      <a-table
        v-if="routes && routes.length > 0"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :defaultExpandAllRows="defaultExpandAllRows"
        :expandRowByClick="false"
        :size="'middle'"
        :scroll="{ x: 1300 }"
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
          <a-button @click="handleAddChildren(record)" size="small" type="primary" shape="circle" icon="plus"/>&nbsp;
          <a-button @click="handleDetail(record)" size="small" type="primary" shape="circle" icon="edit"/>&nbsp;
          <a-button @click="handleDelete(record)" alt="删除" size="small" type="danger" shape="circle" icon="delete"/>
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


import {getRouteTree, deleteRoute, updateRouteStatus} from '@/api/route-api'
import {tableColumns as columns} from "./data/initData";
import PermissionRouteForm from './modules/PermissionRouteForm'

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


export default {
  name: 'PermissionRoute',
  components: {
    PermissionRouteForm,
  },
  data() {
    return {
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam: {},
      routes: [],
      columns,
      rowSelection,
      selectedRoute: {},
      routeStatusDictionary,
      addFormVisible: false,
    };
  },
  created() {
    this.loadRouteTree();
  },
  methods: {
    resetQueryParams() {
      this.queryParam = {}
      this.loadRouteTree()
    },
    handleQueryStatusChange(value) {
      this.loadRouteTree()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    async routeStatusChange(value, route) {
      try {
        await updateRouteStatus({id: route.id, status: +value.key})
        await this.loadRouteTree()
        this.$message.success('修改成功')
      } catch (e) {
      }
    },
    getStatusDesc(status) {
      return routeStatusDictionary[status]
    },
    handleFormOnSuccess() {
      this.$message.success('保存成功')
      this.loadRouteTree()
    },
    handleEditFormCancel() {
    },
    showRouteForm() {
      this.$refs['routeForm'].open()
    },
    rowKey(record) {
      return record.id
    },
    handleAddChildren({levelPath, code, id, path}) {
      console.log(id)
      console.log(path)
      // 添加子路由的时候默认回显当前的路径、添加的pid就是当前父路由的id
      const model = {
        levelPath,
        code: code + ':',
        path: path + '/',
        pid: id
      }
      this.$refs['routeForm'].open(model, 'add')
    },
    async handleDetail(record) {
      this.$refs['routeForm'].open(record, 'edit')
    },
    handleDelete(record) {
      this.$confirm({
        title: `确认要删除[${record.name}]路由及其子路由吗？`,
        content: `删除操作会把子路由也一并删除掉，请慎重！`,
        onOk: async () => {
          const {data} = await deleteRoute(record.id)
          await this.loadRouteTree();
        }
      })
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadRouteTree() {
      this.toggleLoading()
      const {data} = await getRouteTree(this.queryParam)
      this.routes = data.routes.map(item => {
        filterNonChildren(item);
        return item;
      });
      this.toggleLoading()

      // 把长度为0的children删掉
      function filterNonChildren(item) {
        const children = item.children
        if (!children || children.length == 0) {
          delete item.children
          return;
        }
        for (let i = 0; i < children.length; i++) {
          let child = children[i]
          if (!child.children || child.children.length == 0) {
            delete child.children
          } else {
            filterNonChildren(child)
          }
        }
        return children;
      }
    }
  }
};
</script>