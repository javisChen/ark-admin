<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item :label="title + '名称'">
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
      <a-button type="primary" icon="plus" @click="showForm">添加{{ title }}</a-button>
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
        <a href="/#" @click="showForm($event, 'edit', record)">编辑</a>&nbsp;
        <a href="/#" @click="removeAttr(record)">删除</a>
      </template>

      <template slot="type" slot-scope="text, record">
        {{ getTypeDesc(record.type) }}
      </template>


      <template slot="inputType" slot-scope="text, record">
        {{ getInputTypeDesc(record.inputType) }}
      </template>

    </a-table>
    <a-empty v-else/>

    <!-- 创建路由信息表单-->
    <goods-attr-form
      v-if="queryParam.attrTemplateId"
      ref="goodsAttrForm"
      @success="handleFormOnSuccess"
      @cancel="handleEditFormCancel"/>

  </a-card>


</template>

<script>

import {getInfo, getPageList, remove} from '@/api/product/attr-api'
import GoodsAttrForm from "./components/GoodsAttrForm";
import {deleteApi} from "@/api/iam/api-api";

const typeDict = {
  1: '规格',
  2: '参数'
}
const inputTypeDict = {
  1: '手工录入',
  2: '从选项列表选取'
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
  name: 'GoodsAttr',
  components: {
    GoodsAttrForm,
  },
  props: {
    attrTemplateId: {
      type: [Number, String],
      required: false
    },
    type: {
      type: [Number],
      required: false
    }
  },
  watch: {
    attrTemplateId(newV, oldV) {
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
          title: '名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          scopedSlots: {customRender: 'type'},
        },
        {
          title: '录入方式',
          align: 'center',
          dataIndex: 'inputType',
          scopedSlots: {customRender: 'inputType'},
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',

        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {customRender: 'action'},
          width: 100
        },
      ],
      typeDict,
      roleFormVisible: false,
    };
  },
  computed: {
    title() {
      console.log(this.queryParam)
      if (this.queryParam) {
        if (this.queryParam.type == 1) {
          return '规格'
        } else if (this.queryParam.type == 2) {
          return '参数'
        }
      }
      return ''
    },
  },
  created() {
    if (this.$route.query.attrTemplateId) {
      this.queryParam.attrTemplateId = this.$route.query.attrTemplateId;
      this.queryParam.type = this.$route.query.type;
    } else {
      this.queryParam.attrTemplateId = this.attrTemplateId;
    }
    this.loadTableData();
  },
  methods: {
    getTypeDesc(value) {
      return typeDict[value]
    },
    getInputTypeDesc(value) {
      return inputTypeDict[value]
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
    async removeAttr(record) {
      this.$confirm({
        title: `提示`,
        content: `确认要删除[${record.name}]？`,
        onOk: async () => {
          const {data} = await remove({id: record.id})
          await this.loadTableData();
        }
      })
    },
    async showForm(event, mode = 'add', record) {
      if (mode === 'edit') {
        try {
          const {data} = await getInfo({id: record.id})
          record = data
        } catch (e) {

        }
      }
      this.$refs['goodsAttrForm'].open(mode, record, this.queryParam.attrTemplateId, this.queryParam.type)
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