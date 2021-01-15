<template>
  <a-card
    type="inner"
    title="页面元素"
    size="small">
    <a-button v-if="tableEditable"
              icon="plus"
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
            <div v-if="col === 'name'" style="position: relative">
              <a-input :style="(record.showError)? 'border: 1px solid #f5222d': ''"
                       :value="text"
                       @change="e => handleChange(e.target.value, record.id, col)"/>
              <div v-if="(record.showError)" style="color: #f5222d">
              <span class="ant-form-item-children-icon"
                    style="position:absolute;top: 9%;right: 6px;">
                <i aria-label="图标: close-circle"
                   class="anticon anticon-close-circle">
                  <svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor"
                       aria-hidden="true" focusable="false" class="">
                    <path
                      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
                  </svg>
                </i>
              </span>
                <span>请输入元素名称并保存</span>
              </div>
            </div>
            <a-select style="width: 100%"
                      v-else-if="col === 'type'"
                      @change="e => handleChange(e, record.id, col)"
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
      <template v-if="tableEditable" slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record)">保存</a>
          <a @click="() => cancel(record.id)">取消</a>
        </span>
          <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
          <a-popconfirm title="确定删除元素?" @confirm="() => remove(index)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        </div>
      </template>
    </a-table>
  </a-card>

</template>

<script>

import {pageElementTypeDictionary} from '../../dictionary'

export default {
  name: 'PermissionPageElementTable',
  props: {
    elementData: {
      type: Array,
      required: false,
      default: () => []
    },
    tableEditable: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  watch: {
    tableEditable(val) {
      console.log(val)
    }
  },
  data() {
    return {
      typeDictionary: pageElementTypeDictionary,
      data: [],
      cacheData: [],
      columns: [
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
      ],
      editingKey: ''
    }
  },
  created() {
    console.log(123)
    if (this.tableEditable) {
      this.data = this.elementData.map(item => {
        const newItem = {...item}
        newItem.editable = false
        return newItem;
      })
      this.cacheData = this.data.map(item => ({...item}))
    } else {
      this.data = this.elementData
      console.log(this.columns)
      this.columns.splice(this.columns.findIndex(item => item.dataIndex === 'operation'), 1)
    }
  },
  methods: {
    rowKey(record) {
      return record.id
    },
    reset() {
      this.data = []
    },
    getTypeDesc(value) {
      return this.typeDictionary[value]
    },
    createElementItem() {
      return {
        id: new Date().getTime() + Math.ceil(Math.random() * 999),
        name: '',
        type: 1,
        editable: true,
        showError: false
      };
    },
    handleAddElement() {
      const item = this.createElementItem()
      this.data.push(item);
      this.cacheData.push(item);
    },
    handleChange(value, id, column) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => id === item.id);
      const targetCache = newCacheData.find(item => id === item.id);
      if (target && targetCache) {
        target[column] = value;
        target.showError = !value;
        this.data = newData;
        this.cacheData = newCacheData;
      }
      console.log('原数据：', newData)
      console.log('缓存数据：', this.cacheData)
    },
    edit(id) {
      const newData = [...this.data];
      const target = newData.find(item => id === item.id);
      this.editingKey = id;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(record) {
      if (!record.name) {
        record.showError = true
        return false
      }
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = this.data.find(item => record.id === item.id);
      const targetCache = this.cacheData.find(item => record.id === item.id);
      if (target && targetCache) {
        delete target.editable;
        Object.assign(targetCache, target)
        this.data = newData;
        this.cacheData = newCacheData;
      }
      console.log('原数据：', newData)
      console.log('缓存数据：', this.cacheData)
      this.editingKey = '';
    },
    remove(idx) {
      this.data.splice(idx, 1)
    },
    cancel(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => key === item.id);
      const targetCache = newCacheData.find(item => key === item.id);
      this.editingKey = '';
      if (target && targetCache) {
        delete target.editable;
        Object.assign(target, targetCache)
        this.data = newData;
        this.cacheData = newCacheData;
      }
      console.log('原数据：', newData)
      console.log('缓存数据：', this.cacheData)
    },
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>