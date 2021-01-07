<template>
  <a-card
    type="inner"
    title="页面元素"
    size="small">
    <a-button icon="plus"
              type="primary"
              class="editable-add-btn"
              @click="handleAddElement">
      新增元素
    </a-button>
    <a-table
      style="margin-top: 10px"
      :pagination="false"
      :columns="columns"
      :data-source="data"
      :row-key="rowKey"
      size="small"
      bordered>
      <template
        v-for="col in ['name', 'type']"
        :slot="col"
        slot-scope="text, record, index">
        <div :key="col">
          <template v-if="record.editable">
            <a-input
              v-if="col === 'name'"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-select style="width: 100%"
                      v-else-if="col === 'type'"
                      @change="e => handleChange(e, record.key, col)"
                      placeholder="请选择"
                      :value="record.type"
                      :default-value="1">
              <a-select-option v-for="(value, key) in typeDictionary"
                               :key="key"
                               :value="parseInt(key)">
                {{ value }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else>
            <span v-if="col === 'name'">{{ record.name }}</span>
            <span v-if="col === 'type'">{{ getTypeDesc(record.type) }}</span>
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">保存</a>
          <a @click="() => cancel(record.key)">取消</a>
        </span>
          <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
          <a-popconfirm title="确定删除元素?" @confirm="() => cancel(record.key)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        </div>
      </template>
    </a-table>
  </a-card>

</template>

<script>
const columns = [
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
  },
];

const data = [];

const typeDictionary = {
  1: 'Button',
  2: 'Div'
}

export default {
  name: 'PermissionPageElementTable',
  props: {
    elementData: {
      type: Array,
      required: false,
      default: () => []
    },
  },
  data() {
    this.cacheData = data.map(item => ({...item}));
    return {
      typeDictionary,
      data: this.elementData,
      count: data.length,
      columns,
      editingKey: '',
    };
  },
  methods: {
    rowKey(record) {
      console.log(record)
      return record.id
    },
    reset() {
      this.data = []
    },
    getTypeDesc(value) {
      return typeDictionary[value]
    },
    handleAddElement() {
      this.addCount()
      this.data.push({
        key: this.count,
        name: '',
        type: 1,
      });
      this.cacheData = [...this.data]
    },
    addCount() {
      this.count++
    },
    handleChange(value, key, column) {
      console.log(value)
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.data = newData;
      }
    },
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>