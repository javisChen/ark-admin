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

    <div style="width: 80%" v-if="showSkuTable">
      <div style="margin-bottom: 10px">
        <a-button type="primary" @click="flushSKu">刷新SKU</a-button>
      </div>
      <div>
        <a-table
          bordered
          :loading="skuTableLoading"
          :width="500"
          :size="'small'"
          :pagination="false"
          :data-source="skuTableData"
          :row-key="rowKey"
          :columns="columns"/>
      </div>
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
    align: 'center',
    dataIndex: 'code',
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

/**
 * 笛卡尔积实现，计算SKU
 * @param array
 * @returns {*|*[]}
 */
function calcDescartes(array) {
  if (array.length < 2) {
    return array[0] || [];
  }
  return array.reduce((total, currentValue) => {
    let res = [];
    total.forEach(t => {
      currentValue.forEach(cv => {
        if (t instanceof Array)
          res.push([...t, cv]);
        else
          res.push([t, cv]);
      })
    })
    return res;
  })
}

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
      skuTableLoading: false,
      skuTableData: [],
      checkedMap: new Map(),
      showSkuTable: false,
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
      this.skuTableLoading = true
      try {
        console.log(this.checkedMap);
        /*
            [{
              code: '',
              stock: 0,
              warnStock : 0,
              costPrice: 0,
              salesPrice: 0
            }]
           */
        this.skuTableData = []
        const attrTable = []
        this.checkedMap.forEach((value, key) => {
          attrTable.push(value)
        })
        const combineTable = calcDescartes(attrTable)
        console.log('所有SKU组合', combineTable)
        combineTable.forEach(item => {
          const obj = {
            code: '',
            stock: 0,
            warnStock: 0,
            costPrice: 0,
            salesPrice: 0,
          };
          item.forEach(item => {
            obj[item.attrName] = item.attrValueName
          })
          this.skuTableData.push(obj)
        })
        console.log(this.skuTableData)
      } finally {
        this.skuTableLoading = false
      }
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
        if (!data.records || data.records.length === 0) {
          return
        }
        this.showSkuTable = true
        this.list = data.records
        const [...cols] = defaultColumns
        this.list.forEach(attrItem => {
          cols.unshift({
            title: attrItem.name,
            align: 'center',
            width: columnWidth,
            dataIndex: attrItem.name
          })
          if (attrItem.inputType == 2) {
            attrItem.values.forEach(attrValueItem => {
              attrValueItem.label = attrValueItem.value
              attrValueItem.value = `${attrItem.id}-${attrItem.name}-${attrValueItem.id}-${attrValueItem.value}`
            })
          } else {
            this.$set(attrItem, 'values', [])
          }
          this.$set(attrItem, 'checked', false)
        })
        this.columns = cols
      } catch (e) {
        console.log('获取属性异常', e)
      }
    },
    /**
     * 设置已选属性值的Map
     * @param attr 属性
     * @param value 属性值
     * @param action add、delete
     */
    setCheckedMap: function (attr, value, action) {
      console.log(`${attr.name} ${action}`, value)
      if (action === 'add') {
        if (this.checkedMap.size < 1 || !this.checkedMap.has(attr.id)) {
          this.checkedMap.set(attr.id, [value])
        } else {
          this.checkedMap.get(attr.id).push(value)
        }
      } else {
        if (this.checkedMap.has(attr.id)) {
          const valueList = this.checkedMap.get(attr.id)
          valueList.splice(valueList.indexOf(value), 1)
        }
      }
      console.log(`checkMap change`, this.checkedMap)
    },
    onValueChange(attrValue, attr) {
      const checkedMap = this.checkedMap
      if (checkedMap.has(attr.id)) {
        checkedMap.delete(attr.id)
      }
      attrValue.forEach(item => {
        const s = item.split('-')
        this.setCheckedMap(attr, this.assembleSku(s[0], s[1], s[2], s[3]), 'add');
      })
    },
    assembleSku(attrId, attrName, attrValueId, attrValueName) {
      return {
        attrId,
        attrName,
        attrValueId,
        attrValueName
      };
    },
    checkedValue(e, attrValue, attr) {
      const action = e.target.checked ? 'add' : 'delete';
      this.setCheckedMap(attr, this.assembleSku(attr.id, attr.name, attrValue.value, attrValue.label), action);
    },
  }
}
</script>