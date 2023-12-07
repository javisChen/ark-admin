<template>
  <a-card class="order-info-card"
          title="付款信息"
          :bordered="false">
    <div class="item">付款方式：<span class="">{{ order.orderBase.payType | translatePayType }}</span></div>
    <div class="">付款时间：<span class="">{{ order.orderBase.payTime }}</span></div>
  </a-card>
</template>

<script>
export default {
  name: 'order-pay',
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