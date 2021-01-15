<template>

  <a-modal style="width: 1000px"
           :centered="true"
           v-model="visible"
           title="新建角色"
           ok-text="确认"
           :confirmLoading="confirmLoading"
           :destroyOnClose="true"
           :closable="true"
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

      <a-form-model-item label="角色名称" prop="name" has-feedback>
        <a-input placeholder="角色名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="状态" prop="status" required>
        <a-radio-group name="radioGroup" v-model="formModel.status" :default-value="1">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-model-item>

    </a-form-model>

  </a-modal>
</template>

<script>

import {addRole, updateRole} from '@/api/role-api'

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

const defaultModel = {
  id: '',
  name: '',
  status: 1,
}

export default {
  name: 'PermissionRoleForm',
  components: {
  },
  props: {},
  data() {
    return {
      confirmLoading: false,
      mode: FORM_MODE_ADD,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      formModel: Object.assign({}, defaultModel),
      form: {},
      rules: {
        name: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
        status: [{required: true, message: '请选择用户状态', trigger: 'blur'}],
      }
    }
  },
  computed: {
    isEditMode() {
      return this.mode === FORM_MODE_EDIT
    }
  },
  methods: {
    open(formModel, mode = FORM_MODE_ADD) {
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
      }
      this.mode = mode
      this.visible = true
    },
    close() {
      this.confirmLoading = false
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
        const form = Object.assign({}, this.formModel)
        if (this.mode === FORM_MODE_ADD) {
          addRole(form)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          updateRole(form)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        }
      });
    },
  },
  created() {
  }
}
</script>
