<template>
  <a-modal v-model:visible="visible"
           title="发货信息"
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
export default {
  name: 'DeliverForm',
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: true
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
    handleOk() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$emit('on-submit', {...this.formState})
          this.formState = {};
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
<style lang="css">

input:focus {
  border: 0;
  outline: none;
}

</style>