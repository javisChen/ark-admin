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

export default {
  name: 'PermissionGrantRouteTree',
  data() {
    return {
      columns: [
        {
          title: '用户名称',
          dataIndex: 'name',
          width: 100
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          width: 100,
          customRender: (text, row, index) => {
            return text || '-'
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 50,
          align: "center",
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '操作',
          width: 50,
          align: 'center',
          scopedSlots: {customRender: 'action'},
        },
      ],
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