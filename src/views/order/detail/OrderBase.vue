<template>
  <a-card class="order-info-card"
          title="基本信息"
          :bordered="false">
    <div class="item">订单号：<span class="">{{ order.orderBase.tradeNo }}</span></div>
    <div class="item">状态：<span class="">{{ order.orderBase.orderStatus | translateOrderStatus }}</span></div>
    <div>买家：<span>{{ order.orderBase.buyerName }}</span></div>
  </a-card>
</template>

<script>
export default {
  name: 'order-base',
  props: {
    order: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>