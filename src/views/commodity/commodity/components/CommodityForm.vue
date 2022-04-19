<template>

  <div>
    <input type="checkbox" value="play game" id="bb">

    <a-card class="card" title="商品信息" :bordered="false">
      <commodity-base-info @onCategoryChange="onCategoryChange"/>
    </a-card>
    <a-card class="card" title="商品规格" :bordered="false">
      <commodity-sku :category-id="formModel.categoryId"/>
    </a-card>
  </div>

</template>

<script>

import CommodityBaseInfo from "@/views/commodity/commodity/components/CommodityBaseInfo";
import CommoditySku from "@/views/commodity/commodity/components/CommoditySku";
import KUpload from "@/components/KUpload/KUpload";

const defaultModel = {
  name: "",
  code: "",
  description: "",
  brandId: 0,
  categoryId: 0,
  mainPicture: "",
  shelfStatus: 0,
  verifyStatus: 0,
  showPrice: 0,
  unit: "",
  weight: 0,
  freightTemplateId: 0,
  pcDetailHtml: "",
  mobileDetailHtml: "",
  skuList: [
    {
      skuAttrList: [
        {
          attrId: 0,
          attrValue: ""
        }
      ],
      code: "",
      salesPrice: 0,
      costPrice: 0,
      stock: 0,
      warnStock: 0
    }
  ]
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
  name: 'CommodityForm',
  components: {
    KUpload,
    CommoditySku,
    CommodityBaseInfo
  },
  data() {
    return {
      hobbies:[],
      fileList: [],
      canManualAddOptions,
      inputTypeOptions,
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
    onCategoryChange(value) {
      this.formModel.categoryId = value
    },
    addValueListItem() {
      this.valueList.push({value: ''})
    },
    removeValueListItem(idx) {
      this.valueList.splice(idx, 1)
    },
    handleChange(value) {
      this.$emit('change', value)
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
  },
  beforeDestroy() {
    console.log('destroy')
  }
}
</script>
