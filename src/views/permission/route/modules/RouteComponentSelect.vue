<template>
  <a-select
    :value="value"
    @change="handleChange"
    :allowClear="true"
    show-search
    placeholder="请选择路由组件"
    option-filter-prop="children"
    :filter-option="filterOption"
  >
    <a-select-option v-for="(key, value) in routerComponents" :key="value" :value="value">
      {{ value }}
    </a-select-option>
  </a-select>
</template>

<script>
import routerComponents from "@/router/router-components";

export default {
  name: "RouteComponentSelect",
  props: ["value"],
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      routerComponents
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
}
</script>

<style scoped>

</style>