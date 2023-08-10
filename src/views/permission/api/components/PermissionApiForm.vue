<template>

  <a-modal style="width: 1000px"
           :centered="true"
           v-model="visible"
           :title="formTitle"
           ok-text="确认"
           :confirmLoading="confirmLoading"
           :destroyOnClose="true"
           :closable="true"
           @ok="submitForm"
           @cancel="handleClose"
           cancel-text="取消">

    <a-form-model
      v-if="formModel"
      ref="form"
      :model="formModel"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">

      <a-form-model-item label="所属应用" prop="method">
        <application-select v-model="formModel.applicationId"/>
      </a-form-model-item>

      <a-form-model-item label="所属分类" prop="categoryId">
        <a-select
          v-model="formModel.categoryId"
          :allowClear="true"
          show-search
          placeholder="所属分类"
          option-filter-prop="children"
          :filter-option="filterOption">
          <a-select-option v-for="(value, index) in categoryOptions"
                           :key="index" :value="value.id">
            {{ value.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="接口名称" prop="name" has-feedback>
        <a-input placeholder="接口名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="接口Url" prop="url" has-feedback>
        <a-input placeholder="接口Url" v-model="formModel.url"/>
      </a-form-model-item>

      <a-form-model-item label="Method" prop="method">
        <a-select
          v-model="formModel.method"
          :allowClear="true"
          show-search
          placeholder="请选择接口方法"
          option-filter-prop="children"
          :filter-option="filterOption">
          <a-select-option v-for="(value, index) in methodOptions"
                           :key="index" :value="value.value">
            {{ value.desc }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="认证授权类型" prop="userGroupIds">
        <a-select
          v-model="formModel.authType"
          :allowClear="true"
          show-search
          placeholder="认证授权类型"
          option-filter-prop="children"
          :filter-option="filterOption">
          <a-select-option v-for="(item) in authTypeOptions"
                           :key="item.value" :value="item.value">
            <span>{{ item.desc }}</span>
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="状态" prop="status" required>
        <a-radio-group name="radioGroup" v-model="formModel.status" :default-value="1">
          <a-radio v-for="item in routeStatusOptions" :value="item.value">{{ item.desc }}</a-radio>
        </a-radio-group>
      </a-form-model-item>

    </a-form-model>
  </a-modal>
</template>

<script>

import {addApi, updateApi} from '@/api/iam/api-api'
import {getApplications} from "@/api/iam/application-api";
import {authTypeOptions, methodOptions, routeStatusOptions} from "../variable";
import ApplicationSelect from "@/views/permission/application/components/ApplicationSelect";

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

const defaultModel = {
  id: '',
  name: '',
  url: '',
  method: 'GET',
  authType: 1,
  status: 1,
  applicationId: '1',
  categoryId: '1',
}

export default {
  name: 'PermissionApiForm',
  components: {ApplicationSelect},
  props: {
    applicationId: {
      type: String,
      required: false
    },
    categories: {
      type: Array,
      required: false,
      default: []
    },
  },
  data() {
    return {
      categoryOptions: [],
      methodOptions,
      routeStatusOptions,
      authTypeOptions,
      applicationsOptions: [],
      confirmLoading: false,
      mode: FORM_MODE_ADD,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      formModel: {...defaultModel},
      form: {},
      rules: {
        name: [{required: true, message: '请输入接口名称', trigger: 'blur'}],
        url: [{required: true, message: '请输入接口Url', trigger: 'blur'}],
        method: [{required: true, message: '请输入接口Method', trigger: 'blur'}],
        status: [{required: true, message: '请选择接口状态', trigger: 'blur'}],
        categoryId: [
          {type: 'number', required: true, message: '请选择接口分类', trigger: 'blur'},
          {type: 'number',min: 1, message: '请选择接口分类'}
        ],
      }
    }
  },
  created() {
  },
  watch: {
    applicationId(val) {
      this.formModel.applicationId = val
    },
    categories(val) {
      this.categoryOptions = this.$cloneDeep(val)
      if (this.categoryOptions.length === 0) {
        this.categoryOptions = [{id: 0, name: '没有可选分类，请先添加分类'}]
      }
      return this.categoryOptions
    }
  },
  computed: {},
  methods: {
    formTitle() {
      let title = '接口';
      switch (this.mode) {
        case FORM_MODE_EDIT:
          title = '编辑' + title;
          break;
        case FORM_MODE_ADD:
          title = '新建' + title;
          break;
      }
      return title;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
    open(formModel, mode = FORM_MODE_ADD) {
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
      }
      this.mode = mode
      this.visible = true
    },
    close() {
      this.confirmLoading = false
      this.visible = false
      this.resetForm()
    },
    resetForm() {
      this.formModel = {...defaultModel}
    },
    handleClose() {
      this.close()
      this.$emit('cancel', '')
    },
    afterSuccess: function ($form) {
      this.$emit('success', '')
      this.close()
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
        const form = {...this.formModel}
        this.toggleConfirmLoading()
        if (this.mode === FORM_MODE_ADD) {
          addApi(form)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          delete form.phone;
          updateApi(form)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        }
      });
    },
  }
}
</script>
