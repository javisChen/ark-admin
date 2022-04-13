<template>

  <a-modal
    v-model="visible"
    :title="isEditMode ? '编辑属性' : '添加属性'"
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

      <a-form-model-item ref="name" label="属性名称" prop="name" has-feedback>
        <a-input placeholder="属性名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item ref="attrGroupId" label="属性组" prop="attrGroupId">
        <Commodity-Attr-Group-Select v-if="attrTemplateId" :attrTemplateId="attrTemplateId" v-model="formModel.attrGroupId"></Commodity-Attr-Group-Select>
      </a-form-model-item>

      <a-form-model-item ref="inputType" label="录入方式" prop="inputType" has-feedback>
        <a-input placeholder="录入方式" v-model="formModel.inputType"/>
      </a-form-model-item>

      <a-form-model-item label="可选值列表" has-feedback>
        <a-input placeholder="可选值列表"/>
      </a-form-model-item>

      <a-form-model-item ref="canManualAdd" label="是否支持手动新增" prop="canManualAdd" has-feedback>
        <a-input placeholder="是否支持手动新增" v-model="formModel.canManualAdd"/>
      </a-form-model-item>

    </a-form-model>

  </a-modal>
</template>

<script>

import {getPageList as getAttrGroupPageList} from '@/api/commodity/attr-group-api'
import {create as createAttr, update as updateAttr} from '@/api/commodity/attr-api'
import CommodityAttrGroupSelect from "../../attrGroup/components/CommodityAttrGroupSelect";

const defaultModel = {
  id: 0,
  name: "",
  inputType: 0,
  type: 0,
  sort: 0,
  attrGroupId: undefined,
  attrTemplateId: 0,
  canManualAdd: 0,
  values: [
    ""
  ],
}

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

export default {
  name: 'CommodityAttrForm',
  components: {
    CommodityAttrGroupSelect
  },
  data() {
    return {
      fileList: [],
      attrTemplateId: undefined,
      confirmLoading: false,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 10},
      formModel: Object.assign({}, defaultModel),
      type: FORM_MODE_EDIT,
      form: {},
      rules: {
        name: [{required: true, message: '请输入模板名称', trigger: 'blur'}],
        inputType: [{required: true, message: '请输入模板名称', trigger: 'blur'}],
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
    onSelectRouteChange(value, selectedOptions) {
      this.formModel.pid = value[value.length - 1]
    },
    open(formModel, attrTemplateId, type = FORM_MODE_ADD) {
      this.visible = true
      this.attrTemplateId = attrTemplateId
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
        console.log(this.formModel)
        this.closeConfirmLoading()
        return
        if (this.type === FORM_MODE_ADD) {
          createAttr(this.formModel)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          updateAttr(this.formModel)
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
    },
  },
  created() {
  }
}
</script>
