<template>

  <div>
    <a-card class="card" title="商品信息" :bordered="false">
      <goods-base-info ref="baseInfo" @onCategoryChange="onCategoryChange" :form-model="formModel"/>
    </a-card>
    <a-card class="card" title="商品规格" :bordered="false">
      <goods-attr-spec ref="attrSpec" :category-id="formModel.categoryId" :form-model="formModel"/>
    </a-card>
    <a-card class="card" title="商品参数" :bordered="false">
      <goods-attr-param ref="attrParam" :category-id="formModel.categoryId" :form-model="formModel"/>
    </a-card>
    <a-card class="card" title="商品详情" :bordered="false">
      <goods-detail-info ref="detailInfo" :form-model="formModel"/>
    </a-card>
    <a-card class="card" title="" :bordered="false">
      <a-button type="primary" @click="submitForm">保存</a-button>
    </a-card>
  </div>
</template>

<script>

import GoodsBaseInfo from "@/views/product/goods/components/GoodsBaseInfo";
import GoodsAttrSpec from "@/views/product/goods/components/GoodsAttrSpec";
import GoodsAttrParam from "@/views/product/goods/components/GoodsAttrParam";
import GoodsDetailInfo from "@/views/product/goods/components/GoodsDetailInfo";
import {save, getInfo} from "@/api/product/goods-api";

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
  skus: [
    {
      specs: [
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
  name: 'GoodsForm',
  components: {
    GoodsDetailInfo,
    GoodsAttrSpec,
    GoodsAttrParam,
    GoodsBaseInfo
  },
  watch: {
    mode(newVal, OldVal) {
      this.mode = newVal
    }
  },
  props: {
  },
  data() {
    return {
      confirmLoading: false,
      formModel: Object.assign({}, defaultModel),
      mode: FORM_MODE_ADD,
    }
  },
  methods: {
    onCategoryChange(value) {
      this.formModel.categoryId = value
    },
    handleClose() {
      this.$emit('cancel', '')
    },
    afterSuccess: function ($form) {
      this.toggleConfirmLoading()
      this.$message.success('保存成功')
      this.$router.push({ name: 'goods' })
    },
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
    closeConfirmLoading() {
      this.confirmLoading = false
    },
    submitForm() {
      this.toggleConfirmLoading()
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
        id: baseInfo.id,
        name: baseInfo.name,
        code: baseInfo.code,
        description: baseInfo.description,
        brandId: baseInfo.brandId,
        categoryId: baseInfo.categoryId,
        pictures: baseInfo.pictures,
        showPrice: 0,
        unit: baseInfo.unit,
        weight: baseInfo.weight,
        freightTemplateId: 0,
        pcDetailHtml: detailInfo.pcDetailHtml,
        mobileDetailHtml: "",
        skus: attrSpec.skus,
        flushSku: attrSpec.flushSku,
        newAttrOptionList: attrSpec.newAttrOptions,
        params: attrParam
      }
      if (form.unit === 2) {
        form.weight *= 1000
      }
      save(form)
        .then(({data}) => this.afterSuccess())
        .catch(e => e)
        .finally(() => this.closeConfirmLoading())
    },
    async loadInfo(spuId) {
      try {
        const {data} = await getInfo({id: spuId});
        this.formModel = data
        this.mode = FORM_MODE_EDIT
      } catch (e) {
      }
    }
  },
  created() {
    if (this.$route.query.spuId) {
      const spuId = this.$route.query.spuId;
      this.loadInfo(spuId);
    }
  },
  beforeDestroy() {
  }
}
</script>
