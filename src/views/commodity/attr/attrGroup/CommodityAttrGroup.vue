<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="属性组名称">
              <a-input v-model="queryParam.name" placeholder=""/>
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
      <a-button type="primary" icon="plus" @click="showForm">添加属性组</a-button>
    </div>

    <a-table
      v-if="tableData && tableData.length > 0"
      bordered
      @change="handleTableChange"
      :pagination="pagination"
      :loading="tableLoading"
      :defaultExpandAllRows="defaultExpandAllRows"
      :expandRowByClick="true"
      :size="'small'"
      :indent-size="15"
      :row-key="rowKey"
      :columns="columns"
      :data-source="tableData">

      <template slot="gitReposUrl" slot-scope="text, record">
        <a @click="goToGit(text);" :href="text">{{ text }}</a>
      </template>

      <template slot="action" slot-scope="text, record">
        <k-tooltip-button title="查看" @click="handleView(record)" icon="search"/>
        &nbsp
        <k-tooltip-button title="下载" @click="openDownloadView(record)" icon="download"/>&nbsp;
      </template>
    </a-table>
    <a-empty v-else/>


    <!-- 创建路由信息表单-->
    <commodity-attr-group-form ref="commodityAttrTemplateForm"
                       @success="handleFormOnSuccess"
                       @cancel="handleEditFormCancel"/>

  </a-card>


</template>

<script>

import {getInfo, getPageList} from '@/api/commodity/attr-group-api'
import CommodityAttrGroupForm from "./components/CommodityAttrGroupForm";

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
  name: '',
  attrTemplateId: 0,
  current: 1,
  size: 15,
}

export default {
  name: 'CommodityAttrGroup',
  components: {
    CommodityAttrGroupForm,
  },
  data() {
    return {
      scroll: {x: 1300},
      pagination,
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam: Object.assign({}, queryParam),
      tableData: [],
      columns: [
        {
          title: '模板名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'gmtCreate',
        },
        {
          title: '设置',
          align: 'center',
          scopedSlots: {customRender: 'action'},
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {customRender: 'action'},
          width: 100
        },
      ],
      selectedRoute: {},
      routeStatusDictionary,
      roleFormVisible: false,
    };
  },
  created() {
    console.log(this.$route)
    this.queryParam.attrTemplateId = this.$route.query.templateId;
    this.loadTableData();
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.queryParam.current = pagination.current
      this.loadTableData()
    },
    resetQueryParams() {
      this.queryParam = Object.assign(this.queryParam, queryParam)
      this.loadTableData()
    },
    handleQueryStatusChange(value) {
      this.loadTableData()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleFormOnSuccess() {
      this.$message.success('保存成功')
      this.loadTableData()
    },
    handleEditFormCancel() {
    },
    showForm() {
      this.$refs['commodityAttrTemplateForm'].open()
    },
    rowKey(record) {
      return record.id
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadTableData() {
      this.toggleLoading()
      const {data} = await getPageList(this.queryParam)
      this.tableData = data.records;
      this.pagination.total = data.total
      this.toggleLoading()
    }
  }
};

</script>

<style lang="css">

input:focus {
  border: 0;
  outline: none;
}

</style>