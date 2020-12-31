export const tableColumns = [
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
    fixed: 'right',
    width: 150,
    align: 'center',
    scopedSlots: {customRender: 'action'},
  },
];
