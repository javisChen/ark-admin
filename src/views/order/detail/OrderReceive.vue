<template>
  <a-card class="order-info-card"
          title="收货信息"
          :bordered="false">
    <div class="item">收货人：<span class="">{{ order.orderReceive.name }}</span></div>
    <div class="item">手机号码：<span>{{ order.orderReceive.mobile }}</span></div>
    <div>地址：<span class="">
          {{ order.orderReceive.province }}{{
        order.orderReceive.city
      }}{{ order.orderReceive.district }}{{ order.orderReceive.address }}</span>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'order-receive',
  props: {
    order: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

.item {
}

</style>