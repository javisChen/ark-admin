<template>
  <a-card :bordered="false" title="订单流程" class="order-info-card">
    <template #extra>
      <a-button v-if="order.orderBase.orderStatus === waitDeliverStatus"
                type="secondary"
                @click="() => showDeliverForm = true">发货
      </a-button>
    </template>

    <a-steps size="small"
             :direction="'horizontal'"
             :current="currentStep">
      <a-step v-for="(step, idx) in steps" :key="idx">
        <template v-slot:title>
          <span>{{ step.title }}</span>
        </template>
        <template v-slot:description>
          <div class="antd-pro-pages-profile-advanced-style-stepDescription">
            <div class="step-time">{{ step.description }}</div>
          </div>
        </template>
      </a-step>
    </a-steps>

    <deliver-form v-if="order && order.orderBase"
                  :visible="showDeliverForm"
                  :order-id="order.orderBase.id"
                  @ok="handlerDeliverOk"
                  @cancel="() => showDeliverForm = false"
    />

  </a-card>

</template>

<script>
import {
  DICT_ORDER_STATUS_COMPLETED,
  DICT_ORDER_STATUS_WAIT_DELIVER,
  DICT_ORDER_STATUS_WAIT_EVALUATE,
  DICT_ORDER_STATUS_WAIT_PAY,
  DICT_ORDER_STATUS_WAIT_RECEIVE
} from "@/utils/biz-const";
import DeliverForm from "@/views/order/common/DeliverForm.vue";

export default {
  name: 'order-steps',
  components: {
    DeliverForm
  },
  props: {
    order: {
      type: Object,
      required: true
    },
  },
  computed: {
    steps() {
      return [
        {
          title: '提交订单',
          description: this.order.orderBase.createTime,
        },
        {
          title: '付款成功',
          description: this.order.orderBase.payTime,
        },
        {
          title: '商品发货',
          description: this.order.orderBase.deliverTime,
        },
        {
          title: '确认收货',
          description: this.order.orderBase.receiveTime,
        },
      ]
    },
    currentStep() {
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
  data() {
    return {
      showDeliverForm: false,
      waitDeliverStatus: DICT_ORDER_STATUS_WAIT_DELIVER,
    }
  },
  methods: {
    async handlerDeliverOk() {
      this.showDeliverForm = false
      this.$emit('deliver-ok')
    },
  }
}
</script>

<style scoped>

</style>
