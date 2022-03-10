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

      <a-form-model-item label="状态" prop="status" required>
        <a-upload
          list-type="picture-card"
          :file-list="[]"
          :customRequest="customRequest"
          @preview="handlePreview"
          @change="handleChange"
        >
          <a-icon type="plus"/>
          <div class="ant-upload-text">
            LOGO
          </div>
        </a-upload>
      </a-form-model-item>

    </a-form-model>

  </a-modal>
</template>

<script>

import {create, update} from '@/api/commodity/brand-api'
import {upload} from '@/api/file/file-api'

const defaultModel = {
  id: '',
  name: '',
  code: '',
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
  components: {},
  data() {
    return {
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
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    async customRequest(f) {
      console.log(f)
      const formData = new FormData();
      formData.append('file', f.file);
      try {
        const response = await upload(formData);
        this.$message.success('上传成功')
      } catch (e) {
        this.$message.error('上传失败')
      }

    },
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
