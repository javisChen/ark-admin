<template>
  <a-modal
    :width="1000"
    :centered="false"
    v-model="visible"
    title="元素管理"
    ok-text="确定"
    :confirmLoading="false"
    :destroyOnClose="true"
    :closable="true"
    @cancel="handleClose"
    cancel-text="取消">
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="showForm">添加元素</a-button>
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
          <k-tooltip-button title="删除" @click="handleDelete(record)" type="danger" icon="delete"/>
        </template>
      </a-table>
      <a-empty v-else/>

    </a-card>

    <!-- 创建路由信息表单-->
    <permission-page-element-form ref="elementForm"
                                  @success="handleFormOnSuccess"
                                  @cancel="handleEditFormCancel"/>
  </a-modal>

</template>

<script>

import {getPageElements} from '@/api/page-element-api'

import PermissionPageElementForm from "./PermissionPageElementForm";

const routeStatusDictionary = {
  1: '已启用',
  2: '已禁用'
}

const queryParam = {
  current: 1,
  size: 15,
  params: {}
}

export default {
  name: 'PermissionPageElementTable',
  components: {
    PermissionPageElementForm
  },
  data() {
    return {
      visible: false,
      defaultExpandAllRows: true,
      tableLoading: false,
      advanced: false,
      queryParam,
      tableData: [],
      columns: [
        {
          title: '元素名称',
          dataIndex: 'name',
          width: 100
        },
        {
          title: '元素类型',
          dataIndex: 'type',
          width: 100,
          customRender: (text, row, index) => {
            return text || '-'
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 50,
          align: "center",
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '操作',
          width: 50,
          align: 'center',
          scopedSlots: {customRender: 'action'},
        },
      ],
      selectedRoute: {},
      routeStatusDictionary,
      userFormVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    open(formModel) {
      this.visible = true
    },
    close() {
      this.visible = false
      this.resetForm()
    },
    resetForm() {

    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function ($form) {
      this.$emit('success', '')
      this.close()
    },
    async handleEdit(record) {
      this.$refs['userForm'].open(record, 'edit')
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
    getStatusDesc(status) {
      return routeStatusDictionary[status]
    },
    handleFormOnSuccess() {
      this.$message.success('保存成功')
      this.loadTableData()
    },
    handleEditFormCancel() {
    },
    showForm() {
      this.$refs['elementForm'].open()
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
      const {data} = await getPageElements(this.queryParam)
      this.tableData = data;
      this.toggleLoading()
    }
  }
};
</script>