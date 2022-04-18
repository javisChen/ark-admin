<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="商品名称">
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
      <a-button type="primary" icon="plus" @click="showForm">添加商品</a-button>
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

      <template slot="setting" slot-scope="text, record">
        <a href="#" @click="toAttrGroup(record)">查看属性组</a>&nbsp;
        <a href="#" @click="toAttrSpec(record)">查看规格</a>&nbsp;
        <a href="#" @click="toAttrParam(record)">查看参数</a>
      </template>


      <template slot="getShelfStatus" slot-scope="text, record">
        <span>getShelfStatus(record.shelfStatus)</span>
      </template>

      <template slot="action" slot-scope="text, record">
        <k-tooltip-button title="查看" @click="handleView(record)" icon="search"/>
        &nbsp
        <k-tooltip-button title="下载" @click="openDownloadView(record)" icon="download"/>&nbsp;
      </template>
    </a-table>
    <a-empty v-else/>

  </a-card>

</template>

<script>

import {getInfo, getPageList} from '@/api/commodity/commodity-api'

const shelfStatusDict = {
  0: '已上架',
  1: '已下架'
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
  current: 1,
  size: 15,
}

export default {
  name: 'Commodity',
  components: {
  },
  data() {
    return {
      selectedAttrTemplate: {},
      showAttrGroup: false,
      showAttrSpec: false,
      showAttrParam: false,
      attrType: 0,
      scroll: {x: 1300},
      pagination,
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam: Object.assign({}, queryParam),
      tableData: [],
      columns: [
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '品牌名称',
          align: 'center',
          dataIndex: 'brandName',
        },
        {
          title: '分类名称',
          align: 'center',
          dataIndex: 'categoryName',
        },
        {
          title: '上下架状态',
          align: 'center',
          dataIndex: 'shelfStatus',
          scopedSlots: {customRender: 'shelfStatus'},
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'gmtCreate',
        },
        {
          title: '设置',
          align: 'center',
          scopedSlots: {customRender: 'setting'},
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {customRender: 'action'},
          width: 100
        },
      ],
      selectedRoute: {},
      shelfStatusDict,
      roleFormVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    getShelfStatus(value) {
      return shelfStatusDict[value]
    },
    toAttrGroup(record) {
      // this.selectedAttrTemplate = record
      this.$router.push({
        path: '/commodity/attr/group',
        query: {templateId: record.id},
      })
      // this.showAttrGroup = true;
    },
    toAttrSpec(record) {
      this.$router.push({
        path: '/commodity/attr',
        query: {
          templateId: record.id,
          type: 1
        },
      })
      // this.selectedAttrTemplate = record
      // this.attrType = 1
      // this.showAttrSpec = true;
    },
    toAttrParam(record) {
      this.$router.push({
        path: '/commodity/attr',
        query: {
          templateId: record.id,
          type: 2
        },
      })
      // this.selectedAttrTemplate = record
      // this.attrType = 2
      // this.showAttrParam = true;
    },
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
      this.$router.push({
        path: '/commodity/form',
      })
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
      console.log(123)
      const {data} = await getPageList(this.queryParam)
      if (data) {
        this.tableData = data.records;
      }
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