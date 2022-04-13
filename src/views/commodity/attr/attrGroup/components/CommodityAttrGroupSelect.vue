<template>
  <a-select
    :value="value"
    @change="handleChange"
    :allowClear="true"
    show-search
    placeholder="请选择属性组"
    option-filter-prop="children"
    :filter-option="filterOption"
  >
    <a-select-option v-for="(value, idx) in attrGroupList" :key="value.id" :value="value.id">
      {{ value.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import {getPageList as getAttrGroupPageList} from '@/api/commodity/attr-group-api'

export default {
  name: "CommodityAttrGroupSelect",
  props: {
    value: {
      type: [Number, String],
    },
    attrTemplateId: {
      type: [Number, String],
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      attrGroupList: [],
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
      this.$emit('change', value)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    async loadAttrGroupList() {
      try {
        const {data} = await getAttrGroupPageList({current: 1, size: 199, attrTemplateId: this.attrTemplateId})
        this.attrGroupList = data.records;
      } finally {
      }
    },
  },
  created() {
    console.log(this.value)
    this.loadAttrGroupList()
  }
}
</script>

<style scoped>

</style>