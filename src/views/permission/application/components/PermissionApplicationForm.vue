<template>

  <a-modal
    v-model="visible"
    :title="isEditMode ? '编辑应用' : '新建应用'"
    ok-text="保存"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :closable="true"
    :centered="true"
    @ok="submitForm"
    @cancel="handleClose"
    cancel-text="取消">

    <a-form-model
      v-if="formModel"
      ref="form"
      :model="formModel"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">

      <a-form-model-item ref="name" label="应用名称" prop="name" has-feedback>
        <a-input placeholder="应用名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="应用编码" prop="code" has-feedback>
        <a-input placeholder="应用编码" v-model="formModel.code"/>
      </a-form-model-item>

      <a-form-model-item label="应用类型" prop="type">
        <a-select
          v-model="formModel.type"
          @change="handleChange"
          :allowClear="true"
          show-search
          placeholder="请选择路由组件"
          option-filter-prop="children"
          :filter-option="filterOption">
          <a-select-option v-for="(item) in applicationTypeOptions" :key="item.value" :value="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="状态" prop="status" required>
        <a-radio-group name="radioGroup" v-model="formModel.status" :default-value="1">
          <a-radio :value="1">上线</a-radio>
          <a-radio :value="2">下线</a-radio>
        </a-radio-group>
      </a-form-model-item>

    </a-form-model>

  </a-modal>
</template>

<script>

import {addApplication, updateApplication} from '@/api/application-api'

const defaultModel = {
  id: '',
  name: '',
  code: '',
  type: 1,
  status: 1,
}

const applicationTypeOptions = [
  {
    name: '业务系统（前后端）',
    value: 1
  },
  {
    name: '纯后台服务',
    value: 2
  },
]

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

export default {
  name: 'PermissionApplicationForm',
  components: {},
  data() {
    return {
      applicationTypeOptions,
      confirmLoading: false,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 10},
      formModel: Object.assign({}, defaultModel),
      type: FORM_MODE_EDIT,
      form: {},
      rules: {
        name: [{required: true, message: '请输入应用名称', trigger: 'blur'}],
        code: [{required: true, message: '请输入应用编码', trigger: 'blur'}],
        status: [{required: true, message: '请选择应用状态', trigger: 'blur'}],
        type: [{required: true, message: '请选择应用类型', trigger: 'blur'}],
      }
    }
  },
  computed: {
    isEditMode() {
      return this.type === FORM_MODE_EDIT
    },
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    onSelectRouteChange(value, selectedOptions) {
      this.formModel.pid = value[value.length - 1]
    },
    stringArrConvertToNumberArr: function () {
      return this.formModel.levelPath.split('.').map(item => +item);
    },
    open(formModel, type = FORM_MODE_ADD) {
      this.visible = true
      if (formModel) {
        console.log('formModel', formModel)
        this.formModel = Object.assign(this.formModel, formModel)
      }
      this.type = type
    },
    close() {
      this.closeConfirmLoading()
      this.visible = false
      this.resetForm()
    },
    resetForm() {
      this.formModel = Object.assign({}, defaultModel)
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function ($form) {
      this.toggleConfirmLoading()
      this.$emit('success', '')
      this.close()
    },
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
    closeConfirmLoading() {
      this.confirmLoading = false
    },
    submitForm() {
      const $form = this.$refs['form'];
      $form.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.toggleConfirmLoading()
        if (this.type === FORM_MODE_ADD) {
          addApplication(this.formModel)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          updateApplication(this.formModel)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        }
      });
    },
    checkElementsIsValid() {
      if (!this.formModel.elements || this.formModel.elements.length === 0) {
        return true
      }
      let f = true;
      const els = this.formModel.elements
      for (let i = 0; i < els.length; i++) {
        const item = els[i]
        if (!item.name || item.editable) {
          item.showError = true
          f = false
        }
      }
      return f;
    }
  },
  created() {
  }
}
</script>
