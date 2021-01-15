<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-item>
        <tag-select>
          <tag-select-option value="Category1">类目一</tag-select-option>
          <tag-select-option value="Category2">类目二</tag-select-option>
          <tag-select-option value="Category3">类目三</tag-select-option>
          <tag-select-option value="Category4">类目四</tag-select-option>
          <tag-select-option value="Category5">类目五</tag-select-option>
          <tag-select-option value="Category6">类目六</tag-select-option>
          <tag-select-option value="Category7">类目七</tag-select-option>
          <tag-select-option value="Category8">类目八</tag-select-option>
          <tag-select-option value="Category9">类目九</tag-select-option>
          <tag-select-option value="Category10">类目十</tag-select-option>
        </tag-select>
      </a-form-item>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="showApplicationForm">新建应用</a-button>
      </div>

      <div class="ant-pro-pages-list-applications-filterCardList">
        <a-list :loading="loading" :data-source="data" :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }"
                style="margin-top: 24px;">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card :body-style="{ paddingBottom: 20 }" hoverable>
              <a-card-meta :title="item.name">
              </a-card-meta>
              <template slot="actions">
                <a-tooltip title="下载">
                  <a-icon type="download"/>
                </a-tooltip>
                <a-tooltip title="编辑">
                  <a-icon type="edit" @click="handleEdit(item)"/>
                </a-tooltip>
                <a-tooltip title="分享">
                  <a-icon type="share-alt"/>
                </a-tooltip>
                <a-dropdown>
                  <a class="ant-dropdown-link">
                    <a-icon type="ellipsis"/>
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;">1st menu item</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">2nd menu item</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">3rd menu item</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <div class="">
                <card-info active-user="100" new-user="999" :status="item.status"></card-info>
              </div>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </a-card>

    <!-- 创建路由信息表单-->
    <permission-application-form ref="applicationForm"
                                 @success="handleFormOnSuccess"
                                 @cancel="handleEditFormCancel"/>

  </page-header-wrapper>
</template>

<script>

import {TagSelect, StandardFormRow, Ellipsis} from '@/components'
import CardInfo from './components/CardInfo'
import PermissionApplicationForm from './components/PermissionApplicationForm'
import {getApplications} from "@/api/application-api";


const TagSelectOption = TagSelect.Option

export default {
  name: 'PermissionApplication',
  components: {
    PermissionApplicationForm,
    Ellipsis,
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    CardInfo
  },
  data() {
    return {
      data: [],
      loading: true
    }
  },
  filters: {},
  mounted() {
    this.loadData()
  },
  methods: {
    handleEdit(record) {
      this.$refs['applicationForm'].open(record, 'edit')
    },
    handleEditFormCancel() {
    },
    handleFormOnSuccess() {
      this.$message.success('保存成功')
      this.loadData()
    },
    showApplicationForm() {
      this.$refs['applicationForm'].open()
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    loadData() {
      this.loading = true
      getApplications({})
        .then(({data}) => this.data = data)
        .catch()
        .finally(() => this.loading = false)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}

.ant-pro-pages-list-projects-cardList {
  margin-top: 24px;

  /deep/ .ant-card-meta-title {
    margin-bottom: 4px;
  }

  /deep/ .ant-card-meta-description {
    height: 44px;
    overflow: hidden;
    line-height: 22px;
  }

  .cardItemContent {
    display: flex;
    height: 20px;
    margin-top: 16px;
    margin-bottom: -4px;
    line-height: 20px;

    > span {
      flex: 1 1;
      color: rgba(0, 0, 0, .45);
      font-size: 12px;
    }

    /deep/ .ant-pro-avatar-list {
      flex: 0 1 auto;
    }
  }
}

.new-btn {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 186px;
}
</style>
