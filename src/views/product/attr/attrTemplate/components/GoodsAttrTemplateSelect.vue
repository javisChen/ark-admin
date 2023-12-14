<template>
  <a-select
    :value="value"
    @change="handleChange"
    :allowClear="true"
    show-search
    placeholder="请选择模板"
    option-filter-prop="children"
  >
    <a-select-option v-for="(value, idx) in list" :key="value.id" :value="value.id">
      {{ value.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import {getPageList} from '@/api/product/attr-template-api'

export default {
  name: "GoodsAttrTemplateSelect",
  props: {
    value: {
      type: [Number, String],
    },
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      list: [],
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
    },
    async loadList() {
      try {
        const {data} = await getPageList({
          current: 1, size: 199,
        })
        this.list = data.records;
      } finally {
      }
    },
  },
  created() {
    this.loadList()
  }
}
</script>

<style scoped>

</style>