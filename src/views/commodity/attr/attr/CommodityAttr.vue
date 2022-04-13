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

      <template slot="action" slot-scope="text, record">
        <a href="/#">编辑</a>
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

import {getInfo, getPageList} from '@/api/commodity/attr-api'
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
  type: 0,
  current: 1,
  size: 15,
}

export default {
  name: 'CommodityAttr',
  components: {
    CommodityAttrGroupForm,
  },
  props: {
    attrTemplateId: {
      type: [Number, String],
      required: true
    },
    type: {
      type: [Number],
      required: true
    }
  },
  watch: {
    attrTemplateId(newV,oldV) {
      this.queryParam.attrTemplateId = newV;
      this.loadTableData()
    }
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
          title: '属性名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
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
          width: 100
        },
      ],
      selectedRoute: {},
      routeStatusDictionary,
      roleFormVisible: false,
    };
  },
  created() {
    console.log(this.attrTemplateId)
    this.queryParam.attrTemplateId = this.attrTemplateId;
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