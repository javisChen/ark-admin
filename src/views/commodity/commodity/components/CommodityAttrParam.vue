<template>
  <div>
    <div class="group" v-for="item in attrGroupList">
      <div class="header">
        {{ item.name }}
      </div>
      <div class="item" v-for="attrItem in item.attrList">
        <div class="item-left">
          {{ attrItem.name }}
        </div>
        <div class="item-right">
          <a-input @change="onValueChange($event, attrItem)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getPageList as getAttrGroupList} from '@/api/commodity/attr-group-api'
import cloneDeep from "lodash.clonedeep";

const columnWidth = 10;

export default {
  name: 'CommodityAttrParam',
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
      this.loadAttrGroupList()
    },
    formModel(newV, oldV) {
      this.internalModel = newV
      console.log('ffff', newV)
    },
  },
  data() {
    return {
      internalModel: cloneDeep(this.formModel),
      paramTable: [],
      attrGroupList: [],
      labelCol: {span: 2},
      wrapperCol: {span: 20},
      rules: {
        name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        code: [{required: true, message: '请输入商品编码', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择品牌', trigger: 'blur'}],
        categoryId: [{required: true, message: '请选择类目', trigger: 'blur'}],
      }
    }
  },
  created() {
    const s = '[\n' +
      '    {\n' +
      '        "attrId": "1517406218771795969",\n' +
      '        "attrName": "屏幕尺寸",\n' +
      '        "attrValue": "1231"\n' +
      '    },\n' +
      '    {\n' +
      '        "attrId": "1517406262228979714",\n' +
      '        "attrName": "屏幕分辨率",\n' +
      '        "attrValue": "1231"\n' +
      '    }\n' +
      ']'
    // console.log(s)
  },
  methods: {
    onValueChange($event, attrItem) {
      const value = $event.target.value;
      this.paramTable.forEach(item => {
        if (item.id === attrItem.attrId) {
          item.attrValue = value
        }
      })
    },
    rowKey(record, index) {
      return index
    },
    async loadAttrGroupList() {
      const {data} = await getAttrGroupList({
        current: 1,
        size: 30,
        categoryId: this.internalModel.categoryId,
        withAttr: true
      })
      if (!data.records || data.records.length === 0) {
        return
      }
      this.attrGroupList = data.records
      this.attrGroupList.forEach(item => {
        const obj = {
          columns: [{
            title: item.name,
            align: 'center',
            dataIndex: item.id,
            width: columnWidth
          }],
          attrList: []
        };
        this.paramTable = []
        item.attrList.forEach(attrItem => {
          obj.attrList.push({[item.id]: attrItem.name})
          this.paramTable.push({attrId: attrItem.id, attrValue: attrItem.value, attrName: attrItem.name})
        });
      })
      console.log(this.paramTable)
    },
    onSkuColumnChange(e, col, idx, record) {
    },
    getData() {
      const paramList = []
      return this.paramTable
    }
  }
}
</script>
<style scoped>
.group {
  border: 1px solid #ddd;
  width: 1000px;
  margin-bottom: 15px;
}

.header {
  font-weight: bold;
  padding: 5px;
  background-color: #f0f0f0;
  vertical-align: middle;
  font-size: 12px;
}

.item {
  flex-direction: row;
  display: flex;
  font-size: 13px;
  border: 1px solid #ddd;
  border-bottom: none;
  border-left: none;
}

.item-left {
  border-right: 1px solid #ddd;
  padding: 3px 5px;
  color: #666;
  width: 20%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.item-right {
  padding: 5px;
  line-height: 15px;
}
</style>