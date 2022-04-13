<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="模板名称">
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
      <a-button type="primary" icon="plus" @click="showForm">添加模板</a-button>
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
        <a href="#/" @click="toAttrGroup(record)">查看属性组</a>&nbsp;
        <a href="#/" @click="toAttrSpec(record)">查看规格</a>&nbsp;
        <a href="#/" @click="toAttrParam(record)">查看参数</a>
      </template>

      <template slot="action" slot-scope="text, record">
        <k-tooltip-button title="查看" @click="handleView(record)" icon="search"/>
        &nbsp
        <k-tooltip-button title="下载" @click="openDownloadView(record)" icon="download"/>&nbsp;
      </template>
    </a-table>
    <a-empty v-else/>


    <!-- 创建路由信息表单-->
    <commodity-attr-template-form ref="commodityAttrTemplateForm"
                                  @success="handleFormOnSuccess"
                                  @cancel="handleEditFormCancel"/>

    <a-modal v-if="selectedAttrTemplate"
             :visible="showAttrGroup"
             :width="800"
             title="商品属性组"
             :closable="true"
             :mask="true"
             :maskClosable="true"
             :footer="null"
             @cancel="() => this.showAttrGroup = !this.showAttrGroup">
      <commodity-attr-group :attr-template-id="selectedAttrTemplate.id"/>
    </a-modal>

    <a-modal v-if="selectedAttrTemplate"
             :visible="showAttrParam"
             :width="800"
             title="商品参数"
             :closable="true"
             :mask="true"
             :maskClosable="true"
             :footer="null"
             @cancel="() => this.showAttrParam = !this.showAttrParam">
      <commodity-attr :attr-template-id="selectedAttrTemplate.id" :type="attrType"/>
    </a-modal>

    <a-modal v-if="selectedAttrTemplate"
             :visible="showAttrSpec"
             :width="800"
             title="商品规格"
             :closable="true"
             :mask="true"
             :maskClosable="true"
             :footer="null"
             @cancel="() => this.showAttrSpec = !this.showAttrSpec">
      <commodity-attr :attr-template-id="selectedAttrTemplate.id" :type="attrType"/>
    </a-modal>

  </a-card>

</template>

<script>

import {getInfo, getPageList} from '@/api/commodity/attr-template-api'
import CommodityAttrTemplateForm from "./components/CommodityAttrTemplateForm";
import CommodityAttrGroup from "../attrGroup/CommodityAttrGroup";
import CommodityAttr from "../attr/CommodityAttr";

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
  name: 'CommodityAttrTemplate',
  components: {
    CommodityAttrTemplateForm,
    CommodityAttrGroup,
    CommodityAttr
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
      routeStatusDictionary,
      roleFormVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    toAttrGroup(record) {
      this.selectedAttrTemplate = record
      // this.$router.push({
      //   path: '/commodity/attr/group',
      //   query: {templateId: record.id},
      // })
      this.showAttrGroup = true;
    },
    toAttrSpec(record) {
      this.selectedAttrTemplate = record
      this.attrType = 1
      this.showAttrSpec = true;
    },
    toAttrParam(record) {
      this.selectedAttrTemplate = record
      this.attrType = 2
      this.showAttrParam = true;
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
      this.$refs['commodityAttrTemplateForm'].open()
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