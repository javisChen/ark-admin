<template>
  <a-card :bordered="false">
    <!--          <div style="  background: #00a0e9;">123</div>-->
    <!--      <div class="table-page-search-wrapper">-->
    <!--        <a-form layout="inline">-->
    <!--          <a-row :gutter="48">-->
    <!--            <a-col :md="8" :sm="24">-->
    <!--              <a-form-item label="用户组名称">-->
    <!--                <a-input v-model="queryParam.name" placeholder=""/>-->
    <!--              </a-form-item>-->
    <!--            </a-col>-->
    <!--            <a-col :md="8" :sm="24">-->
    <!--              <a-form-item label="使用状态">-->
    <!--                <a-select v-model="queryParam.status" placeholder="请选择" :default-value="0"-->
    <!--                          @change="handleQueryStatusChange">-->
    <!--                  <a-select-option v-for="(value, key) in routeStatusDictionary"-->
    <!--                                   :key="key"-->
    <!--                                   :value="key">-->
    <!--                    {{ value }}-->
    <!--                  </a-select-option>-->
    <!--                </a-select>-->
    <!--              </a-form-item>-->
    <!--            </a-col>-->
    <!--            <a-col :md="!advanced && 8 || 24" :sm="24">-->
    <!--                                    <span class="table-page-search-submitButtons"-->
    <!--                                          :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">-->
    <!--                                      <a-button type="primary" @click="loadTableData">查询</a-button>-->
    <!--                                      <a-button style="margin-left: 8px" @click="resetQueryParams">重置</a-button>-->
    <!--                                    </span>-->
    <!--            </a-col>-->
    <!--          </a-row>-->
    <!--        </a-form>-->
    <!--      </div>-->

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="showUserForm">新建用户组</a-button>
    </div>

    <a-table
      v-if="userGroups && userGroups.length > 0"
      bordered
      :pagination="false"
      :loading="tableLoading"
      :defaultExpandAllRows="defaultExpandAllRows"
      :expandRowByClick="false"
      :size="'small'"
      :indent-size="15"
      :data-source="userGroups"
      :row-key="rowKey"
      :columns="columns">

      <template slot="roles" slot-scope="text, record">
        <a-tag color="blue" v-for="item in record.roles" :key="item">{{ item }}</a-tag>
      </template>

      <template slot="inheritType" slot-scope="text, record">
        {{ getInheritTypeDesc(record.inheritType) }}
      </template>

      <template slot="type" slot-scope="text, record">
        {{ getTypeDesc(record.type) }}
      </template>

      <template slot="status" slot-scope="text, record">
        <a-dropdown :trigger="['click']">
          <a-menu slot="overlay" @click="routeStatusChange($event, record)">
            <a-menu-item v-for="(value, key) in routeStatusDictionary" :key="key">
              {{ value }}
            </a-menu-item>
          </a-menu>
          <a-button
            :style="record.status === 1 ? {'background-color': '#52c41a',border: 'none', 'color': 'white'}: {}"
            shape="round" size="small" :type="record.status !== 1 ? 'danger' : ''">
            {{ getStatusDesc(record.status) }}
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </template>

      <template slot="action" slot-scope="text, record">
        <k-tooltip-button title="编辑" @click="handleEdit(record)" icon="edit"/>&nbsp;
        <k-tooltip-button title="删除" @click="handleDelete(record)" type="danger" icon="delete"/>
      </template>
    </a-table>
    <a-empty v-else/>

    <!-- 创建路由信息表单-->
    <permission-user-group-form ref="userGroupForm"
                                @success="handleFormOnSuccess"
                                @cancel="handleEditFormCancel"
                                :user-groups="userGroups"/>

  </a-card>


</template>

<script>

import {fetchUserGroupPages, getUserGroup, deleteUserGroup} from '@/api/iam/usergroup-api'
import PermissionUserGroupForm from "./components/PermissionUserGroupForm";
import PermissionUserGroupTree from "./components/PermissionUserGroupTree";
import {filterNonChildren} from "@/utils/util";
import {inheritTypeOptions, typeOptions} from "./dictionary";


const routeStatusDictionary = {
  1: '已启用',
  2: '已禁用'
}

const pagination = {
  showSizeChanger: true,
  position: 'bottom',
  size: 'default',
  showQuickJumper: true,
  pageSizeOptions: ['15', '25', '35', '50'],
  defaultCurrent: 1,
  defaultPageSize: 15,
  total: 0
}

const queryParam = {
  current: 1,
  size: 15,
}

export default {
  name: 'PermissionUserGroup',
  components: {
    PermissionUserGroupForm,
    PermissionUserGroupTree
  },
  data() {
    return {
      pagination,
      defaultExpandAllRows: false,
      tableLoading: false,
      advanced: false,
      queryParam,
      userGroups: [],
      columns: [
        {
          title: '用户组名称',
          dataIndex: 'name',
        },
        {
          title: '角色权限',
          scopedSlots: {customRender: 'roles'},
        },
        {
          title: '用户组类型',
          scopedSlots: {customRender: 'type'},
        },
        {
          title: '继承类型',
          scopedSlots: {customRender: 'inheritType'},
        },
        {
          title: '创建时间',
          align: 'center',
          width: '200px',
          dataIndex: 'createTime',
        },
        {
          title: '更新时间',
          align: 'center',
          width: '200px',
          dataIndex: 'updateTime',
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {customRender: 'action'},
        }
      ],
      routeStatusDictionary,
      userGroupFormVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    async handleEdit(record) {
      const {data} = await getUserGroup({id: record.id})
      this.$refs['userGroupForm'].open(data, 'edit')
    },
    handleTableChange(pagination, filters, sorter) {
      this.queryParam.current = pagination.current
      this.loadTableData()
    },
    resetQueryParams() {
      this.queryParam = Object.assign({}, queryParam)
      this.loadTableData()
    },
    handleQueryStatusChange(value) {
      this.loadTableData()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    async routeStatusChange(value, route) {
      // try {
      //   await updateRouteStatus({id: route.id, status: +value.key})
      //   await this.loadTableData()
      //   this.$message.success('修改成功')
      // } catch (e) {
      // }
    },
    getStatusDesc(status) {
      return routeStatusDictionary[status]
    },
    getInheritTypeDesc(value) {
      return inheritTypeOptions.filter(item => item.value === value)[0].desc
    },
    getTypeDesc(value) {
      return typeOptions.filter(item => item.value === value)[0].desc
    },
    handleFormOnSuccess() {
      this.$message.success('保存成功')
      this.loadTableData()
    },
    handleEditFormCancel() {
    },
    showUserForm() {
      this.$refs['userGroupForm'].open()
    },
    rowKey(record) {
      return record.id
    },
    handleDelete(record) {
      this.$confirm({
        title: `提示`,
        content: `确定要删除[${record.name}]用户组吗？`,
        onOk: async () => {
          deleteUserGroup({id: record.id})
            .then(resp => {
              this.$message.success('删除成功');
              this.loadTableData()
            })
            .catch((e) => e)
        }
      })
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadTableData() {
      this.toggleLoading()
      const params = {...this.queryParam};
      const {data} = await fetchUserGroupPages(params)
      this.userGroups = data.map(item => {
        filterNonChildren(item);
        return item;
      });
      // this.pagination.total = data.total
      this.toggleLoading()
    }
  }
};
</script>