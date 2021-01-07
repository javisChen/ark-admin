<template>

  <a-modal
    :width="1000"
    :centered="false"
    v-model="visible"
    title="授权"
    ok-text="保存授权"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :closable="true"
    @cancel="handleClose"
    cancel-text="取消">

    <a-card
      size="small"
      :tab-list="tabList"
      :defaultActiveTabKey="defaultActiveTabKey"
      @tabChange="key => onTabChange(key, 'noTitleKey')">
      <template v-if="activeTabKey === 'route'">
        <a-row :gutter="16">
          <a-col :span="6">
            <permission-grant-form-route-tree/>
          </a-col>
          <a-col :span="18">
            <permission-grant-form-page-element-table/>
          </a-col>
        </a-row>
      </template>
      <template v-if="activeTabKey === 'api'">
        123
      </template>
    </a-card>
  </a-modal>
</template>

<script>

import PermissionGrantFormRouteTree from "./PermissionGrantFormRouteTree";
import PermissionGrantFormPageElementTable from "./PermissionGrantFormPageElementTable";

const defaultModel = {
  id: '',
  name: '',
  status: 1,
}


const defaultActiveTabKey = 'route';
const activeTabKey = 'route'


export default {
  name: 'PermissionGrantForm',
  components: {
    PermissionGrantFormRouteTree,
    PermissionGrantFormPageElementTable
  },
  props: {},
  data() {
    return {
      defaultActiveTabKey,
      activeTabKey,
      tabList: [
        {
          key: 'route',
          tab: '路由授权',
        },
        {
          key: 'api',
          tab: '接口授权',
        },
      ],
      confirmLoading: false,
      visible: true,
    }
  },
  computed: {},
  methods: {
    onTabChange(key) {
      this.activeTabKey = key;
    },
    open(formModel, mode = FORM_MODE_ADD) {
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
      }
      this.mode = mode
      this.visible = true
    },
    close() {
      this.visible = false
      this.resetForm()
    },
    resetForm() {
      this.formModel = Object.assign({}, defaultModel)
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function ($form) {
      this.$emit('success', '')
      this.close()
    },
  },
  created() {
  }
}
</script>
