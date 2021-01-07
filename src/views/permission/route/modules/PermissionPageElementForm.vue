<template>

  <a-modal
    :centered="true"
    v-model="visible"
    title="新建路由"
    ok-text="确认"
    :confirmLoading="true"
    :destroyOnClose="true"
    :footer="null"
    :closable="true"
    @cancel="handleClose"
    cancel-text="取消">

    <a-form-model
      v-if="formModel"
      ref="form"
      :model="formModel"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">

      <a-form-model-item ref="name" label="元素名称" prop="name" has-feedback>
        <a-input placeholder="元素名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="元素类型" prop="pid" has-feedback>
        <a-select
          :value="value"
          @change="handleChange"
          :allowClear="true"
          show-search
          placeholder="请选择元素类型"
          option-filter-prop="children"
          style="width: 200px"
        >
          <a-select-option v-for="(key, value) in routerComponents" :key="value" :value="value">
            {{ value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submitForm()">确认</a-button>
        <a-button style="margin-left: 10px;" @click="handleClose">关闭</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

import {updateRoute, addRoute} from '@/api/route-api'


const ELEMENT_TYPE_DIV = 2
const ELEMENT_TYPE_BUTTON = 1

const defaultModel = {
  id: '',
  name: '',
  type: ELEMENT_TYPE_BUTTON
}

const routeTypeOptions = [
  {value: ELEMENT_TYPE_BUTTON, desc: '按钮'},
  {value: ELEMENT_TYPE_DIV, desc: 'DIV'}
]

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

export default {
  name: 'PermissionPageElementForm',
  components: {
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
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 14},
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
      console.log(formModel)
      this.visible = true
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
        console.log(this.formModel)
        if (this.formModel.levelPath) {
          this.routesOptionsDefaultValue = this.stringArrConvertToNumberArr(this.formModel.levelPath.split('.'))
        }
      }
      this.type = type
    },
    close() {
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
      this.$emit('success', '')
      this.close()
    },
    submitForm() {
      const $form = this.$refs['form'];
      $form.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.formModel.pid = this.formModel.pid || 0
        if (this.type === FORM_MODE_ADD) {
          addRoute(this.formModel)
            .then(({data}) => this.afterSuccess($form))
            .catch(e => e)
            .finally()
        } else {
          updateRoute(this.formModel)
            .then(({data}) => this.afterSuccess($form))
            .catch(e => e)
            .finally()
        }
      });
    },
  },
  created() {
  }
}
</script>
