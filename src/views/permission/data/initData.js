export const tableColumns = [
  {
    title: '路由名称',
    dataIndex: 'name',
    width: 100,
  },
  // {
  //   title: '路由编码',
  //   dataIndex: 'code',
  //   width: 100,
  // },
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
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 50,
    align: "center",
    scopedSlots: {customRender: 'status'},
  },
  // {
  //   title: 'Icon',
  //   dataIndex: 'icon',
  //   width: 100,
  // },
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
