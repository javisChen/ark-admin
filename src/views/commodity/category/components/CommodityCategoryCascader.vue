<template>
  <a-cascader popupPlacement="bottomLeft"
              :changeOnSelect="true"
              :options="options"
              :fieldNames="{ label: 'name', value: 'id', children: 'nodes' }"
              placeholder="请选择商品类目"
              v-model="defaultValue"
              @change="onChange"/>
</template>

<script>
import {getTree} from '@/api/commodity/category-api'
import {parseLevelPathFull} from "@/utils/util";

export default {
  name: "CommodityCategoryCascader",
  props: {
    value: {
      type: [Number, String],
    },
    path: {
      type: [String],
      default: () => ''
    },
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      list: [],
      options: [],
      defaultValue: undefined
    }
  },
  watch: {
    path(val) {
      this.defaultValue = parseLevelPathFull(val)
    },
  },
  methods: {
    onChange(value, selectedOptions) {
      // this.defaultValue = value
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
    console.log('12312312312312')
    this.loadList()
  }
}
</script>

<style scoped>

</style>