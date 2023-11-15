<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="订单编号">
              <a-input v-model="queryParam.code" placeholder=""/>
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

      <template slot="orderStatus" slot-scope="text, record">
        <span>{{ record.orderStatus | translateOrderStatus }}</span>
      </template>

      <template slot="orderChannel" slot-scope="text, record">
        <span>{{ record.orderChannel | translateOrderChannel }}</span>
      </template>

      <template slot="payStatus" slot-scope="text, record">
        <span>{{ record.payStatus | translatePayStatus }}</span>
      </template>

      <template slot="payType" slot-scope="text, record">
        <span>{{ record.payTypeCode | translatePayType }}</span>
      </template>

      <template slot="actualAmount" slot-scope="text, record">
        <span>{{ record.actualAmount | fenToYuan }}</span>
      </template>

      <template slot="action" slot-scope="text, record">
        <k-tooltip-button title="查看" @click="toDetail(record)" icon="search"/>&nbsp;
        <k-tooltip-button title="模拟支付" @click="mockPay(record)" icon="wallet">
          模拟支付
        </k-tooltip-button>
      </template>
    </a-table>
    <a-empty v-else/>

  </a-card>

</template>

<script>

import {getInfo, getPageList} from '@/api/trade/order-api'
import {notify} from '@/api/pay/pay-api'
import {translatePayType, translatePayStatus, translateOrderStatus, translateOrderChannel} from '@/utils/biz-const'
import {remove} from "@/api/commodity/attr-api";
import {timeFix} from "@/utils/util";

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
  name: 'OrderManage',
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
          title: '订单编号',
          align: 'center',
          dataIndex: 'tradeNo',
        },
        {
          title: '提交时间',
          align: 'center',
          dataIndex: 'gmtCreate',
        },
        {
          title: '订单金额',
          align: 'center',
          dataIndex: 'actualAmount',
          scopedSlots: {customRender: 'actualAmount'},
        },
        {
          title: '支付方式',
          align: 'center',
          dataIndex: 'payType',
          scopedSlots: {customRender: 'payType'},
        },
        {
          title: '订单来源',
          align: 'center',
          dataIndex: 'orderChannel',
          scopedSlots: {customRender: 'orderChannel'},
        },
        {
          title: '支付状态',
          align: 'center',
          dataIndex: 'payStatus',
          scopedSlots: {customRender: 'payStatus'},
        },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'orderStatus',
          scopedSlots: {customRender: 'orderStatus'},
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {customRender: 'action'},
          width: 100
        },
      ],
      selectedRoute: {},
      roleFormVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    // translateOrderStatus(value) {
    //   return DICT_ORDER_STATUS[value]
    // },
    // translateOrderChannel(value) {
    //   return DICT_ORDER_CHANNEL[value]
    // },
    // translatePayType(value) {
    //   return DICT_PAY_TYPE[value]
    // },
    // translatePayStatus(value) {
    //   return DICT_PAY_STATUS[value]
    // },
    toDetail(record) {
      this.$router.push({
        path: `/order/details`,
        query: {orderId: record.id},
      })
    },
    mockPay(record) {
      this.$confirm({
        title: `提示`,
        content: `确认要发起模拟支付完成吗？`,
        onOk: async () => {
          try {
            const {data} = await notify({payTradeNo: record.payTradeNo, orderId: record.id, status: 3})
            this.$notification.success({
              message: '操作成功',
              description: ''
            })
          } catch (e) {
            console.log(e)
          }
          await this.loadTableData();
        }
      })
    },
    toAttrGroup(record) {
      this.$router.push({
        path: '/commodity/attr/group',
        query: {templateId: record.id},
      })
    },
    toAttrSpec(record) {
      this.$router.push({
        path: '/commodity/attr',
        query: {
          templateId: record.id,
          type: 1
        },
      })
    },
    toAttrParam(record) {
      this.$router.push({
        path: '/commodity/attr',
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