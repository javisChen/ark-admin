<template>
  <div>
    <a-form-model
      ref="form"
      layout="horizontal"
      :model="internalModel"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-model-item style="margin-bottom: 10px" v-for="(attrItem, attrListIdx) in attrList" :label="attrItem.name">
        <div v-if="attrItem.inputType == 1">
          <div v-if="attrItem.optionList.length > 0" class="ant-checkbox-group">
            <label v-for="(attrOption, attrOptionLisIdx) in attrItem.optionList">
              <a-checkbox @change="checkedValue($event, attrOption, attrItem)">{{ attrOption.label }}</a-checkbox>
              <a title="删除" @click.prevent="removeValueListItem(attrItem, attrOptionLisIdx)">删除</a>&nbsp;
            </label>
          </div>
          <div>
            <a-input style="width: 20%" :placeholder="attrItem.name" v-model="attrItem.manualAttrValue"/>&nbsp;
            <k-tooltip-button title="添加" @click="addAttrValueListItem(attrItem)" icon="plus"/>
          </div>
        </div>
        <div v-else-if="attrItem.inputType == 2">
          <a-checkbox-group :options="attrItem.optionList" @change="onValueChange($event, attrItem)"/>
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
          :columns="columns">

          <template v-for="col in editableColumns"
                    :slot="col" slot-scope="text, record, idx">
            <template v-if="editSkuTableData[idx]">
              <a-input
                v-model="editSkuTableData[idx][col]"
                style="margin: -5px 0"
              />
            </template>
            <template v-else>
              <span v-if="['costPrice', 'salesPrice'].includes(col)">
                {{ record[col] | SumFormat }}
              </span>
              <span v-else>
                {{ record[col] }}
              </span>
            </template>
          </template>

          <template slot="action" slot-scope="text, record, idx">
            <div class="editable-row-operations">
              <span v-if="editSkuTableData[idx]">
                <a @click="saveSkuColumn(idx, record)">保存</a>
                <a @click="cancelSkuColumn(idx, record)">取消</a>
              </span>
              <span v-else>
                <a @click="editSkuColumn(idx, record)">编辑</a>
              </span>
            </div>
          </template>

        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import {yuanToFen, fenToYuan} from '@/components/_util/util';
import {getPageList as getAttrList} from '@/api/commodity/attr-api'
import cloneDeep from "lodash.clonedeep";

const columnWidth = 10;
// 可编辑列
const editableColumns = ['code', 'salesPrice', 'costPrice', 'stock', 'warnStock']
const defaultColumns = [
  {
    title: '销售价格',
    align: 'center',
    dataIndex: 'salesPrice',
    scopedSlots: {customRender: 'salesPrice'},
    width: columnWidth
  },
  {
    title: '成本价格',
    align: 'center',
    dataIndex: 'costPrice',
    scopedSlots: {customRender: 'costPrice'},
    width: columnWidth
  },
  {
    title: '库存',
    align: 'center',
    dataIndex: 'stock',
    scopedSlots: {customRender: 'stock'},
    width: columnWidth
  },
  {
    title: '库存预警值',
    align: 'center',
    dataIndex: 'warnStock',
    width: columnWidth,
    scopedSlots: {
      customRender: 'warnStock'
    },
  },
  {
    title: 'SKU编号',
    align: 'center',
    dataIndex: 'code',
    scopedSlots: {
      customRender: 'code'
    },
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
  name: 'CommodityAttrSpec',
  components: {},
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
      this.internalModel.categoryId = newV
      this.loadAttrList()
    },
    formModel(newV, oldV) {
      this.internalModel = newV
      this.dynamicBuildSkuTableColumns(this.internalModel.skuList[0].specList);
      this.initSkuTable();
      this.internalModel.skuList[0].specList.forEach(item => {
        const {attrId, attrName, attrValue} = item
        // this.attrValueOnChange(this.assembleSku(attrId, attrName, attrValue), 'add');
      })
    },
  },
  data() {
    return {
      flushSku: false,
      newAttrOptions: new Map(), // 新增的属性项选
      internalModel: cloneDeep(this.formModel),
      editableColumns, // 可编辑的列
      editSkuTableData: [], // 处于编辑模式的sku数据
      skuTableData: [], // 可提交的sku数据
      checkedAttrValueMap: new Map(), // 已选中的属性值
      skuTableLoading: false,
      showSkuTable: false,
      columns: defaultColumns,
      labelCol: {span: 2},
      wrapperCol: {span: 20},
      attrList: [],
    }
  },
  created() {
  },
  methods: {
    initSkuTable () {
      this.skuTableData = this.internalModel.skuList
      this.skuTableData.forEach(item => {
        item.specList.forEach(s => {
          item[s.attrId] = [s.attrValue]
        })
        item.salesPrice = fenToYuan(item.salesPrice)
        item.costPrice = fenToYuan(item.costPrice)
      })
      this.showSkuTable = true
    },
    /**
     * 动态构建SKU表格的表头
     * @param attrList
     */
    dynamicBuildSkuTableColumns(attrList) {
      const [...cols] = defaultColumns
      attrList.forEach(attrItem => {
        cols.unshift({
          title: attrItem.name,
          // title: attrItem.attrName,
          align: 'center',
          width: columnWidth,
          // dataIndex: attrItem.attrId
          dataIndex: attrItem.id
        })
      })
      this.columns = cols
    },
    onSkuColumnChange(e, col, idx, record) {
      // console.log(`SKU[${col}] change `, e.target.value)
    },
    saveSkuColumn(idx) {
      this.$set(this.skuTableData, idx, this.editSkuTableData[idx])
      this.$set(this.editSkuTableData, idx, undefined)
      console.log(`保存列`, this.skuTableData)
    },
    cancelSkuColumn(idx, record) {
      this.$set(this.editSkuTableData, idx, undefined)
    },
    editSkuColumn(idx, record) {
      this.$set(this.editSkuTableData, idx, this.$cloneDeep(this.skuTableData[idx]))
    },
    initTableData() {
      this.skuTableData = []
      this.editSkuTableData = []
    },
    flushSKu() {
      this.skuTableLoading = true
      try {
        this.initTableData();
        const attrTable = []
        this.checkedAttrValueMap.forEach((value, key) => attrTable.push(value))
        const combineTable = calcDescartes(attrTable)
        console.log('所有SKU组合', combineTable)
        combineTable.forEach(item => {
          const obj = {
            code: '',
            stock: 0,
            warnStock: 0,
            costPrice: 0,
            salesPrice: 0,
            _key: uuidv4()
          };
          item.forEach(item => {
            obj[item.attrId] = item.attrValue
            if (!obj.specList) {
              obj.specList = [{...item}]
            } else {
              obj.specList.push({...item})
            }
          })
          this.skuTableData.push(obj)
          this.editSkuTableData.push(obj)
        })
        this.flushSku = true
        console.log('SKU TABLE刷新完成', this.skuTableData)
      } finally {
        this.skuTableLoading = false
      }
    },
    rowKey(record, index) {
      return index
    },
    addAttrValueListItem(attrItem) {
      const manualAttrValue = attrItem.manualAttrValue
      const attrId = attrItem.id;
      attrItem.optionList.push({label: manualAttrValue, value: manualAttrValue})
      if (this.newAttrOptions.size < 1 || !this.newAttrOptions.has(attrId)) {
        this.newAttrOptions.set(attrId, [manualAttrValue])
      } else {
        this.newAttrOptions.get(attrId).push(manualAttrValue)
      }
      attrItem.manualAttrValue = ''
    },
    removeValueListItem(item, idx) {
      item.optionList.splice(idx, 1)
    },
    async loadAttrList() {
      try {
        const {data} = await getAttrList({
          current: 1,
          size: 30,
          categoryId: this.internalModel.categoryId,
          type: 1,
          withOptions: true,
          spuId: this.formModel.id
        })
        if (!data.records || data.records.length === 0) {
          return
        }
        this.showSkuTable = true
        this.attrList = data.records
        this.attrList.forEach(attrItem => {
          if (!attrItem.optionList) {
            this.$set(attrItem, 'optionList', [])
          } else {
            attrItem.optionList.forEach(attrOption => {
              attrOption.label = attrOption.value
              attrOption.value = `${attrItem.id}-${attrItem.name}-${attrOption.value}`
            })
          }
          this.$set(attrItem, 'checked', false)
        })
        this.dynamicBuildSkuTableColumns(this.attrList)
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
    attrValueOnChange(value, action) {
      const {attrId, attrName} = value;
      console.log(`${attrName} ${action}`, value)
      if (action === 'add') {
        if (this.checkedAttrValueMap.size < 1 || !this.checkedAttrValueMap.has(attrId)) {
          this.checkedAttrValueMap.set(attrId, [value])
        } else {
          this.checkedAttrValueMap.get(attrId).push(value)
        }
      } else {
        if (this.checkedAttrValueMap.has(attrId)) {
          const valueList = this.checkedAttrValueMap.get(attrId)
          valueList.splice(valueList.indexOf(value), 1)
        }
      }
    },
    onValueChange(attrValue, attr) {
      const checkedAttrValueMap = this.checkedAttrValueMap
      if (checkedAttrValueMap.has(attr.id)) {
        checkedAttrValueMap.delete(attr.id)
      }
      attrValue.forEach(item => {
        const s = item.split('-')
        this.attrValueOnChange(this.assembleSku(s[0], s[1], s[2]), 'add');
      })
    },
    assembleSku(attrId, attrName, attrValue) {
      return {
        attrId,
        attrName,
        attrValue
      };
    },
    checkedValue(e, attrOption, attr) {
      const action = e.target.checked ? 'add' : 'delete';
      this.attrValueOnChange(this.assembleSku(attr.id, attr.name, attrOption.label), action);
    },
    getNewAttrOptions() {
      const list = []
      this.newAttrOptions.forEach((value, key) => {
        list.push({attrId: key, valueList: value})
      })
      return list;
    },
    getData() {
      const skuList = []
      this.skuTableData.forEach(item => {
        const skuObj = {
          id: item.id,
          code: item.code,
          salesPrice: yuanToFen(item.salesPrice),
          costPrice: yuanToFen(item.costPrice),
          stock: item.stock,
          warnStock: item.warnStock,
          specList: [...item.specList],
        };
        skuList.push(skuObj)
      })
      console.log(skuList)
      return {
        newAttrOptions: this.getNewAttrOptions(),
        skuList,
        flushSku: this.flushSku
      }
    }
  }
}
</script>
<style scoped>

.editable-row-operations a {
  margin-right: 8px;
}

</style>