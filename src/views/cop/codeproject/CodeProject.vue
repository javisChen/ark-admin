<template>
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
      <a-button type="primary" icon="plus" @click="showRoleForm">创建工程</a-button>
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

      <template slot="gitReposUrl" slot-scope="text, record">
        <a @click="goToGit(text);" :href="text">{{text}}</a>
      </template>

      <template slot="action" slot-scope="text, record">
        <k-tooltip-button title="编辑" @click="handleEdit(record)" icon="edit"/>&nbsp;
      </template>
    </a-table>
    <a-empty v-else/>


    <!-- 创建路由信息表单-->
    <code-project-form ref="codeProjectForm"
                          @success="handleFormOnSuccess"
                          @cancel="handleEditFormCancel"/>


  </a-card>


</template>

<script>

import {pageListCodeProject} from '@/api/cop/code-project-api'
import CodeProjectForm from "@/views/cop/codeproject/components/CodeProjectForm";

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
  name: 'CodeProject',
  components: {
    CodeProjectForm,
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
          title: '工程名称',
          align: 'center',
          dataIndex: 'name',
          width: 200
        },
        {
          title: '工程代码',
          align: 'center',
          dataIndex: 'code',
          width: 200
        },
        {
          title: '工程类型',
          align: 'center',
          width: 100,
          dataIndex: 'type',
        },
        {
          title: '脚手架',
          align: 'center',
          width: 100,
          dataIndex: 'scaffold',
        },
        {
          title: '仓库地址',
          width: 200,
          dataIndex: 'gitReposUrl',
          scopedSlots: {customRender: 'gitReposUrl'},
        },
        {
          title: '创建时间',
          align: 'center',
          width: 200,
          dataIndex: 'createTime',
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
      this.$refs['codeProjectForm'].open()
    },
    rowKey(record) {
      return record.id
    },
    goToGit(text) {
      window.open(text)
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadTableData() {
      this.toggleLoading()
      const {data} = await pageListCodeProject(this.queryParam)
      this.tableData = data.records;
      this.pagination.total = data.total
      this.toggleLoading()
    }
  }
};

</script>