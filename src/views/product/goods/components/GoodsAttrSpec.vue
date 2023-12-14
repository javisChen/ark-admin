<template>
  <div>
    <a-form-model
      ref="form"
      layout="horizontal"
      :model="internalModel"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <!-- 遍历规格属性 -->
      <a-form-model-item style="margin-bottom: 10px"
                         v-for="(attrItem, attrListIdx) in attrList"
                         :key="attrListIdx"
                         :label="attrItem.name">
        <!-- 手工录入 -->
        <div v-if="attrItem.inputType === 1">
          <div v-if="attrItem.optionList.length > 0" class="ant-checkbox-group">
            <!-- 遍历规格属性可选参数 -->
            <label v-for="(attrOption, attrOptionLisIdx) in attrItem.optionList">
              <a-checkbox @change="onAttrChecked($event, attrOption, attrItem)">{{ attrOption.label }}</a-checkbox>
              <a title="删除" @click.prevent="removeAttrOption(attrItem, attrOption, attrOptionLisIdx)">删除</a>&nbsp;
            </label>
          </div>
          <div>
            <a-input style="width: 20%" :placeholder="attrItem.name" v-model="attrItem.manualAttrValue"/>&nbsp;
            <k-tooltip-button title="添加" @click="addAttrOption(attrItem)" icon="plus"/>
          </div>
        </div>
        <!-- 从选项列表选择 -->
        <div v-else-if="attrItem.inputType === 2">
          <div v-if="attrItem.optionList.length > 0" class="ant-checkbox-group">
            <!-- 遍历规格属性可选参数 -->
            <label v-for="(attrOption, attrOptionLisIdx) in attrItem.optionList">
              <a-checkbox @change="onAttrChecked($event, attrOption, attrItem)">{{ attrOption.label }}</a-checkbox>
              <a v-if="isExclusiveOption(attrOption)"
                 title="删除"
                 @click.prevent="removeAttrOption(attrItem, attrOption, attrOptionLisIdx)">删除</a>&nbsp;
            </label>
          </div>
          <!-- 判断是否可以手动添加规则 -->
          <div v-if="attrItem.canManualAdd">
            <a-input style="width: 20%" :placeholder="attrItem.name" v-model="attrItem.manualAttrValue"/>&nbsp;
            <k-tooltip-button title="添加" @click="addAttrOption(attrItem)" icon="plus"/>
          </div>
        </div>

      </a-form-model-item>
    </a-form-model>

    <div v-if="showSkuTable">
      <div style="margin-bottom: 10px">
        <a-button type="primary" @click="flushSKU">刷新SKU</a-button>
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
                <a @click="syncSkuColumn(idx, record)">同步到其他项</a>
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
import {getPageList as getAttrList} from '@/api/product/attr-api'
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
  name: 'GoodsAttrSpec',
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
      this.dynamicBuildSkuTableColumns(this.internalModel.skus[0].specs);
      this.initSkuTable();
      // this.internalModel.skus[0].specs.forEach(item => {
      // const {attrId, attrName, attrValue} = item
      // this.attrValueOnChange(this.assembleSku(attrId, attrName, attrValue), 'add');
      // })
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
    /**
     * 判断是否商品特有的可选项
     */
    isExclusiveOption(attrOption) {
      return attrOption.type === 2;
    },
    initSkuTable() {
      this.skuTableData = this.internalModel.skus
      this.skuTableData.forEach(item => {
        item.specs.forEach(s => {
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
          align: 'center',
          width: columnWidth,
          dataIndex: attrItem.id
        })
      })
      this.columns = cols
    },
    onSkuColumnChange(e, col, idx, record) {

    },
    saveSkuColumn(idx) {
      const editSkuTableItem = this.editSkuTableData[idx];
      console.log('编辑列', editSkuTableItem)
      this.$set(this.skuTableData, idx, editSkuTableItem)
      this.$set(this.editSkuTableData, idx, undefined)
      console.log(`保存列`, this.skuTableData)
    },
    cancelSkuColumn(idx, record) {
      this.$set(this.editSkuTableData, idx, undefined)
    },
    syncSkuColumn(idx, record) {
      for (let i = 0; i < this.editSkuTableData.length; i++) {
        const item = this.editSkuTableData[i];
        item.costPrice = record.costPrice
        item.salesPrice = record.salesPrice
        item.stock = record.stock
        item.warnStock = record.warnStock
        this.$set(this.editSkuTableData, i, item)
      }
    },
    editSkuColumn(idx, record) {
      this.$set(this.editSkuTableData, idx, this.$cloneDeep(this.skuTableData[idx]))
    },
    initSkuTableData() {
      this.skuTableData = []
      this.editSkuTableData = []
    },
    flushSKU() {
      this.skuTableLoading = true
      try {
        this.initSkuTableData();
        const attrTable = []
        console.log('checkedAttrs', this.checkedAttrValueMap)
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
            if (!obj.specs) {
              obj.specs = [{...item}]
            } else {
              obj.specs.push({...item})
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
    /**
     * 添加可选项
     */
    addAttrOption(attrItem) {
      const manualAttrValue = attrItem.manualAttrValue
      const attrId = attrItem.id;

      attrItem.optionList.push({
        attrId: attrId,
        label: manualAttrValue,
        value: `${attrItem.id}-${attrItem.name}-${manualAttrValue}`,
        type: 2
      })
      if (this.newAttrOptions.size < 1 || !this.newAttrOptions.has(attrId)) {
        this.newAttrOptions.set(attrId, [manualAttrValue])
      } else {
        this.newAttrOptions.get(attrId).push(manualAttrValue)
      }
      console.log('新的可选项', this.newAttrOptions)
      attrItem.manualAttrValue = ''
    },
    /**
     * 删除可选项
     */
    removeAttrOption(attrItem, attrOption, attrOptionIdx) {
      attrItem.optionList.splice(attrOptionIdx, 1)
      console.log('attrOption', attrOption)
      const attrId = attrItem.id;
      const attrName = attrItem.name;
      if (this.newAttrOptions.has(attrId)) {
        let attrOptions = this.newAttrOptions.get(attrId);
        attrOptions = attrOptions.filter(item => item !== attrOption.label);
        this.newAttrOptions.set(attrId, attrOptions)
        if (attrOptions.length === 0) {
          this.newAttrOptions.delete(attrId)
        }
        console.log(`${attrId}下的可选项`, attrOptions)
      }
      // 尝试从已选中的属性值中移除
      this.attrValueOnChange(this.assembleSku(attrId, attrName, attrOption.label), 'delete');
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
     */
    attrValueOnChange(value, action) {
      const {attrId} = value;
      if (action === 'add') {
        if (this.checkedAttrValueMap.size < 1 || !this.checkedAttrValueMap.has(attrId)) {
          this.checkedAttrValueMap.set(attrId, [value])
        } else {
          this.checkedAttrValueMap.get(attrId).push(value)
        }
      } else {
        if (this.checkedAttrValueMap.has(attrId)) {
          let valueList = this.checkedAttrValueMap.get(attrId)
          valueList = valueList.filter(item => `${item.attrId}-${item.attrName}-${item.attrValue}` !== `${value.attrId}-${value.attrName}-${value.attrValue}`);
          this.checkedAttrValueMap.set(attrId, valueList)
        }
      }
    },
    assembleSku(attrId, attrName, attrValue) {
      return {
        attrId,
        attrName,
        attrValue
      };
    },
    /**
     * 选中属性值
     */
    onAttrChecked(e, attrOption, attr) {
      const action = e.target.checked ? 'add' : 'delete';
      console.log('选中属性', attrOption, attr)
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
      const skus = []
      this.skuTableData.forEach(item => {
        const skuObj = {
          id: item.id,
          code: item.code,
          salesPrice: yuanToFen(item.salesPrice),
          costPrice: yuanToFen(item.costPrice),
          stock: item.stock,
          warnStock: item.warnStock,
          specs: [...item.specs],
        };
        skus.push(skuObj)
      })
      return {
        newAttrOptions: this.getNewAttrOptions(),
        skus,
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