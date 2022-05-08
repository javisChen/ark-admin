<template>

  <a-modal
    v-model="visible"
    :title="isEditMode ? '编辑品牌' : '新建品牌'"
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

      <a-form-model-item ref="name" label="品牌名称" prop="name" has-feedback>
        <a-input placeholder="品牌名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="品牌首字母" prop="code" has-feedback>
        <a-input placeholder="letter" v-model="formModel.letter"/>
      </a-form-model-item>

      <a-form-model-item label="LOGO" prop="imageUrl" required>
        <k-upload v-model="fileList"
                   :limit="1"
                   @change="(fileList) => formModel.imageUrl = fileList[0].url"/>
      </a-form-model-item>
    </a-form-model>

  </a-modal>
</template>

<script>

import {create, update} from '@/api/commodity/brand-api'
import KUpload from "@/components/KUpload/KUpload";

const defaultModel = {
  id: '',
  name: '',
  code: '',
  imageUrl: ''
}

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  name: 'CommodityBrandForm',
  components: {KUpload},
  data() {
    return {
      fileList: [],
      confirmLoading: false,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 10},
      formModel: Object.assign({}, defaultModel),
      type: FORM_MODE_EDIT,
      form: {},
      rules: {
        name: [{required: true, message: '请输入品牌名称', trigger: 'blur'}],
        letter: [{required: true, message: '请输入品牌首字母', trigger: 'blur'}],
        imageUrl: [{required: true, message: '请上传品牌LOGO', trigger: 'blur'}]
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
    open(formModel, type = FORM_MODE_ADD) {
      this.visible = true
      if (formModel) {
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
          create(this.formModel)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          update(this.formModel)
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
