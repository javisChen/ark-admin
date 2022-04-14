<template>

  <a-modal
    :width="1000"
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
        <commodity-attr-group-select v-if="formModel.attrTemplateId"
                                     :attrTemplateId="formModel.attrTemplateId"
                                     v-model="formModel.attrGroupId"></commodity-attr-group-select>
      </a-form-model-item>

      <a-form-model-item ref="inputType" label="录入方式" prop="inputType">
        <a-radio-group v-model="formModel.inputType" name="inputType">
          <a-radio v-for="item in inputTypeOptions"
                          :key="item.value"
                          :value="item.value">{{ item.desc }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item v-if="formModel.inputType === 2" label="可选值列表">
        <template v-for="(item, idx) in valueList">
          <div>
            <a-input v-model="item.value" style="width: 80%" placeholder="可选值列表"/>&nbsp;
            <k-tooltip-button v-if="idx === valueList.length - 1" title="添加" @click="addValueListItem" icon="plus"/>
            <k-tooltip-button v-if="idx !== valueList.length - 1" title="移除" @click="removeValueListItem(idx)" type="danger" icon="minus"/>
          </div>
        </template>
      </a-form-model-item>

      <a-form-model-item ref="canManualAdd" label="是否支持手动新增" prop="canManualAdd" has-feedback>
        <a-radio-group v-model="formModel.canManualAdd" name="canManualAdd">
          <a-radio v-for="item in canManualAddOptions"
                   :key="item.value"
                   :value="item.value">{{ item.desc }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

    </a-form-model>

  </a-modal>
</template>

<script>

import {create as createAttr, update as updateAttr} from '@/api/commodity/attr-api'
import CommodityAttrGroupSelect from "../../attrGroup/components/CommodityAttrGroupSelect";

const defaultModel = {
  id: undefined,
  name: "",
  inputType: 1,
  type: 0,
  sort: 0,
  attrGroupId: undefined,
  attrTemplateId: 0,
  canManualAdd: 0,
  values: [
    ""
  ],
}

const inputTypeOptions = [
  {value: 1, desc: '手工录入'},
  {value: 2, desc: '从选项列表选择'}
]
const canManualAddOptions = [
  {value: 0, desc: '否'},
  {value: 1, desc: '是'}
]

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

export default {
  name: 'CommodityAttrForm',
  components: {
    CommodityAttrGroupSelect
  },
  data() {
    return {
      valueList: [{value: ''}],
      canManualAddOptions,
      inputTypeOptions,
      fileList: [],
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
    addValueListItem() {
      this.valueList.push({value: ''})
    },
    removeValueListItem(idx) {
      this.valueList.splice(idx, 1)
    },
    handleChange(value) {
      this.$emit('change', value)
    },
    onSelectRouteChange(value, selectedOptions) {
      this.formModel.pid = value[value.length - 1]
    },
    open(type = FORM_MODE_ADD, formModel, attrTemplateId) {
      this.visible = true
      console.log(formModel)
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
        this.formModel = this.$cloneDeep(this.formModel)
        console.log(123213)
        this.valueList = this.formModel.values.map(item => ({value: item}))
        console.log(this.valueList)
      }
      this.formModel.attrTemplateId = attrTemplateId
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
        this.formModel.values = this.valueList.map(item => item.value)
        console.log(this.formModel)
        // this.closeConfirmLoading()
        // return
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
