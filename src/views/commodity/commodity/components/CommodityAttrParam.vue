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
          <a-input/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getPageList as getAttrGroupList} from '@/api/commodity/attr-group-api'

const columnWidth = 10;

export default {
  name: 'CommodityAttrParam',
  components: {
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
      this.loadAttrGroupList()
    }
  },
  data() {
    return {
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
    if (this.formModel.categoryId) {
      this.loadAttrGroupList()
    }
  },
  methods: {
    rowKey(record, index) {
      return index
    },
    async loadAttrGroupList() {
      this.paramTable = []
      const {data} = await getAttrGroupList({
        current: 1,
        size: 30,
        categoryId: this.formModel.categoryId,
        withAttr: true
      })
      if (!data.records || data.records.length === 0) {
        return
      }
      this.attrGroupList = data.records
      console.log(this.attrGroupList)
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
        item.attrList.forEach(attrItem => {
          obj.attrList.push({[item.id]: attrItem.name })
        });
        this.paramTable.push(obj)
      })
      console.log(this.paramTable)
    },
    onSkuColumnChange(e, col, idx, record) {
    },
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
  font-size: 12px;
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