<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!--      <div class="table-page-search-wrapper">-->
      <!--        <a-form layout="inline">-->
      <!--          <a-row :gutter="48">-->
      <!--            <a-col :md="8" :sm="24">-->
      <!--              <a-form-item label="规则编号">-->
      <!--                <a-input v-model="queryParam.id" placeholder=""/>-->
      <!--              </a-form-item>-->
      <!--            </a-col>-->
      <!--            <a-col :md="8" :sm="24">-->
      <!--              <a-form-item label="使用状态">-->
      <!--                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">-->
      <!--                  <a-select-option value="0">全部</a-select-option>-->
      <!--                  <a-select-option value="1">关闭</a-select-option>-->
      <!--                  <a-select-option value="2">运行中</a-select-option>-->
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
      <!--              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">-->
      <!--                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>-->
      <!--                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>-->
      <!--                <a @click="toggleAdvanced" style="margin-left: 8px">-->
      <!--                  {{ advanced ? '收起' : '展开' }}-->
      <!--                  <a-icon :type="advanced ? 'up' : 'down'"/>-->
      <!--                </a>-->
      <!--              </span>-->
      <!--            </a-col>-->
      <!--          </a-row>-->
      <!--        </a-form>-->
      <!--      </div>-->

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="showAddForm">新建</a-button>
      </div>

      <a-table
        bordered
        :size="'middle'"
        :scroll="{ x: 1300 }"
        :indent-size="15"
        :row-key="rowKey"
        :columns="columns"
        :data-source="data">

        <template slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="handleDetail(record)">查看</a>&nbsp;
          <a v-if="record.status === 1" href="javascript:;" @click="handleDisable">禁用</a>&nbsp;
          <a v-if="record.status === 2" href="javascript:;" @click="handleEnable">启用</a>&nbsp;
          <a href="javascript:;" @click="handleDelete">删除</a>
        </template>
      </a-table>

    </a-card>

    <!-- 编辑路由信息-->
    <permission-route-edit-form ref="editForm"
                                @success="handleFormOnSuccess"
                                @cancel="handleEditFormCancel"/>

    <!-- 创建路由信息表单-->
    <permission-route-add-form ref="addForm"
                               @success="handleFormOnSuccess"
                               @cancel="handleEditFormCancel"/>

  </page-header-wrapper>
</template>

<script>

import {getRouteTree, getRoute} from '@/api/route'
import {tableColumns as columns} from "./data/initData";

import PermissionRouteEditForm from './modules/PermissionRouteEditForm'
import PermissionRouteAddForm from './modules/PermissionRouteAddForm'

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

export default {
  name: 'PermissionRoute',
  components: {
    PermissionRouteAddForm,
    PermissionRouteEditForm
  },
  data() {
    return {
      data: [],
      columns,
      rowSelection,
      selectedRoute: {},
      addFormVisible: false,
    };
  },
  created() {
    this.loadRouteTree();
  },
  methods: {
    handleFormOnSuccess() {
      console.log('receive ok')
    },
    handleEditFormCancel() {
      console.log('receive cancel')
    },
    showAddForm() {
      this.$refs['addForm'].open()
    },
    rowKey(record) {
      return record.id
    },
    handleDisable(record) {

    },
    handleEnable(record) {

    },
    async handleDetail(record) {
      const {data} = await getRoute(record.id)
      this.$refs['editForm'].open(data)
    },
    handleDelete(record) {

    },
    async loadRouteTree() {
      const {data} = await getRouteTree()
      this.data = data.routes.map(item => {
        filterNonChildren(item.children);
        return item;
      });

      // 筛选下children
      function filterNonChildren(children) {
        for (let i = 0; i < children.length; i++) {
          let child = children[i]
          if (!child.children || child.children.length == 0) {
            delete child.children
          } else {
            filterNonChildren(child.children)
          }
        }
        return children;
      }
    }
  }
};
</script>