<template>
  <a-form-model
    ref="form"
    :rules="rules"
    :model="formModel"
    :label-col="labelCol"
    :wrapper-col="wrapperCol">

    <a-form-model-item v-for="item in list" :label="item.name" >
      <div v-if="item.inputType == 1">
        <a-input :placeholder="item.name" v-model="formModel.code"/>
      </div>
      <div v-else-if="item.inputType == 2">
        <a-checkbox-group :options="item.values" @change="onValueChange" />
      </div>
    </a-form-model-item>

  </a-form-model>
</template>
<script>
import CommodityBrandSelect from "@/views/commodity/brand/components/CommodityBrandSelect";
import CommodityCategoryCascader from "@/views/commodity/category/components/CommodityCategoryCascader";
import KUpload from "@/components/KUpload/KUpload";
import {getInfo, getPageList as getAttrList} from '@/api/commodity/attr-api'

export default {
  name: 'CommoditySku',
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
    },
    categoryId: {
      type: [Number, String],
      default: undefined
    }
  },
  watch: {
    categoryId(newV, oldV) {
      this.formModel.categoryId = newV
      this.loadAttrList()
    }
  },
  data() {
    return {
      labelCol: {span: 2},
      wrapperCol: {span: 8},
      list: [],
      rules: {
        name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        code: [{required: true, message: '请输入商品编码', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择品牌', trigger: 'blur'}],
        categoryId: [{required: true, message: '请选择类目', trigger: 'blur'}],
      }
    }
  },
  created() {

  },
  methods: {
    async loadAttrList() {
      try {
        const {data} = await getAttrList({
          current: 1,
          size: 30,
          categoryId: this.formModel.categoryId,
          queryValues: true
        })
        this.list = data.records
        this.list.forEach(item => {
          if (item.inputType == 2) {
            item.values.forEach( item => {
              item.label = item.value
              item.value = item.id
            })
          }
        })
        console.log(data)
      } catch (e) {
        console.log('获取属性异常', e)
      }

    },
    onValueChange(v) {
      console.log(v)
    },
    onCategoryChange(value) {
      this.$emit("onCategoryChange", value)
    }
  }
}
</script>