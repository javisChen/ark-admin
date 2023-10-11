<template>
  <a-form-model
    class="form-model"
    ref="form"
    :rules="rules"
    :model="internalModel"
    :label-col="labelCol"
    :wrapper-col="wrapperCol">
    <a-form-model-item class="model-item" ref="categoryId" label="商品分类" prop="categoryId">
      <commodity-category-cascader v-model="internalModel.categoryId"
                                   :path="internalModel.categoryLevelPath"
                                   @change="onCategoryChange"/>
    </a-form-model-item>

    <a-form-model-item class="model-item" ref="brandId" label="商品品牌" prop="brandId">
      <commodity-brand-select v-model="internalModel.brandId"/>
    </a-form-model-item>

    <a-form-model-item class="model-item" ref="name" label="商品名称" prop="name" has-feedback>
      <a-input placeholder="商品名称" v-model="internalModel.name"/>
    </a-form-model-item>

    <a-form-model-item class="model-item" ref="code" label="商品编号" prop="code" has-feedback>
      <a-input placeholder="商品编号" v-model="internalModel.code"/>
    </a-form-model-item>

    <a-form-model-item class="model-item" ref="unit" label="单位" prop="unit" has-feedback>
      <a-select v-model="internalModel.unit" :allowClear="true">
        <a-select-option :key="1" :value="1">克</a-select-option>
        <a-select-option :key="2" :value="2">千克</a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item class="model-item" ref="weight" label="重量" prop="weight" has-feedback>
      <a-input placeholder="重量" v-model="internalModel.weight"/>
    </a-form-model-item>

    <a-form-model-item class="model-item" ref="description" label="商品介绍" has-feedback>
      <a-textarea :rows="5" placeholder="商品介绍" v-model="internalModel.description"/>
    </a-form-model-item>

    <a-form-model-item class="model-item" ref="description" label="商品相册" has-feedback>
      <k-upload :limit="20" v-model="internalModel.picList" @change="onUploadSuccess"/>
    </a-form-model-item>
  </a-form-model>
</template>
<script>

import CommodityBrandSelect from "@/views/commodity/brand/components/CommodityBrandSelect";
import CommodityCategoryCascader from "@/views/commodity/category/components/CommodityCategoryCascader";
import KUpload from "@/components/KUpload/KUpload";
import cloneDeep from "lodash.clonedeep";

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
        return {
          unit: undefined,
        }
      }
    }
  },
  watch: {
    formModel(newV, oldV) {
      this.internalModel = newV
      if (this.internalModel.unit === 2) {
        this.internalModel.weight /= 1000
      }
    },
  },
  data() {
    return {
      internalModel: cloneDeep(this.formModel),
      labelCol: {span: 2},
      wrapperCol: {span: 8},
      rules: {
        name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        code: [{required: true, message: '请输入商品编码', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择品牌', trigger: 'blur'}],
        categoryId: [{required: true, message: '请选择类目', trigger: 'blur'}],
        unit: [{required: true, message: '请选择单位', trigger: 'blur'}],
        weight: [{required: true, message: '请输入重量', trigger: 'blur'}],
      }
    }
  },
  created() {

  },
  methods: {
    onUploadSuccess(fileList) {
      this.internalModel.mainPicture = fileList[0].url
      this.internalModel.picList = fileList.map(item => item.url)
    },
    onCategoryChange(value) {
      this.$emit("onCategoryChange", value)
    },
    getData() {
      return this.internalModel;
    }
  }
}
</script>
<style scoped>
.model-item {
  /*margin-bottom: 15px*/
}
</style>