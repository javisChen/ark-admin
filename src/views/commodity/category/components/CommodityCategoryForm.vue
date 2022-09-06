<template>

  <a-modal
    :width="1000"
    v-model="visible"
    :title="isEditMode ? '编辑分类' : '添加分类'"
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

      <a-form-model-item ref="name" label="分类名称" prop="name" has-feedback>
        <a-input placeholder="分类名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="上级分类" v-if="parent">
        <span>{{parent.name}}</span>
      </a-form-model-item>

      <a-form-model-item ref="isShow" label="是否显示" prop="isShow">
        <a-radio-group v-model="formModel.isShow" name="isShow">
          <a-radio v-for="item in isShowOptions"
                   :key="item.value"
                   :value="item.value">{{ item.desc }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item ref="isNav" label="是否导航" prop="isNav">
        <a-radio-group v-model="formModel.isNav" name="isNav">
          <a-radio v-for="item in isNavOptions"
                   :key="item.value"
                   :value="item.value">{{ item.desc }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item ref="attrTemplateId" label="商品属性模板" prop="isNav">
        <commodity-attr-template-select v-model="formModel.attrTemplateId"/>
      </a-form-model-item>

    </a-form-model>

  </a-modal>
</template>

<script>

import {create, update, getInfo} from '@/api/commodity/category-api';
import CommodityAttrTemplateSelect from "@/views/commodity/attr/attrTemplate/components/CommodityAttrTemplateSelect";


const defaultModel = {
  id: 0,
  name: "",
  isShow: 1,
  isNav: 1,
  sort: 0,
  pid: 0,
  attrTemplateId: undefined
}

const isShowOptions = [
  {value: 1, desc: '是'},
  {value: 0, desc: '否'}
]

const isNavOptions = [
  {value: 1, desc: '是'},
  {value: 0, desc: '否'}
]

const levelList = [
  {value: 0, desc: '一级分类'},
  {value: 1, desc: '二级分类'},
  {value: 2, desc: '三级分类'},
]

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

export default {
  name: 'CommodityAttrForm',
  components: {
    CommodityAttrTemplateSelect
  },
  data() {
    return {
      parent: undefined,
      levelList,
      valueList: [{value: ''}],
      isNavOptions,
      isShowOptions,
      fileList: [],
      confirmLoading: false,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 10},
      formModel: Object.assign({}, defaultModel),
      type: FORM_MODE_EDIT,
      form: {},
      rules: {
        name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
        inputType: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
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
    getParentInfo: async function (formModel) {
      if (formModel.pid && formModel.pid > 0) {
        const {data} = await getInfo({id: formModel.pid})
        this.parent = data
      }
    },
    open(type = FORM_MODE_ADD, formModel) {
      this.visible = true
      if (formModel) {
        this.getParentInfo(formModel);
        this.formModel = this.$cloneDeep(formModel)
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
      this.valueList = []
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
    },
  },
  created() {
  },
  beforeDestroy() {
    console.log('destroy')
  }
}
</script>
