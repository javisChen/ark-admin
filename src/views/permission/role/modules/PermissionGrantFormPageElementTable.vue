<template>
  <a-table
    bordered
    :pagination="false"
    :loading="false"
    :expandRowByClick="true"
    :size="'small'"
    :indent-size="15"
    :row-key="rowKey"
    :columns="columns"
    :data-source="tableData">

  </a-table>
</template>

<script>

import {getUserGroupsTree} from "@/api/usergroup-api";

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0',
          },
          {
            title: '0-0-0-1', key: '0-0-0-1',
          },
          {
            title: '0-0-0-2', key: '0-0-0-2',
          },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {title: '0-0-1-0', key: '0-0-1-0'},
          {title: '0-0-1-1', key: '0-0-1-1'},
          {title: '0-0-1-2', key: '0-0-1-2'},
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {title: '0-1-0-0', key: '0-1-0-0'},
      {title: '0-1-0-1', key: '0-1-0-1'},
      {title: '0-1-0-2', key: '0-1-0-2'},
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

const columns = [
  {
    title: '权限编号',
    dataIndex: 'name',
    width: '33%',
    scopedSlots: {customRender: 'name'},
  },
  {
    title: '元素名称',
    dataIndex: 'name',
    width: '33%',
    scopedSlots: {customRender: 'name'},
  },
  {
    title: '元素类型',
    dataIndex: 'age',
    width: '33%',
    scopedSlots: {customRender: 'type'},
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
  }
];

export default {
  name: 'PermissionGrantRouteTree',
  data() {
    return {
      columns,
      tableData: [],
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData,
    };
  },
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val);
    },
  },
  created() {
    // this.loadTreeData()
  },
  methods: {
    rowKey(record) {
      return record.id
    },
    async loadTreeData() {
      const {data} = await getUserGroupsTree({})
      this.treeData = data
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info);
      this.selectedKeys = selectedKeys;
    },
  },
};
</script>
<style scoped>
.btn {
  width: 20px;
}
</style>