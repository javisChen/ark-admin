<template>

  <a-modal
    :width="830"
    v-model="visible"
    :title="formTitle"
    ok-text="保存"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :closable="true"
    :centered="true"
    @ok="submitForm"
    @cancel="handleClose"
    cancel-text="取消">

    <a-form-model
      layout="horizontal"
      v-if="formModel"
      ref="form"
      :model="formModel"
      :rules="rules"
      :label-col="{span: 8}"
      :wrapper-col="{span: 16}">

      <a-row :gutter="1">
        <a-col :span="12">
          <a-form-model-item ref="name" label="路由名称" prop="name" has-feedback>
            <span v-if="isViewMode">{{ formModel.name }}</span>
            <a-input v-else placeholder="路由名称" v-model="formModel.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="路由编码" prop="code" has-feedback>
            <span v-if="isViewMode">{{ formModel.code }}</span>
            <a-input v-else placeholder="路由编码（格式 一级路由:二级路由:三级路由:...）" v-model="formModel.code"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-model-item label="路由组件" prop="component" has-feedback>
            <span v-if="isViewMode">{{ formModel.component }}</span>
            <route-component-select v-else v-model="formModel.component"></route-component-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="路由地址" prop="path" has-feedback>
            <span v-if="isViewMode">{{ formModel.path }}</span>
            <a-input v-else v-model="formModel.path"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-model-item label="所属路由" prop="pid" has-feedback>
            <span v-if="isViewMode">{{ formModel.parentRouteName }}</span>
            <a-cascader :disabled="isAddChildrenMode"
                        v-else
                        popupPlacement="bottomLeft"
                        :changeOnSelect="true"
                        :options="routes"
                        :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                        placeholder="请选择所属路由"
                        :default-value="routesOptionsDefaultValue"
                        @change="onSelectRouteChange"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="Icon" prop="icon">
            <span v-if="isViewMode">{{ formModel.icon }}</span>
            <a-input v-else placeholder="Icon" v-model="formModel.icon"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">

        <a-col :span="12">
          <a-form-model-item label="所属应用" prop="applicationId" has-feedback>
            <span v-if="isViewMode">{{ formModel.applicationName }}</span>
            <application-select :disabled="isAddChildrenMode" v-else
                                v-model="formModel.applicationId"></application-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="排序" prop="sequence">
            <span v-if="isViewMode">{{ formModel.sequence }}</span>
            <a-input v-else v-model="formModel.sequence" type="number"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-model-item label="路由类型" prop="type">
            <span v-if="isViewMode">{{ getRouteTypeDesc(formModel.type) }}</span>
            <a-radio-group v-else v-model="formModel.type" name="radioGroup">
              <a-radio-button v-for="item in routeTypeOptions"
                              :key="item.value"
                              :value="item.value">{{ item.desc }}
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="状态" prop="status" required>
            <span v-if="isViewMode">{{ getRouteStatusDesc(formModel.status) }}</span>
            <a-radio-group v-else name="radioGroup" v-model="formModel.status" :default-value="1">
              <a-radio-button v-for="item in routeStatusOptions"
                              :key="item.value"
                              :value="item.value">{{ item.desc }}
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-model-item v-if="isMenuType" label="是否隐藏子路由" prop="hideChildren">
            <template v-if="isViewMode">
              <span>{{ getRouteHideChildrenDesc(formModel.hideChildren) }}</span>
            </template>
            <a-switch v-else checked-children="是" un-checked-children="否" v-model="formModel.hideChildren"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <!-- 页面元素表格 -->
    <permission-page-element-table v-if="!isMenuType"
                                   :table-editable="!isViewMode"
                                   ref="elementTable"
                                   :element-data="formModel.elements"/>

  </a-modal>
</template>

<script>

import {updateRoute, addRoute} from '@/api/route-api'
import RouteComponentSelect from "./RouteComponentSelect";
import ApplicationSelect from "./ApplicationSelect";
import PermissionPageElementTable from "./PermissionPageElementTable";

const ROUTE_TYPE_MENU = 1
const ROUTE_TYPE_PAGE = 2

const ROUTE_STATUS_ENABLE = 1
const ROUTE_STATUS_DISABLE = 2

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';
const FORM_MODE_ADD_CHILDREN = 'addChildren';
const FORM_MODE_VIEW = 'view';

const defaultModel = {
  id: '',
  name: '',
  code: '',
  component: '',
  pid: 0,
  status: 1,
  icon: '',
  applicationId: 0,
  sequence: 0,
  hideChildren: false,
  elements: [],
  type: ROUTE_TYPE_MENU
}

const routeTypeOptions = [
  {value: ROUTE_TYPE_MENU, desc: '菜单路由'},
  {value: ROUTE_TYPE_PAGE, desc: '页面路由'}
]

const routeStatusOptions = [
  {value: ROUTE_STATUS_ENABLE, desc: '启用'},
  {value: ROUTE_STATUS_DISABLE, desc: '禁用'}
]

export default {
  name: 'PermissionRouteAddForm',
  components: {
    RouteComponentSelect,
    PermissionPageElementTable,
    ApplicationSelect
  },
  props: {
    routes: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  data() {
    return {
      confirmLoading: false,
      checkedType: ROUTE_TYPE_MENU,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 10},
      formModel: Object.assign({}, defaultModel),
      mode: FORM_MODE_EDIT,
      form: {},
      routesOptionsDefaultValue: [],
      routeTypeOptions,
      routeStatusOptions,
      rules: {
        name: [{required: true, message: '请输入路由名称', trigger: 'blur'}],
        code: [{required: true, message: '请输入路由编码', trigger: 'blur'}],
        status: [{required: true, message: '请选择路由状态', trigger: 'blur'}],
        type: [{required: true, message: '请选择路由类型', trigger: 'blur'}],
        component: [{required: true, message: '请输入路由组件', trigger: 'blur'}],
        hideChildren: [{required: true, message: '', trigger: 'blur'}],
      }
    }
  },
  computed: {
    isMenuType() {
      return this.formModel.type === ROUTE_TYPE_MENU;
    },
    formTitle() {
      let title = '路由';
      switch (this.mode) {
        case FORM_MODE_EDIT:
          title = '编辑' + title;
          break;
        case FORM_MODE_ADD:
          title = '新建' + title;
          break;
        case FORM_MODE_VIEW:
          title = '查看' + title;
          break;
      }
      return title;
    },
    isViewMode() {
      return this.mode === FORM_MODE_VIEW
    },
    isAddChildrenMode() {
      return this.mode === FORM_MODE_ADD_CHILDREN;
    },
  },
  methods: {
    getRouteTypeDesc(value) {
      return this.routeTypeOptions.find(item => item.value === value).desc
    },
    getRouteStatusDesc(value) {
      return this.routeStatusOptions.find(item => item.value === value).desc
    },
    getRouteHideChildrenDesc(value) {
      return value === 0 ? '否' : '是'
    },
    isEditMode() {
      return this.mode === FORM_MODE_EDIT
    },
    onSelectRouteChange(value, selectedOptions) {
      this.formModel.pid = value[value.length - 1]
    },
    stringArrConvertToNumberArr: function () {
      return this.formModel.levelPath.split('.').map(item => +item);
    },
    open(formModel, mode = FORM_MODE_ADD) {
      this.visible = true
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
        if (this.formModel.levelPath) {
          this.routesOptionsDefaultValue = this.stringArrConvertToNumberArr(this.formModel.levelPath.split('.'))
        }
      }
      this.mode = mode
    },
    close() {
      if (this.$refs['elementTable']) {
        this.$refs['elementTable'].reset()
      }
      this.closeConfirmLoading()
      this.visible = false
      this.resetForm()
    },
    resetForm() {
      this.formModel = Object.assign({}, defaultModel)
      this.routesOptionsDefaultValue = []
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function () {
      this.toggleConfirmLoading()
      this.$emit('success', '')
      this.close()
    },
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
    closeConfirmLoading() {
      this.confirmLoading = false
    },
    submitForm() {
      if (this.isViewMode) {
        this.handleClose()
        return
      }
      const $form = this.$refs['form'];
      $form.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.formModel.pid = this.formModel.pid || 0
        if (this.$refs['elementTable']) {
          this.formModel.elements = this.$refs['elementTable'].data
        }
        if (!this.checkElementsIsValid()) {
          return false
        }
        this.toggleConfirmLoading()
        if (this.mode === FORM_MODE_ADD || this.mode === FORM_MODE_ADD_CHILDREN) {
          addRoute(this.formModel)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          updateRoute(this.formModel)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        }
      });
    },
    checkElementsIsValid() {
      if (!this.formModel.elements || this.formModel.elements.length === 0) {
        return true
      }
      let f = true;
      const els = this.formModel.elements
      for (let i = 0; i < els.length; i++) {
        const item = els[i]
        if (!item.name || item.editable) {
          item.showError = true
          f = false
        }
      }
      return f;
    }
  },
  created() {
  }
}
</script>
