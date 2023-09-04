<template>

  <a-modal style="width: 1000px"
           :centered="true"
           v-model="visible"
           :title="formTitle"
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

      <a-form-model-item label="所属应用" prop="method">
        <a-select
          v-model="formModel.applicationId"
          :allowClear="true"
          show-search
          placeholder="所属应用"
          option-filter-prop="children"
          :filter-option="filterOption">
          <a-select-option v-for="(value, index) in applicationsOptions"
                           :key="index" :value="value.id">
            {{ value.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="分类名称" prop="name" has-feedback>
        <a-input placeholder="分类名称" v-model="formModel.name"/>
      </a-form-model-item>

    </a-form-model>
  </a-modal>
</template>

<script>

import {addApiCategory, updateApiCategory} from '@/api/iam/api-category-api'
import {getApplications} from "@/api/iam/application-api";

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

const defaultModel = {
  id: '',
  name: '',
  applicationId: 1,
}

export default {
  name: 'PermissionApiCategoryForm',
  components: {},
  props: {
  },
  watch: {
    applicationId(val) {
      this.formModel.applicationId = this.$cloneDeep(val)
    }
  },
  data() {
    return {
      applicationsOptions: [],
      confirmLoading: false,
      mode: FORM_MODE_ADD,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      formModel: {...defaultModel},
      form: {},
      rules: {
        name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
        applicationId: [{required: true, message: '请选择所属应用', trigger: 'blur'}],
      }
    }
  },
  created() {
    this.initApplications()
  },
  computed: {
  },
  methods: {
    formTitle() {
      let title = '接口分类';
      switch (this.mode) {
        case FORM_MODE_EDIT:
          title = '编辑' + title;
          break;
        case FORM_MODE_ADD:
          title = '新建' + title;
          break;
      }
      return title;
    },
    initApplications() {
      getApplications({})
      .then(({data}) => {
        this.applicationsOptions = data
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
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
      this.formModel = {...defaultModel}
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function ($form) {
      this.$emit('success', '')
      this.close()
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
        const form = {...this.formModel}
        this.toggleConfirmLoading()
        if (this.mode === FORM_MODE_ADD) {
          addApiCategory(form)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          updateApiCategory(form)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        }
      });
    },
  }
}
</script>
