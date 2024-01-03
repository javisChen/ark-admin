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

      <template slot="shelfStatus" slot-scope="text, record">
        {{ getShelfStatus(record.shelfStatus) }}
      </template>

      <template slot="action" slot-scope="text, record">
        <a @click="toDetail(record)">编辑</a>&nbsp;
        <a v-if="record.shelfStatus === 1" @click="changeShelf(record, 0)">下架</a>
        <a v-else @click="changeShelf(record, 1)">上架</a>
      </template>
    </a-table>
    <a-empty v-else/>

  </a-card>

</template>

<script>

import {changeShelfStatus, getPageList} from '@/api/product/goods-api'
import {deleteRole} from "@/api/iam/role-api";

const shelfStatusDict = {
  1: '已上架',
  0: '已下架'
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
  name: 'Goods',
  components: {},
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
          dataIndex: 'createTime',
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
    toDetail(record) {
      this.$router.push({
        path: '/goods/form',
        query: {spuId: record.id},
      })
    },
    changeShelf(record, shelfStatus) {
      const text = shelfStatus === 1 ? '下架' : '上架'
      this.$confirm({
        title: `提示`,
        content: `确定要${text}该商品吗？`,
        onOk: async () => {
          try {
            await changeShelfStatus({id: record.id, shelfStatus})
            await this.loadTableData()
            this.$message.success(`${text}成功`)
          } catch (e) {
            console.log(e)
          }
        }
      })
    },
    getShelfStatus(value) {
      return shelfStatusDict[value]
    },
    toAttrGroup(record) {
      this.$router.push({
        path: '/goods/attr/group',
        query: {templateId: record.id},
      })
    },
    toAttrSpec(record) {
      this.$router.push({
        path: '/goods/attr',
        query: {
          templateId: record.id,
          type: 1
        },
      })
    },
    toAttrParam(record) {
      this.$router.push({
        path: '/goods/attr',
        query: {
          templateId: record.id,
          type: 2
        },
      })
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
        path: '/goods/form',
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