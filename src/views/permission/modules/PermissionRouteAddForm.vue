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
      v-if="form"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-model-item ref="name" label="路由名称" prop="name" required has-feedback>
        <a-input v-model="form.name"/>
      </a-form-model-item>
      <a-form-model-item label="路由编码" prop="code" required has-feedback>
        <a-input v-model="form.code"/>
      </a-form-model-item>
      <a-form-model-item label="所属路由" prop="pid" has-feedback>
        <a-cascader popupPlacement="bottomLeft"
                    :changeOnSelect="true"
                    :options="routes"
                    :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                    placeholder="请选择所属路由"
                    @change="onChange"/>
        <!--        <a-input v-model="form.pid"/>-->
        <!--        <a-dropdown>-->
        <!--          <a-input v-model="form.pid"/>-->
        <!--          <a-menu slot="overlay">-->
        <!--            <a-menu-item v-for="item in routes"-->
        <!--              @click="handleClickMenu(item)">{{ item.name }}</a-menu-item>-->
        <!--            <a-menu-item>2nd menu item</a-menu-item>-->
        <!--            <a-sub-menu @titleClick="handleClickMenu" @click="handleClickMenu" key="test" title="sub menu">-->
        <!--              <a-menu-item>3rd menu item</a-menu-item>-->
        <!--              <a-menu-item>4th menu item</a-menu-item>-->
        <!--            </a-sub-menu>-->
        <!--            <a-sub-menu title="disabled sub menu" disabled>-->
        <!--              <a-menu-item>5d menu item</a-menu-item>-->
        <!--              <a-menu-item>6th menu item</a-menu-item>-->
        <!--            </a-sub-menu>-->
        <!--          </a-menu>-->
        <!--        </a-dropdown>-->
      </a-form-model-item>
      <a-form-model-item label="Icon" prop="icon">
        <a-input v-model="form.icon"/>
      </a-form-model-item>
      <a-form-model-item label="路由类型">
        <a-radio-group name="radioGroup" :default-value="'menu'" @change="handleTypeRadioChange">
          <a-radio-button value="menu">菜单路由</a-radio-button>
          <a-radio-button value="page">页面路由</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="组件" prop="component" has-feedback>
        <a-input v-model="form.component"/>
      </a-form-model-item>
      <a-form-model-item label="路径" prop="path">
        <a-input v-model="form.path"/>
      </a-form-model-item>
      <a-form-model-item label="状态" prop="status" required>
        <a-radio-group name="radioGroup" v-model="form.status" :default-value="1">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="排序" prop="sequence">
        <a-input v-model="form.sequence" type="number"/>
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

import {getRouteTree} from '@/api/route'

export default {
  name: 'PermissionRouteAddForm',
  props: {},
  data() {
    return {
      routes: [],
      visible: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: {},
      rules: {
        name: [{required: true, message: '请输入路由名称', trigger: 'change'}],
        code: [{required: true, message: '请输入路由编码', trigger: 'change'}],
        status: [{required: true, message: '请选择路由状态', trigger: 'change'}],
      }
    }
  },
  methods: {
    handleTypeRadioChange(e) {
      if (e.target.value = 'page') {

      } else {

      }
    },
    onChange(value, selectedOptions) {
      this.form.pid = value[value.length - 1]
    },
    handleClickMenu(item, key, keyPath) {
      console.log(item)
    },
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.$emit('success', '')
        this.close()
      });
    },
    async initRouteTree() {
      const {data} = await getRouteTree();
      this.routes = data.routes
    }
  },
  created() {
    console.log('init')
    this.initRouteTree()
  }
}
</script>
