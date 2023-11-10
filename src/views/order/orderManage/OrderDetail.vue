<template>

  <div v-if="order && order.orderBase">
    <a-card :bordered="false" title="订单流程">
      <a-steps size="small" :direction="isMobile && 'vertical' || 'horizontal'" :current="orderStep()">
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
        <a-col :span="8">
          <h1 class="trade-no">单号：{{ this.order.orderBase.tradeNo }}</h1>
        </a-col>
        <a-col :span="6">
          <h1 class="trade-no">金额：{{ this.order.orderCharge.actualAmount | fenToYuan }}</h1>
        </a-col>
        <a-col :span="4">
          <h1 class="trade-no">状态：{{ this.order.orderBase.orderStatus | translateOrderStatus }}</h1>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <p>创建人：{{ this.order.orderBase.buyerId }}</p>
          <p>创建时间：{{ this.order.orderBase.createTime }}</p>
          <p>备注：{{ this.order.orderBase.buyerRemark }}</p>
        </a-col>
      </a-row>
    </a-card>

    <!-- 基本信息 -->
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <a-col class="t-header title first" :span="4">
          订单编号
        </a-col>
        <a-col class="t-header title" :span="4">
          发货流水号
        </a-col>
        <a-col class="t-header title" :span="4">
          买家
        </a-col>
        <a-col class="t-header title" :span="4">
          支付方式
        </a-col>
        <a-col class="t-header title" :span="4">
          订单来源
        </a-col>
        <a-col class="t-header title" :span="4">
          订单类型
        </a-col>
      </a-row>
      <a-row>
        <a-col class="t-header content first" :span="4">
          {{ this.order.orderBase.tradeNo }}
        </a-col>
        <a-col class="t-header content" :span="4">
          -
        </a-col>
        <a-col class="t-header content" :span="4">
          -
        </a-col>
        <a-col class="t-header content" :span="4">
          -
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ this.order.orderBase.orderChannel }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ this.order.orderBase.orderType }}
        </a-col>
      </a-row>
      <a-row>
        <a-col class="t-header title first" :span="4">
          配送方式
        </a-col>
        <a-col class="t-header title" :span="4">
          物流单号
        </a-col>
        <a-col class="t-header title" :span="4">
          自动确认收货时间
        </a-col>
        <a-col class="t-header title" :span="4">
          活动信息
        </a-col>
      </a-row>
      <a-row>
        <a-col class="t-header content first" :span="4">
          -
        </a-col>
        <a-col class="t-header content" :span="4">
          -
        </a-col>
        <a-col class="t-header content" :span="4">
          -
        </a-col>
        <a-col class="t-header content" :span="4">
          -
        </a-col>
      </a-row>
    </a-card>
    <!-- 基本信息 -->

    <!-- 商品信息 -->
    <a-card class="card" title="商品信息" :bordered="false">
      <a-row>
        <a-col class="t-header title first" :span="4">
          商品编号
        </a-col>
        <a-col class="t-header title" :span="4">
          名称
        </a-col>
        <a-col class="t-header title" :span="4">
          图片
        </a-col>
        <a-col class="t-header title" :span="4">
          单价
        </a-col>
        <a-col class="t-header title" :span="4">
          数量
        </a-col>
        <a-col class="t-header title" :span="4">
          金额
        </a-col>
      </a-row>
      <a-row v-for="item in order.orderProducts" :key="item.id">
        <a-col class="t-header content first" :span="4">
          {{ item.code }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ item.productName }}
        </a-col>
        <a-col class="t-header content" :span="4">
          <img width="100" height="100" :src="item.picUrl" alt="">
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ item.price | fenToYuan }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ item.quantity }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ item.price | fenToYuan }}
        </a-col>
      </a-row>
    </a-card>
    <!-- 商品信息 -->

    <!-- 收货人信息 -->
    <a-card class="card" title="收货人信息" :bordered="false">
      <a-row>
        <a-col class="t-header title first" :span="4">
          收货人
        </a-col>
        <a-col class="t-header title" :span="4">
          手机号码
        </a-col>
        <a-col class="t-header title" :span="4">
          收货地址
        </a-col>
      </a-row>
      <a-row>
        <a-col class="t-header content first" :span="4">
          {{ this.order.orderReceive.name }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ this.order.orderReceive.mobile }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ this.order.orderReceive.province }}{{ this.order.orderReceive.city }}{{
            this.order.orderReceive.district
          }}{{ this.order.orderReceive.address }}
        </a-col>
      </a-row>
    </a-card>
    <!-- 收货人信息 -->
  </div>
</template>

<script>

import {getInfo} from '@/api/trade/order-api'
import {DICT_ORDER_STATUS, DICT_ORDER_CHANNEL, DICT_PAY_STATUS, DICT_PAY_TYPE} from '@/utils/biz-const'

export default {
  name: "OrderDetail",
  data() {
    return {
      isMobile: false,
      orderId: 0,
      order: {}
    }
  },
  computed: {
  },
  methods: {
    async loadOrder() {
      try {
        const {data} = await getInfo({id: this.orderId});
        this.order = data
      } catch (e) {
        console.log(e)
      }
    },
    orderStep() {
      if (this.order && this.order.orderBase) {
        console.log(this)
        console.log(this.order)
        console.log(this.order.orderBase)
        console.log(this.orderId)
        const orderStatus = this.order.orderBase.orderStatus;
        if (orderStatus == 1) {
          return 0
        }
        if (orderStatus == 2) {
          return 1
        }
      }
    }
  },
  created() {
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId;
      this.loadOrder();
    }
  },
}
</script>

<style scoped>
.trade-no {
  font-size: 20px;
}

.t-header {
  border-right: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
  /*border: 1px solid gray;*/
  text-align: center;
  padding-top: 12px;
  padding-bottom: 12px;
}

.t-header.title {
  color: #000000d9;
  font-weight: 500;
  background-color: #fafafa;
}

.t-header.content {
  border-bottom: 1px solid #f0f0f0;
}

.t-header.first {
  border-left: 1px solid #f0f0f0;
}
</style>