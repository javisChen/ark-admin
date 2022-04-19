<template>
  <div>
    <a-form-model
      ref="form"
      layout="horizontal"
      :rules="rules"
      :model="formModel"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-model-item style="margin-bottom: 10px" v-for="(attrItem, attrListIdx) in list" :label="attrItem.name">
        <div v-if="attrItem.inputType == 1">
          <div v-if="attrItem.values.length > 0" class="ant-checkbox-group">
            <label v-for="(attrValueItem, attrValueListIdx) in attrItem.values">
              <a-checkbox @change="checkedValue($event, attrValueItem, attrItem)">{{ attrValueItem.label }}</a-checkbox>
              <a title="删除" @click.prevent="removeValueListItem(attrItem, attrValueListIdx)">删除</a>&nbsp;
            </label>
          </div>
          <div>
            <a-input style="width: 20%" :placeholder="attrItem.name" v-model="manualAttrValue"/>&nbsp;
            <k-tooltip-button title="添加" @click="addValueListItem(attrItem)" icon="plus"/>
          </div>
        </div>
        <div v-else-if="attrItem.inputType == 2">
          <a-checkbox-group :options="attrItem.values" @change="onValueChange($event, attrItem)"/>
        </div>
      </a-form-model-item>
    </a-form-model>

    <a-button @click="flushSKu">刷新SKU</a-button>
    <div style="width: 80%" v-if="showSkuTable">
      <a-table
        bordered
        :width="500"
        :size="'small'"
        :indent-size="15"
        :row-key="rowKey"
        :columns="columns"/>
    </div>
  </div>
</template>
<script>
import CommodityBrandSelect from "@/views/commodity/brand/components/CommodityBrandSelect";
import CommodityCategoryCascader from "@/views/commodity/category/components/CommodityCategoryCascader";
import KUpload from "@/components/KUpload/KUpload";
import {getInfo, getPageList as getAttrList} from '@/api/commodity/attr-api'

const columnWidth = 10;
const defaultColumns = [
  {
    title: '销售价格',
    align: 'center',
    dataIndex: 'salesPrice',
    width: columnWidth
  },
  {
    title: '成本价格',
    align: 'center',
    dataIndex: 'costPrice',
    width: columnWidth
  },
  {
    title: '库存',
    align: 'center',
    dataIndex: 'stock',
    scopedSlots: {customRender: 'shelfStatus'},
    width: columnWidth
  },
  {
    title: '库存预警值',
    align: 'center',
    dataIndex: 'warnStock',
    width: columnWidth
  },
  {
    title: 'SKU编号',
    align: 'code',
    scopedSlots: {customRender: 'setting'},
    width: columnWidth
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: {customRender: 'action'},
    width: columnWidth
  },
]

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
      checkedMap: new Map(),
      showSkuTable: true,
      columns: defaultColumns,
      manualAttrValue: '',
      labelCol: {span: 2},
      wrapperCol: {span: 20},
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
    flushSKu() {
      this.checkedMap.forEach((key, value) => {

      })
      console.log(this.checkedMap);
    },
    rowKey(record) {
      return record.id
    },
    addValueListItem(item) {
      item.values.push({label: this.manualAttrValue, value: Math.ceil(Math.random() * 100)});
      this.manualAttrValue = ''
    },
    removeValueListItem(item, idx) {
      item.values.splice(idx, 1)
    },
    async loadAttrList() {
      try {
        const {data} = await getAttrList({
          current: 1,
          size: 30,
          categoryId: this.formModel.categoryId,
          queryValues: true
        })
        this.list = data.records
        const [...cols] = defaultColumns
        this.list.forEach(item => {
          cols.unshift({
            title: item.name,
            align: 'center',
            width: columnWidth
          })
          if (item.inputType == 2) {
            item.values.forEach(item => {
              item.label = item.value
              item.value = `${item.id}-${item.label}`
            })
          } else {
            this.$set(item, 'values', [])
          }
          this.$set(item, 'checked', false)
        })
        this.columns = cols
      } catch (e) {
        console.log('获取属性异常', e)
      }
    },
    setCheckedMap: function (attr, attrValue) {
      console.log(`[${attr.name}]选项变更了, ${attrValue}`)
      if (this.checkedMap.size < 1) {
        this.checkedMap.set(attr.id, [attrValue])
      } else {
        if (this.checkedMap.has(attr.id)) {
          this.checkedMap.get(attr.id).push(attrValue.id);
        } else {
          this.checkedMap.set(attr.id, [attrValue])
        }
      }
    },
    onValueChange(attrValue, attr) {
      this.setCheckedMap(attr, attrValue);
    },
    checkedValue(e, attrValue, attr) {
      this.setCheckedMap(attr, `${attrValue.value}-${attrValue.label}`);
    },
    onCategoryChange(value) {
      this.$emit("onCategoryChange", value)
    }
  }
}
</script>