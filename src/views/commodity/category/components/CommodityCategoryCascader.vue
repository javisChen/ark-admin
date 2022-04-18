<template>
  <a-cascader popupPlacement="bottomLeft"
              :changeOnSelect="true"
              :options="options"
              :fieldNames="{ label: 'name', value: 'id', children: 'nodes' }"
              placeholder="请选择商品类目"
              :default-value="[]"
              @change="onChange"/>
</template>

<script>
import {getTree} from '@/api/commodity/category-api'

export default {
  name: "CommodityCategoryCascader",
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
      options: []
    }
  },
  methods: {
    onChange(value, selectedOptions) {
      this.$emit('change', value[value.length - 1])
    },
    async loadList() {
      try {
        const {data} = await getTree({})
        this.options = data.nodes;
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