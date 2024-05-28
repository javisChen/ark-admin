<template>
    <a-card :bordered="false">
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
                <a-tooltip title="查看路由">
                  <a-icon type="menu" @click="viewRoute(item)"/>
                </a-tooltip>
                <a-tooltip title="查看Api">
                  <a-icon type="api" @click="viewApi(item)"/>
                </a-tooltip>
                <a-tooltip title="编辑">
                  <a-icon type="edit" @click="handleEdit(item)"/>
                </a-tooltip>
              </template>
              <div class="">
                <card-info :api-count="item.apiCount" :route-count="item.routeCount" :status="item.status"></card-info>
              </div>
            </a-card>
          </a-list-item>
        </a-list>
      </div>

      <!-- 创建路由信息表单-->
      <permission-application-form ref="applicationForm"
                                   @success="handleFormOnSuccess"
                                   @cancel="handleEditFormCancel"/>

    </a-card>

</template>

<script>
import {TagSelect, StandardFormRow, Ellipsis} from '@/components'
import CardInfo from './components/CardInfo'
import PermissionApplicationForm from './components/PermissionApplicationForm'
import {getApplications} from "@/api/iam/application-api";


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
    viewRoute(item) {
      this.$router.push({
        name: 'permission:route',
        query: {
          applicationId: item.id
        }
      })
    },
    viewApi(item) {
      this.$router.push({
        name: 'permission:interface',
        query: {
          applicationId: item.id
        }
      })
    },
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
