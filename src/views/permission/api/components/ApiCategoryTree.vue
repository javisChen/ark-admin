<template>

  <a-spin :spinning="spinning">
    <a-card :bordered="true" title="接口分类" size="small">
      <template slot="extra" v-if="showAction">
        <a-button shape="circle" size="small" type="primary" icon="plus"
                  @click="openCategoryForm('add')"></a-button>
      </template>
      <template v-if="data && data.length > 0">
        <div class="category-wrapper">
          <div v-for="item in data" style="cursor: pointer"
               class="category-item"
               :class="{activated: (item.onhover && !item.activated) || item.activated}">
            <div class="category-item-title"
                 @click="handleClick(item)"
                 @mouseleave="hover(item, false)"
                 @mouseenter="hover(item, true)">
                <span style="cursor: pointer">
                  {{ item.name }}
                </span>
            </div>
            <div class="category-item-action" v-if="showAction">
              <a-icon
                @click="openCategoryForm('edit', item)"
                @mouseleave="hoverEdit(item, false)"
                @mouseenter="hoverEdit(item, true)"
                twoToneColor="#13C2C2"
                :theme="item.onhoveredit ? 'twoTone' : 'outlined'"
                style="cursor:pointer;" type="edit"/>&nbsp;
              <a-icon
                @click="handleDelete(item)"
                @mouseleave="hoverDelete(item, false)"
                @mouseenter="hoverDelete(item, true)"
                twoToneColor="#13C2C2"
                :theme="item.onhoverdelete ? 'twoTone' : 'outlined'"
                style="cursor:pointer;" type="delete"/>
            </div>
          </div>
        </div>
      </template>
      <div v-else>
        暂无分类
      </div>

      <permission-api-category-form ref="categoryForm"
                                    @success="handleCategoryFormOnSuccess"
                                    @cancel="handleEditFormCancel"/>
    </a-card>
  </a-spin>
</template>

<script>

import {deleteApiCategory, getApiCategories} from '@/api/iam/api-category-api'
import PermissionApiCategoryForm from "@/views/permission/api/components/PermissionApiCategoryForm";

export default {
  name: 'ApiCategoryTree',
  components: {
    PermissionApiCategoryForm
  },
  props: {
    applicationId: {
      type: String,
      required: false,
      default: () => 0
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    },
    showAction: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  watch: {
    categories(val) {
      this.data = this.$cloneDeep(val)
      this.rebuild()
    }
  },
  data() {
    return {
      spinning: false,
      data: []
    }
  },
  created() {
  },
  computed: {},
  methods: {
    rebuild() {
      if (this.data.length > 0) {
        this.data[0].activated = true
      }
    },
    toggleLoading() {
      this.spinning = !this.spinning
    },
    handleClick(item) {
      console.log(item)
      if (item.activated) {
        this.$set(item, 'activated', false)
      } else {
        this.data.forEach(item => {
          this.$set(item, 'activated', false)
        })
        this.$set(item, 'activated', true)
      }
      this.notify(item)
    },
    notify(item) {
      this.$emit('change', item)
    },
    notifyUpdate() {
      this.$emit('update')
    },
    hover(item, f) {
      this.$set(item, 'onhover', f)
    },
    hoverDelete(item, f) {
      this.$set(item, 'onhoverdelete', f)
    },
    hoverEdit(item, f) {
      this.$set(item, 'onhoveredit', f)
    },
    openCategoryForm(type, record) {
      let model;
      switch (type) {
        case 'edit':
          model = record
          break
        case 'add':
          model = {
            applicationId: this.applicationId
          }
          break
        default:
          break;
      }
      this.$refs['categoryForm'].open(model, type)
    },
    handleCategoryFormOnSuccess() {
      this.$message.success('保存成功')
      this.notifyUpdate()
    },
    handleEditFormCancel() {
    },
    handleDelete(record) {
      this.$confirm({
        title: `提示`,
        content: `确认要删除[${record.name}]分类？`,
        onOk: async () => {
          const {data} = await deleteApiCategory({id: record.id})
          this.notifyUpdate()

        }
      })
    }
  }
}
</script>

<style type="text/css" scoped>

.category-wrapper {
  /*height: 500px;*/
  /*border: 1px solid red;*/
}

.category-item {
  display: flex;
  flex-direction: row;
  padding: 5px;
  margin-bottom: 5px;
}

.category-item.activated {
  background-color: #e6fffb;
  border-right: 2px #13c2c2 solid;
}

.category-item-title {
  width: 70%;
  /*border: 1px red solid;*/
}

.category-item-action {
  width: 30%;
  /*border: 1px green solid;*/
}
</style>