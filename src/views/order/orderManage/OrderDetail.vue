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
              <div class="step-time">{{ order.orderBase.createTime }}</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template v-slot:title>
            <span>支付订单</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              <div class="step-time">{{ order.orderBase.payTime }}</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template v-slot:title>
            <span>平台发货</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              <div class="step-time">{{ order.orderBase.deliverTime }}</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template v-slot:title>
            <span>确认收货</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              <div class="step-time">{{ order.orderBase.receiveTime }}</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template v-slot:title>
            <span>交易完成</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              <div class="step-time">{{ order.orderBase.completionTime }}</div>
            </div>
          </template>
        </a-step>
      </a-steps>
    </a-card>

    <a-card class="card" title="基本信息" :bordered="false">
      <a-row class="form-row" :gutter="16">
        <a-col :span="8">
          <h1 class="trade-no">单号：{{ order.orderBase.tradeNo }}</h1>
        </a-col>
        <a-col :span="6">
          <h1 class="trade-no">金额：<span class="amount">{{ order.orderAmount.actualAmount | formatShowPrice }} </span></h1>
        </a-col>
        <a-col :span="4">
          <h1 class="trade-no">状态：{{ order.orderBase.orderStatus | translateOrderStatus }}</h1>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <p>创建人：{{ order.orderBase.buyerName }}</p>
          <p>创建时间：{{ order.orderBase.createTime }}</p>
          <p>备注：{{ order.orderBase.buyerRemark }}</p>
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
          买家
        </a-col>
        <a-col class="t-header title" :span="4">
          支付方式
        </a-col>
        <a-col class="t-header title" :span="4">
          支付单号
        </a-col>
        <a-col class="t-header title" :span="4">
          订单来源
        </a-col>
        <a-col class="t-header title" :span="4">
          收货时间
        </a-col>
      </a-row>
      <a-row>
        <a-col class="t-header content first" :span="4">
          {{ order.orderBase.tradeNo }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ order.orderBase.buyerName }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ order.orderBase.payType | translatePayType }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ order.orderBase.payTradeNo }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ order.orderBase.orderChannel | translateOrderChannel }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ order.orderBase.receiveTime || '-' }}
        </a-col>
      </a-row>
      <a-row>
        <a-col class="t-header title" :span="4">
          物流公司
        </a-col>
        <a-col class="t-header title" :span="4">
          物流单号
        </a-col>
      </a-row>
      <a-row>
        <a-col class="t-header content first" :span="4">
          {{ order.orderBase.logisticsCompany || '-' }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ order.orderBase.logisticsCode || '-' }}
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
      <a-row v-for="item in order.orderItems" :key="item.id" class="order-items">
        <a-col class="t-header content first" :span="4">
          {{ item.code || '-' }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ item.productName || '-' }}
        </a-col>
        <a-col class="t-header content" :span="4">
          <img :src="item.picUrl" alt="">
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ item.price | formatShowPrice }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ item.quantity || '-' }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ item.price | formatShowPrice }}
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
          {{ order.orderReceive.name }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ order.orderReceive.mobile }}
        </a-col>
        <a-col class="t-header content" :span="4">
          {{ order.orderReceive.province }}{{ order.orderReceive.city }}{{
            order.orderReceive.district
          }}{{ order.orderReceive.address }}
        </a-col>
      </a-row>
    </a-card>
    <!-- 收货人信息 -->
  </div>
</template>

<script>

import {getInfo} from '@/api/trade/order-api'
import {
  DICT_ORDER_STATUS_WAIT_PAY,
  DICT_ORDER_STATUS_WAIT_DELIVER,
  DICT_ORDER_STATUS_WAIT_RECEIVE,
  DICT_ORDER_STATUS_WAIT_EVALUATE,
  DICT_ORDER_STATUS_COMPLETED
} from '@/utils/biz-const'

export default {
  name: "OrderDetail",
  data() {
    return {
      isMobile: false,
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
    orderStep() {
      if (this.order && this.order.orderBase) {
        const orderStatus = this.order.orderBase.orderStatus;
        if (orderStatus === DICT_ORDER_STATUS_WAIT_PAY) {
          return 0
        } else if (orderStatus === DICT_ORDER_STATUS_WAIT_DELIVER) {
          return 1
        } else if (orderStatus === DICT_ORDER_STATUS_WAIT_RECEIVE) {
          return 2
        } else if (orderStatus === DICT_ORDER_STATUS_WAIT_EVALUATE) {
          return 3
        } else if (orderStatus === DICT_ORDER_STATUS_COMPLETED) {
          return 5
        }
        return 0
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

.order-items .content {
  height: 80px;
  line-height: 80px;
  padding-top: 0;
  padding-bottom: 0;
}

.step-time {
  width: 150px;
}
</style>