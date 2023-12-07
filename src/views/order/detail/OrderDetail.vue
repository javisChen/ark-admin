<template>

  <div v-if="order && order.orderBase">

    <a-row class="form-row" :gutter="20">
      <a-col span="8">
        <!-- 订单基本信息 -->
        <order-base :order="order"/>
      </a-col>
      <a-col span="16">
        <!-- 订单进展 -->
        <order-steps :order="order"
                     @deliver-ok="() => this.loadOrder()"/>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="20">
      <a-col span="8">
        <!-- 收货信息 -->
        <order-receive :order="order"/>
      </a-col>
      <a-col span="8">
        <order-deliver :order="order"/>
      </a-col>
      <a-col span="8">
        <!-- 订单进展 -->
        <order-pay :order="order"/>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="20">
      <a-col span="24">
        <!-- 商品信息 -->
        <order-product :order="order"/>
        <!-- 商品信息 -->
      </a-col>
    </a-row>


  </div>
</template>

<script>

import {getInfo} from '@/api/trade/order-api'

import {
  DICT_ORDER_STATUS_WAIT_DELIVER,
  DICT_ORDER_STATUS_WAIT_EVALUATE,
  DICT_ORDER_STATUS_WAIT_PAY,
  DICT_ORDER_STATUS_WAIT_RECEIVE
} from '@/utils/biz-const'
import OrderSteps from "@/views/order/detail/OrderSteps.vue";
import OrderBase from "@/views/order/detail/OrderBase.vue";
import OrderReceive from "@/views/order/detail/OrderReceive.vue";
import OrderDeliver from "@/views/order/detail/OrderDeliver.vue";
import OrderPay from "@/views/order/detail/OrderPay.vue";
import OrderProduct from "@/views/order/detail/OrderProduct.vue";

export default {
  name: "OrderDetail",
  components: {
    OrderProduct,
    OrderPay,
    OrderDeliver,
    OrderReceive,
    OrderBase,
    OrderSteps
  },
  data() {
    return {
      DICT_ORDER_STATUS_WAIT_PAY,
      DICT_ORDER_STATUS_WAIT_DELIVER,
      DICT_ORDER_STATUS_WAIT_RECEIVE,
      DICT_ORDER_STATUS_WAIT_EVALUATE,
      orderId: 0,
      order: {}
    }
  },
  computed: {},
  methods: {
    async loadOrder() {
      try {
        const {data} = await getInfo({id: this.orderId});
        this.order = data
      } catch (e) {
        console.log(e)
      }
    },
  },
  created() {
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId;
      this.loadOrder();
    }
  },
}
</script>

<style>

.order-info-card {
  margin-bottom: 20px;
  min-height: 250px;
}

.item {
  margin-bottom: 20px;
}

</style>