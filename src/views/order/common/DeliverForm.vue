<template>
  <a-modal :visible="visible"
           title="发货信息"
           @cancel="handleCancel"
           @ok="handleOk">
    <a-form-model ref="ruleForm"
                  :rules="rules"
                  :model="formState"
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol">
      <a-form-model-item ref="logisticsCompany" label="物流公司" prop="logisticsCompany" required>
        <a-input v-model:value="formState.logisticsCompany"/>
      </a-form-model-item>
      <a-form-model-item ref="logisticsCode" label="物流单号" prop="logisticsCode" required>
        <a-input v-model:value="formState.logisticsCode"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {deliver} from "@/api/trade/order-api";

export default {
  name: 'DeliverForm',
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: true
    },
    orderId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      formState: {
        logisticsCompany: '',
        logisticsCode: ''
      },
      rules: {
        logisticsCompany: [
          {required: true, message: '请输入物流公司', trigger: ['blur', 'change']},
        ],
        logisticsCode: [
          {required: true, message: '请输入物流单号', trigger: ['blur', 'change']},
        ],
      },
    }
  },
  methods: {
    doDelivery: async function () {
      const deliverInfo = {...this.formState}
      try {
        await deliver({
          ...deliverInfo,
          orderId: this.orderId
        })
        console.log('发货成功...')
        this.$notification.success({
          message: '发货成功',
          description: ''
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return false;
        }
        await this.doDelivery();
        this.$emit('ok', {...this.formState})
        this.formState = {};
      });
    },
    handleCancel() {
      this.formState = {};
      this.$emit('cancel')
    },

  }
}
</script>

<style lang="css">

input:focus {
  border: 0;
  outline: none;
}

</style>