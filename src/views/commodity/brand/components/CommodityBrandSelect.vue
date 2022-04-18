<template>
  <a-select
    :value="value"
    @change="handleChange"
    :allowClear="true"
    show-search
    placeholder="请选择品牌"
    option-filter-prop="children"
  >
    <a-select-option v-for="(item, idx) in list" :key="item.id" :value="item.id">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import {getPageList} from '@/api/commodity/brand-api'

export default {
  name: "CommodityBrandSelect",
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
      console.log(value)
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