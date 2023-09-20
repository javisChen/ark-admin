<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="品牌名称">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>
          <!--                <a-col :md="8" :sm="24">-->
          <!--                  <a-form-item label="使用状态">-->
          <!--                    <a-select v-model="queryParam.status" placeholder="请选择" :default-value="0"-->
          <!--                              @change="handleQueryStatusChange">-->
          <!--                      <a-select-option v-for="(value, key) in routeStatusDictionary"-->
          <!--                                       :key="key"-->
          <!--                                       :value="key">-->
          <!--                        {{ value }}-->
          <!--                      </a-select-option>-->
          <!--                    </a-select>-->
          <!--                  </a-form-item>-->
          <!--                </a-col>-->
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
      <a-button type="primary" icon="plus" @click="showForm">添加新品牌</a-button>
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

      <template slot="logo" slot-scope="text, record">
        <img width="30" :src="record.imageUrl" alt="">
      </template>

      <template slot="action" slot-scope="text, record">
        <k-tooltip-button title="查看" @click="handleView(record)" icon="search"/>
      </template>
    </a-table>
    <a-empty v-else/>

    <commodity-brand-form ref="codeProjectForm"
                       @success="handleFormOnSuccess"
                       @cancel="handleEditFormCancel"/>

  </a-card>


</template>

<script>

import {getInfo, getPageList} from '@/api/commodity/brand-api'
import CommodityBrandForm from "./components/CommodityBrandForm";

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
  current: 1,
  size: 15,
}

export default {
  name: 'CommodityBrand',
  components: {
    CommodityBrandForm,
  },
  data() {
    return {
      pagination,
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam: Object.assign({}, queryParam),
      tableData: [],
      columns: [
        {
          title: '品牌名称',
          align: 'center',
          dataIndex: 'name',
          width: 150
        },
        {
          title: '品牌首字母',
          align: 'center',
          dataIndex: 'letter',
        },
        {
          title: 'LOGO',
          align: 'center',
          dataIndex: 'imageUrl',
          scopedSlots: {customRender: 'logo'},
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'gmtCreate',
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {customRender: 'action'},
          // fixed: 'right',
          width: 100
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
    async handleView(record) {
      const {data} = await getInfo({id: record.id})
      this.$refs['codeProjectForm'].open(data, 'view')
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
      try {
        const {data} = await getPageList(this.queryParam)
        this.tableData = data.records;
        this.pagination.total = data.total
      } finally {
        this.toggleLoading()
      }
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