export const tableColumns = [
  {
    title: '路由名称',
    dataIndex: 'name',
    width: 100,
    filtered:true,
    sortOrder: 'descend'
  },
  {
    title: '组件名',
    dataIndex: 'component',
    width: 100,
    customRender: (text, row, index) => {
      return text || '-'
    },
  },
  {
    title: '路径',
    dataIndex: 'path',
    width: 150,
    ellipsis: true,
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
    title: '排序',
    dataIndex: 'sequence',
    width: 50,
  },
  {
    title: '操作',
    fixed: 'right',
    width: 150,
    align: 'center',
    scopedSlots: {customRender: 'action'},
  },
];
