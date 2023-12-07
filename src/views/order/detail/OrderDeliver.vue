<template>
  <a-card class="order-info-card"
          title="配送信息"
          :bordered="false">
    <div class="item">配送方式：<span class="">{{ '平台' }}</span></div>
  </a-card>
</template>

<script>
export default {
  name: 'order-deliver',
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