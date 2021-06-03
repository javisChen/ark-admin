<template>
  <a-select
      :value="value"
      mode="multiple"
      @change="handleOptionsChange"
      :allowClear="true"
      show-search
      placeholder="请选择用户组"
      option-filter-prop="children"
      :filter-option="filterOption">
    <a-select-option v-for="(value, index) in userGroupOptions"
                     :key="index" :value="value.id">
      <span>{{ value.name }} <a href="#">({{getLevelDesc(value.level) + '级'}})</a></span>
    </a-select-option>
  </a-select>
</template>
<script>

import {getAllUserGroups} from "@/api/iam/usergroup-api";

const levelDict = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
}

export default {
  name: 'UserGroupSelect',
  props: ["value"],
  model: {
    prop: 'value',
    event: 'change'
  },
  created() {
    this.loadUserGroupOptions()
  },
  data() {
    return {
      userGroupOptions: []
    }
  },
  methods: {
    getLevelDesc(value) {
      return levelDict[value]
    },
    loadUserGroupOptions() {
      getAllUserGroups()
        .then(({data}) => {
          this.userGroupOptions = data
        })
    },
    handleOptionsChange(value) {
      this.$emit('change', value)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  }
}
</script>