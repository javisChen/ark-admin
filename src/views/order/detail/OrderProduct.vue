<template>
  <a-card class="card" title="商品信息" :bordered="false">

    <a-table
      :bordered="false"
      emptyText="暂无数据"
      :pagination="false"
      :size="'small'"
      :row-key="rowKey"
      :columns="columns"
      :data-source="order.orderItems">

      <template slot="price" slot-scope="text, record">
        <span>{{ record.price | formatShowPrice }}</span>
      </template>

    </a-table>

    <div class="amount-info">
      <a-row class="row">
        <a-col class="label" span="22">商品总价：</a-col>
        <a-col class="value" span="2">{{ order.orderAmount.expectAmount | formatShowPrice}}</a-col>
      </a-row>
      <a-row class="row">
        <a-col class="label" span="22">运费（快递）：</a-col>
        <a-col class="value" span="2">{{ order.orderAmount.freightAmount | formatShowPrice}}</a-col>
      </a-row>
      <a-row class="row">
        <a-col class="label actual" span="22">实付款：</a-col>
        <a-col class="value actual" span="2">{{ order.orderAmount.actualAmount | formatShowPrice}}</a-col>
      </a-row>
    </div>


  </a-card>
</template>
<script>
export default {
  name: 'order-product',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns: [
        {
          title: '商品',
          align: 'center',
          width: 200,
          customRender: (item) => item.productName || '-'
        },
        {
          title: '商品编号',
          align: 'center',
          width: 200,
          customRender: (item) => item.code || '-',
        },
        {
          title: '价格',
          align: 'center',
          width: 200,
          scopedSlots: {customRender: 'price'},

        },
        {
          title: '数量',
          align: 'center',
          width: 100,
          customRender: (item) => item.quantity,
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {customRender: 'action'},
          width: 100
        },
      ],
    }
  },
  methods: {
    rowKey(record) {
      return record.skuId
    },
  }
}
</script>
<style>

.order-items .content {
  height: 80px;
  line-height: 80px;
  padding-top: 0;
  padding-bottom: 0;
}

.amount-info {
  margin-top: 20px;
}

.amount-info .row {
  margin-bottom: 12px;
}

.amount-info .label {
  text-align: right;
}

.actual {
  color: #E03235;
  font-size: 22px;
  font-weight: bold;
}

.amount-info .value.actual {
}



</style>