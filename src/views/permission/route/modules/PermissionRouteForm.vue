<template>

  <a-modal
    :width="830"
    v-model="visible"
    title="新建路由"
    ok-text="确认"
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
            <a-input placeholder="路由名称" v-model="formModel.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="路由编码" prop="code" has-feedback>
            <a-input placeholder="路由编码（格式 一级路由:二级路由:三级路由:...）" v-model="formModel.code"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-model-item label="路由组件" prop="component" has-feedback>
            <route-component-select v-model="formModel.component"></route-component-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="路由地址" prop="path" has-feedback>
            <a-input v-model="formModel.path"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-model-item label="所属路由" prop="pid" has-feedback>
            <a-cascader popupPlacement="bottomLeft"
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
            <a-input placeholder="Icon" v-model="formModel.icon"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-model-item label="排序" prop="sequence">
            <a-input v-model="formModel.sequence" type="number"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="状态" prop="status" required>
            <a-radio-group name="radioGroup" v-model="formModel.status" :default-value="1">
              <a-radio-button :value="1">启用</a-radio-button>
              <a-radio-button :value="2">禁用</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-model-item label="路由类型" prop="type">
            <a-radio-group v-model="formModel.type" name="radioGroup">
              <a-radio-button v-for="item in routeTypeOptions"
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
            <a-switch checked-children="是" un-checked-children="否" v-model="formModel.hideChildren"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <!-- 页面元素 -->
    <permission-page-element-table ref="elementTable" :element-data="formModel.elements"/>

  </a-modal>
</template>

<script>

import {updateRoute, addRoute} from '@/api/route-api'
import RouteComponentSelect from "./RouteComponentSelect";
import PermissionPageElementTable from "./PermissionPageElementTable";

const ROUTE_TYPE_MENU = 1
const ROUTE_TYPE_PAGE = 2

const defaultModel = {
  id: '',
  name: '',
  code: '',
  component: '',
  pid: 0,
  status: 1,
  icon: '',
  sequence: 0,
  hideChildren: false,
  elements: [],
  type: ROUTE_TYPE_MENU
}

const routeTypeOptions = [
  {value: ROUTE_TYPE_MENU, desc: '菜单路由'},
  {value: ROUTE_TYPE_PAGE, desc: '页面路由'}
]

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

export default {
  name: 'PermissionRouteAddForm',
  components: {
    RouteComponentSelect,
    PermissionPageElementTable
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
      type: FORM_MODE_EDIT,
      form: {},
      routesOptionsDefaultValue: [],
      routeTypeOptions,
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
    }
  },
  methods: {
    onSelectRouteChange(value, selectedOptions) {
      this.formModel.pid = value[value.length - 1]
    },
    stringArrConvertToNumberArr: function () {
      return this.formModel.levelPath.split('.').map(item => +item);
    },
    open(formModel, type = FORM_MODE_ADD) {
      this.visible = true
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
        if (this.formModel.levelPath) {
          this.routesOptionsDefaultValue = this.stringArrConvertToNumberArr(this.formModel.levelPath.split('.'))
        }
      }
      this.type = type
    },
    close() {
      this.$refs['elementTable'].reset()
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
    afterSuccess: function ($form) {
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
      const $form = this.$refs['form'];
      $form.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.toggleConfirmLoading()
        this.formModel.pid = this.formModel.pid || 0
        this.formModel.elements = this.$refs['elementTable'].data
        if (this.type === FORM_MODE_ADD) {
          addRoute(this.formModel)
            .then(({data}) => this.afterSuccess($form))
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          updateRoute(this.formModel)
            .then(({data}) => this.afterSuccess($form))
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        }
      });
    },
  },
  created() {
  }
}
</script>
