<template>

  <a-modal style="width: 1000px"
           :centered="true"
           v-model="visible"
           title="新建用户"
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

      <a-form-model-item label="手机号码" prop="phone" has-feedback>
        <a-input :disabled="isEditMode" placeholder="手机号码（11位）" v-model="formModel.phone"/>
      </a-form-model-item>

      <a-form-model-item label="用户名称" prop="name" has-feedback>
        <a-input placeholder="用户名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="用户密码" prop="password" has-feedback>
        <a-input type="password" placeholder="用户密码（6~18位，数字字母0-9A-Za-z）" v-model="formModel.password"/>
      </a-form-model-item>

      <a-form-model-item label="所属角色" prop="password" has-feedback>
        <a-select
          :value="formModel.roleIds"
          mode="multiple"
          @change="handleRoleOptionsChange"
          :allowClear="true"
          show-search
          placeholder="请选择角色"
          option-filter-prop="children"
          :filter-option="filterOption">
          <a-select-option v-for="(value, index) in roleOptions"
                           :key="index" :value="value.id">
            {{ value.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="所属用户组" prop="password" has-feedback>
        <a-select
          :value="formModel.userGroupIds"
          mode="multiple"
          @change="handleUserGroupOptionsChange"
          :allowClear="true"
          show-search
          placeholder="请选择用户组"
          option-filter-prop="children"
          :filter-option="filterOption">
          <a-select-option v-for="(value, index) in userGroupOptions"
                           :key="index" :value="value.id">
            <span>{{ value.name }} <a href="#">({{getLevelDesc(value.level) + '级'}})</a></span>
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="状态" prop="status" required>
        <a-radio-group name="radioGroup" v-model="formModel.status" :default-value="1">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-model-item>

    </a-form-model>
  </a-modal>
</template>

<script>

import md5 from 'md5'

import {addUser, updateUser} from '@/api/user-api'
import {getAllRoles} from "@/api/role-api";
import {getAllUserGroups} from "@/api/usergroup-api";


const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

const defaultModel = {
  id: '',
  name: '',
  phone: '',
  password: '88888888',
  status: 1,
  roleIds: [],
  userGroupIds: [],
}

const levelDict = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
}

export default {
  name: 'PermissionUserForm',
  components: {},
  props: {},
  data() {
    return {
      roleOptions: [],
      userGroupOptions: [],
      confirmLoading: false,
      mode: FORM_MODE_ADD,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      formModel: {...defaultModel},
      form: {},
      rules: {
        name: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {min: 8, max: 20, message: '请将密码设置为8-20位，并且由字母，数字和符号两种以上组合', trigger: 'blur'}
        ],
        phone: [
          {type: 'string', len: 11, required: true, message: '请输入11位的手机号码', trigger: 'blur'},
        ],
        status: [{required: true, message: '请选择用户状态', trigger: 'blur'}],
      }
    }
  },
  created() {
    this.loadRoleOptions()
    this.loadUserGroupOptions()
  },
  computed: {
    isEditMode() {
      return this.mode === FORM_MODE_EDIT
    },
    filteredRoleOptions() {
      console.log('this.formModel.roleIds', this.formModel.roleIds)
      var filter = this.roleOptions.filter(o => !this.formModel.roleIds.includes(o.id));
      console.log('filter', filter)
      return filter;
    },
    filteredUserGroupOptions() {
      return this.userGroupOptions.filter(o => !this.formModel.userGroupIds.includes(o.id));
    },
  },
  methods: {
    getLevelDesc(value) {
      return levelDict[value]
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    handleRoleOptionsChange(value) {
      this.formModel.roleIds = value
    },
    handleUserGroupOptionsChange(value) {
      this.formModel.userGroupIds = value
    },
    loadRoleOptions() {
      getAllRoles()
        .then(({data}) => {
          this.roleOptions = data
          console.log('this.roleOptions', this.roleOptions)
        })
    },
    loadUserGroupOptions() {
      getAllUserGroups()
        .then(({data}) => {
          this.userGroupOptions = data
        })
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
        form.password = md5(form.password)
        this.toggleConfirmLoading()
        if (this.mode === FORM_MODE_ADD) {
          addUser(form)
            .then(({data}) => this.afterSuccess($form))
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          delete form.phone;
          updateUser(form)
            .then(({data}) => this.afterSuccess($form))
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        }
      });
    },
  }
}
</script>
