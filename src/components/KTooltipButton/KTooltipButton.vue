<template>
  <a-tooltip :placement="placement">
    <template slot="title">
      <span>{{ title }}</span>
    </template>
    <a-button @click="handleClick"
              :alt="alt"
              :size="size"
              :type="type"
              :shape="shape"
              :icon="icon"/>
  </a-tooltip>
</template>

<script>
export default {
  name: 'KTooltipButton',
  props: {
    placement: {
      type: String,
      required: false,
      default: 'top'
    },
    title: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: false
    },
    size: {
      type: String,
      required: false,
      default: 'small'
    },
    type: {
      type: String,
      required: false,
      default: 'primary'
    },
    icon: {
      type: String,
      required: false,
    },
    shape: {
      type: String,
      default: 'circle'
    },
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  },
}
</script>

<style lang="less" scoped>
</style>
