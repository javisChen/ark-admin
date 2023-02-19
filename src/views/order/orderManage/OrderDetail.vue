<template>

  <div>

    <a-card :bordered="false" title="订单流程">
      <a-steps size="small  " :direction="isMobile && 'vertical' || 'horizontal'" :current="0">
        <a-step>
          <template v-slot:title>
            <span>提交订单</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              <div>2016-12-12 12:32</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template v-slot:title>
            <span>支付订单</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              <div>2016-12-12 12:32</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template v-slot:title>
            <span>平台发货</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              <div>2016-12-12 12:32</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template v-slot:title>
            <span>确认收货</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              <div>2016-12-12 12:32</div>
            </div>
          </template>
        </a-step>
      </a-steps>
    </a-card>

    <a-card class="card" title="基本信息" :bordered="false">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <h1 class="trade-no">单号：32103921031209</h1>
        </a-col>
        <a-col :lg="6" :md="12" :sm="24">
          <h1 class="trade-no">金额：988.00</h1>
        </a-col>
        <a-col :lg="6" :md="12" :sm="24">
          <h1 class="trade-no">状态：待支付</h1>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <p>创建人：诚墨</p>
          <p>创建时间：2022-10-01 23:31:20</p>
          <p>备注：抓紧发货</p>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <h1 class="trade-no">单号：32103921031209</h1>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "OrderDetail",
  data() {
    return {
      isMobile: false
    }
  }
}
</script>

<style scoped>
.trade-no {
  font-size: 20px;
}
</style>