<template>

  <a-modal style="width: 1000px"
           v-model="visible"
           title="编辑路由"
           ok-text="确认"
           :confirmLoading="true"
           :destroyOnClose="true"
           :footer="null"
           :closable="true"
           @cancel="handleClose"
           cancel-text="取消">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="name" label="路由名称" prop="name" required has-feedback>
        <a-input v-model="form.name"/>
      </a-form-model-item>
      <a-form-model-item label="路由编码" prop="code" required has-feedback>
        <a-input v-model="form.code"/>
      </a-form-model-item>
      <a-form-model-item label="组件" prop="component" has-feedback>
        <a-input v-model="form.component"/>
      </a-form-model-item>
      <a-form-model-item label="路径" prop="path">
        <a-input v-model="form.path"/>
      </a-form-model-item>
      <a-form-model-item label="Icon" prop="icon">
        <a-input v-model="form.icon"/>
      </a-form-model-item>
      <a-form-model-item label="状态" prop="status" required>
        <a-radio-group name="radioGroup" v-model="form.status" :default-value="form.status">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="排序" prop="sequence">
        <a-input v-model="form.sequence" type="textarea"/>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submitForm('ruleForm')">
          确认
        </a-button>
        <a-button style="margin-left: 10px;" @click="handleClose">
          关闭
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

export default {
  name: 'PermissionRouteEditForm',
  props: {

  },
  data() {
    return {
      visible: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: {},
      rules: {
        name: [{required: true, message: '请输入路由名称', trigger: 'change'}],
        code: [{required: true, message: '请输入路由编码', trigger: 'change'}],
        status: [{required: true, message: '请选择路由状态', trigger: 'change'}],
      }
    }
  },
  methods: {
    open(model) {
      this.visible = true
      this.form = model
    },
    close() {
      this.visible = false
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.$emit('success', '')
        this.close()
      });
    },

  },
  created() {
    console.log('init edit form')
  }
}
</script>
