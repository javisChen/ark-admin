<template>
  <a-select
      :value="value"
      @change="handleChange"
      :allowClear="true"
      show-search
      :disabled="disabled"
      placeholder="请选择应用"
      option-filter-prop="children"
      :filter-option="filterOption"
  >
    <a-select-option v-for="(value) in applicationsOptions" :key="value.id" :value="value.id">
      {{ value.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import {getApplications} from "@/api/iam/application-api";


export default {
  name: "ApplicationSelect",
  props: ["value", 'disabled'],
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      applicationsOptions: []
    }
  },
  created() {
    this.loadOptions()
  },
  methods: {
    loadOptions() {
      getApplications({})
          .then(({data}) => {
            this.applicationsOptions = [...data]
            console.log('333333', this.value)
            if (!this.value) {
              console.log('12312312')
              this.handleChange(this.applicationsOptions[0].id)
            }
          })
          .catch(e => e)
    },
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