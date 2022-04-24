<template>

  <div>
    <a-card class="card" title="商品信息" :bordered="false">
      <commodity-base-info ref="baseInfo" @onCategoryChange="onCategoryChange" :form-model="formModel"/>
    </a-card>
    <a-card class="card" title="商品规格" :bordered="false">
      <commodity-attr-spec ref="attrSpec" :category-id="formModel.categoryId" :form-model="formModel"/>
    </a-card>
    <a-card class="card" title="商品参数" :bordered="false">
      <commodity-attr-param ref="attrParam" :category-id="formModel.categoryId" :form-model="formModel"/>
    </a-card>
    <a-card class="card" title="商品详情" :bordered="false">
      <commodity-detail-info ref="detailInfo" :form-model="formModel"/>
    </a-card>
    <a-card class="card" title="" :bordered="false">
      <a-button type="primary" @click="submitForm">保存</a-button>
    </a-card>
  </div>
</template>

<script>

import CommodityBaseInfo from "@/views/commodity/commodity/components/CommodityBaseInfo";
import CommodityAttrSpec from "@/views/commodity/commodity/components/CommodityAttrSpec";
import CommodityAttrParam from "@/views/commodity/commodity/components/CommodityAttrParam";
import CommodityDetailInfo from "@/views/commodity/commodity/components/CommodityDetailInfo";
import {create, update} from "@/api/commodity/commodity-api";

const defaultModel = {
  name: "",
  code: "",
  description: "",
  brandId: undefined,
  categoryId: undefined,
  showPrice: 0,
  unit: "",
  weight: 0,
  freightTemplateId: undefined,
  pcDetailHtml: "",
  mobileDetailHtml: "",
  skuList: [
    {
      specList: [
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

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

export default {
  name: 'CommodityForm',
  components: {
    CommodityDetailInfo,
    CommodityAttrSpec,
    CommodityAttrParam,
    CommodityBaseInfo
  },
  watch: {
    mode(newVal, OldVal) {
      this.mode = newVal
    }
  },
  props: {
    mode: {
      type: String,
      default: 'add'
    },
  },
  data() {
    return {
      confirmLoading: false,
      formModel: Object.assign({}, defaultModel),
      type: FORM_MODE_EDIT,
    }
  },
  methods: {
    onCategoryChange(value) {
      this.formModel.categoryId = value
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
      // 获取商品基础数据
      const baseInfo = this.$refs['baseInfo'].getData();
      console.log('baseInfo', baseInfo)
      const attrSpec = this.$refs['attrSpec'].getData();
      console.log('attrSpec', attrSpec)
      const attrParam = this.$refs['attrParam'].getData();
      console.log('attrParam', attrParam)
      const detailInfo = this.$refs['detailInfo'].getData();
      console.log('detailInfo', detailInfo)

      const form = {
        name: baseInfo.name,
        code: baseInfo.code,
        description: baseInfo.description,
        brandId: baseInfo.brandId,
        categoryId: baseInfo.categoryId,
        picList: baseInfo.picList,
        showPrice: 0,
        unit: baseInfo.unit,
        weight: baseInfo.weight,
        freightTemplateId: 0,
        pcDetailHtml: detailInfo.pcDetailHtml,
        mobileDetailHtml: "",
        skuList: attrSpec,
        paramList: attrParam
      }
      console.log('商品表单', form)
      return
      if (this.type === FORM_MODE_ADD) {
        create(form)
          .then(({data}) => this.afterSuccess())
          .catch(e => e)
          .finally(() => this.closeConfirmLoading())
      } else {
        update(form)
          .then(({data}) => this.afterSuccess())
          .catch(e => e)
          .finally(() => this.closeConfirmLoading())
      }
    },
  },
  created() {
  },
  beforeDestroy() {
  }
}
</script>
