<template>
  <a-select
    :value="value"
    mode="multiple"
    @change="handleRoleOptionsChange"
    :allowClear="true"
    show-search
    placeholder="请选择角色"
    option-filter-prop="children"
    :filter-option="filterOption">
    <a-select-option v-for="(value, index) in roleOptions"
                     :key="index" :value="value.id">
      {{ value.name }}
    </a-select-option>
  </a-select>
</template>
<script>

import {getAllRoles} from "@/api/role-api";

export default {
  name: 'RoleSelect',
  props: ["value"],
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
  },
  data() {
    return {
      roleOptions: []
    }
  },
  created() {
    this.loadRoleOptions()
  },
  methods: {
    handleRoleOptionsChange(value) {
      this.$emit('change', value)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    loadRoleOptions() {
      getAllRoles().then(({data}) => {
        this.roleOptions = data
      })
    },
  }
}
</script>