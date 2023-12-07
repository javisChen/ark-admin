<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col span="6">
            <a-form-item label="订单编号">
              <a-input v-model="queryParam.tradeNo" placeholder="订单编号"/>
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

    <a-table
      v-if="orders && orders.length > 0"
      bordered
      emptyText="暂无数据"
      @change="handleTableChange"
      :pagination="pagination"
      :loading="tableLoading"
      :defaultExpandAllRows="defaultExpandAllRows"
      :expandRowByClick="true"
      :size="'small'"
      :indent-size="15"
      :row-key="rowKey"
      :columns="columns"
      :data-source="orders">

      <template slot="actualAmount" slot-scope="text, record">
        <span>{{ record.orderAmount.actualAmount | formatShowPrice }}</span>
      </template>

      <template slot="orderStatus" slot-scope="text, record">
        <span>{{ record.orderBase.orderStatus | translateOrderStatus }}</span>
      </template>

      <template slot="orderChannel" slot-scope="text, record">
        <span>{{ record.orderBase.orderChannel | translateOrderChannel }}</span>
      </template>

      <template slot="payStatus" slot-scope="text, record">
        <span>{{ record.orderBase.payStatus | translatePayStatus }}</span>
      </template>

      <template slot="payType" slot-scope="text, record">
        <span>{{ record.orderBase.payType | translatePayType }}</span>
      </template>

      <template slot="actualAmount" slot-scope="text, record">
        <span>{{ record.orderAmount.actualAmount | formatShowPrice }}</span>
      </template>

      <template slot="action" slot-scope="text, order">
        <k-tooltip-button title="查看" @click="toDetail(order)" icon="search"/>&nbsp;
        <k-tooltip-button v-if="order.orderBase.orderStatus === 1" title="模拟支付" @click="mockPay(order)"
                          icon="money-collect">
          模拟支付
        </k-tooltip-button>&nbsp;
        <k-tooltip-button title="发货" @click="delivery(order)" icon="mobile">
          发货
        </k-tooltip-button>
      </template>
    </a-table>

    <a-empty v-else/>

    <deliver-form :visible="showDeliverForm"
                  :order-id="selectedOrderId"
                  @ok="onDeliverSubmit"
                  @cancel="() => showDeliverForm = false"
    />

  </a-card>

</template>

<script>

import {getPageList, deliver} from '@/api/trade/order-api'
import {notify} from '@/api/pay/pay-api'
import DeliverForm from "@/views/order/common/DeliverForm.vue";

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
  name: 'Order',
  components: {
    DeliverForm
  },
  data() {
    return {
      selectedOrder: {},
      selectedOrderId: '',
      showDeliverForm: false,
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
      orders: [],
      columns: [
        {
          title: '订单编号',
          align: 'center',
          width: 200,
          customRender: (order) => order.orderBase.tradeNo,
        },
        {
          title: '下单时间',
          align: 'center',
          width: 200,
          customRender: (order) => order.orderBase.createTime,
        },
        {
          title: '订单金额',
          align: 'center',
          width: 200,
          scopedSlots: {customRender: 'actualAmount'},
        },
        {
          title: '支付方式',
          align: 'center',
          width: 100,
          scopedSlots: {customRender: 'payType'},
        },
        {
          title: '订单来源',
          align: 'center',
          width: 100,
          scopedSlots: {customRender: 'orderChannel'},
        },
        {
          title: '支付状态',
          align: 'center',
          width: 100,
          scopedSlots: {customRender: 'payStatus'},
        },
        {
          title: '订单状态',
          align: 'center',
          width: 100,
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
    async onDeliverSubmit() {
      this.showDeliverForm = false
      await this.loadTableData();
    },
    toDetail(record) {
      this.$router.push({
        path: `/order/details`,
        query: {orderId: record.orderBase.id},
      })
    },
    mockPay(record) {
      this.$confirm({
        title: `提示`,
        content: `确认要发起模拟支付完成吗？`,
        onOk: async () => {
          try {
            await notify({
              payTradeNo: record.orderBase.payTradeNo,
              bizTradeNo: record.orderBase.tradeNo,
              status: 3
            })
            setTimeout(async () => {

              this.$notification.success({
                message: '操作成功',
                description: ''
              })
              await this.loadTableData();
            }, 1000)
          } catch (e) {
            console.log(e)
          }
        }
      })
    },
    delivery(order) {
      this.showDeliverForm = true
      this.selectedOrder = order
      this.selectedOrderId = order.orderBase.id
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
      return record.orderBase.id
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
        this.orders = data.records;
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