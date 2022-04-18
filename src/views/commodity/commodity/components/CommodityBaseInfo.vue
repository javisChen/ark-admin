<template>
  <a-form-model
    ref="form"
    :rules="rules"
    :model="formModel"
    :label-col="labelCol"
    :wrapper-col="wrapperCol">
    <a-form-model-item ref="categoryId" label="商品分类" prop="categoryId">
      <commodity-category-cascader v-model="formModel.categoryId"/>
    </a-form-model-item>

    <a-form-model-item ref="brandId" label="商品品牌" prop="brandId">
      <commodity-brand-select v-model="formModel.brandId"/>
    </a-form-model-item>

    <a-form-model-item ref="name" label="商品名称" prop="name" has-feedback>
      <a-input placeholder="商品名称" v-model="formModel.name"/>
    </a-form-model-item>

    <a-form-model-item ref="code" label="商品编号" prop="code" has-feedback>
      <a-input placeholder="商品编号" v-model="formModel.code"/>
    </a-form-model-item>

    <a-form-model-item ref="description" label="商品介绍" has-feedback>
      <a-textarea :rows="5"  placeholder="商品介绍" v-model="formModel.description"/>
    </a-form-model-item>

    <a-form-model-item ref="description" label="商品相册" has-feedback>
      <k-upload v-model="formModel.imageUrl"
                :limit="20"
                @change="(fileList) => formModel.imageUrl = fileList[0].url"/>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import CommodityBrandSelect from "@/views/commodity/brand/components/CommodityBrandSelect";
import CommodityCategoryCascader from "@/views/commodity/category/components/CommodityCategoryCascader";
import KUpload from "@/components/KUpload/KUpload";

export default {
  name: 'CommodityBaseInfo',
  components: {
    KUpload,
    CommodityCategoryCascader,
    CommodityBrandSelect
  },
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      labelCol: {span: 2},
      wrapperCol: {span: 8},
      rules: {
        name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        code: [{required: true, message: '请输入商品编码', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择品牌', trigger: 'blur'}],
        categoryId: [{required: true, message: '请选择类目', trigger: 'blur'}],
      }
    }
  },
  created() {
    console.log('created')
  }
}
</script>