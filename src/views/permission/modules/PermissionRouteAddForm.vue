<template>

  <a-modal style="width: 1000px"
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
      ref="ruleForm"
      :model="formModel"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">

      <a-form-model-item ref="name" label="路由名称" prop="name" required has-feedback>
        <a-input v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="路由编码" prop="code" required has-feedback>
        <a-input v-model="formModel.code"/>
      </a-form-model-item>

      <a-form-model-item label="所属路由" prop="pid" has-feedback>
        <a-cascader popupPlacement="bottomLeft"
                    :changeOnSelect="true"
                    :options="routes"
                    :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                    placeholder="请选择所属路由"
                    :default-value="routesOptionsDefaultValue"
                    @change="onSelectRouteChange"/>
      </a-form-model-item>

      <a-form-model-item label="Icon" prop="icon">
        <a-input v-model="formModel.icon"/>
      </a-form-model-item>

      <a-form-model-item label="路由类型" has-feedback required>
        <a-radio-group v-model="checkedType" name="radioGroup" :default-value="'menu'">
          <a-radio-button value="menu">菜单路由</a-radio-button>
          <a-radio-button value="page">页面路由</a-radio-button>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item label="状态" prop="status" required>
        <a-radio-group name="radioGroup" v-model="formModel.status" :default-value="1">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item v-if="isPageType" label="路由组件" prop="component" has-feedback required>
        <a-input v-model="formModel.component"/>
      </a-form-model-item>

      <a-form-model-item v-if="isPageType" label="路由路径" prop="path" has-feedback required>
        <a-input v-model="formModel.path"/>
      </a-form-model-item>

      <a-form-model-item label="排序" prop="sequence">
        <a-input v-model="formModel.sequence" type="number"/>
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submitForm('ruleForm')">
          确认
        </a-button>
        <a-button style="margin-left: 10px;" @click="handleClose">
          关闭
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

import {updateRoute, addRoute} from '@/api/route-api'

export default {
  name: 'PermissionRouteAddForm',
  props: {
    routes: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  data() {
    return {
      checkedType: 'menu',
      visible: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      formModel: {
        id: '',
        name: '',
        code: '',
        component: '',
        pid: 0,
        status: 1,
        icon: '',
        sequence: 0
      },
      type: 'edit',
      form: {},
      routesOptionsDefaultValue: [],
      rules: {
        name: [{required: true, message: '请输入路由名称', trigger: 'change'}],
        code: [{required: true, message: '请输入路由编码', trigger: 'change'}],
        status: [{required: true, message: '请选择路由状态', trigger: 'change'}],
        component: [{required: true, message: '请输入路由组件', trigger: 'change'}],
        path: [{required: true, message: '请选择路由状态', trigger: 'change'}],
      }
    }
  },
  computed: {
    isPageType() {
      return this.checkedType === 'page';
    }
  },
  methods: {
    onSelectRouteChange(value, selectedOptions) {
      this.formModel.pid = value[value.length - 1]
    },
    stringArrConvertToNumberArr: function () {
      return this.formModel.levelPath.split('.').map(item => +item);
    }, open(formModel, type = 'add') {
      this.visible = true
      if (formModel) {
        this.formModel = formModel
      }
      this.type = type
      this.routesOptionsDefaultValue = this.stringArrConvertToNumberArr(this.formModel.levelPath.split('.'))
    },
    close() {
      this.visible = false
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function ($form) {
      $form.resetFields()
      this.$emit('success', '')
      this.close()
    },
    submitForm(formName) {
      const $form = this.$refs[formName];
      $form.validate(async valid => {
        if (!valid) {
          return false;
        }
        if (this.type === 'add') {
          await addRoute(this.formModel)
            .then(({data}) => {
            })
            .catch(e => {
            })
            .finally(() => this.afterSuccess($form))
        } else {
          await updateRoute(this.formModel)
            .then(({data}) => {
            })
            .catch(e => {
            })
            .finally(() => this.afterSuccess($form))
        }
      });
    },
  },
  created() {
    console.log(this.routes)
  }
}
</script>
