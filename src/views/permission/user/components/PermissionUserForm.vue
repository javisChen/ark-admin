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

      <a-form-model-item label="手机号码" prop="mobile" has-feedback>
        <a-input :disabled="isEditMode" placeholder="手机号码（11位）" v-model="formModel.mobile"/>
      </a-form-model-item>

      <a-form-model-item label="用户名称" prop="username" has-feedback>
        <a-input placeholder="用户名称" v-model="formModel.username"/>
      </a-form-model-item>

      <a-form-model-item label="用户密码" prop="password" has-feedback>
        <a-input type="password" placeholder="用户密码（6~18位，数字字母0-9A-Za-z）" v-model="formModel.password"/>
      </a-form-model-item>

      <a-form-model-item label="拥有角色" prop="roleIds">
        <role-select v-model="formModel.roleIds"/>
      </a-form-model-item>

      <a-form-model-item label="所属用户组" prop="userGroupIds">
        <user-group-select v-model="formModel.userGroupIds"/>
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

import {addUser, updateUser} from '@/api/iam/user-api'
import {getAllUserGroups} from "@/api/iam/usergroup-api";
import RoleSelect from "@/views/permission/role/components/RoleSelect";
import UserGroupSelect from "@/views/permission/usergroup/components/UserGroupSelect";


const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';

const defaultModel = {
  id: '',
  username: '',
  mobile: '',
  password: '88888888',
  status: 1,
  roleIds: [],
  userGroupIds: [],
}

export default {
  name: 'PermissionUserForm',
  components: {UserGroupSelect, RoleSelect},
  props: {},
  data() {
    return {
      confirmLoading: false,
      mode: FORM_MODE_ADD,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      formModel: {...defaultModel},
      form: {},
      rules: {
        username: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {min: 8, max: 20, message: '请将密码设置为8-20位，并且由字母，数字和符号两种以上组合', trigger: 'blur'}
        ],
        mobile: [
          {type: 'string', len: 11, required: true, message: '请输入11位的手机号码', trigger: 'blur'},
        ],
        status: [{required: true, message: '请选择用户状态', trigger: 'blur'}],
      }
    }
  },
  created() {
  },
  computed: {
    isEditMode() {
      return this.mode === FORM_MODE_EDIT
    },
  },
  methods: {
    handleRoleOptionsChange(value) {
      this.formModel.roleIds = value
    },
    handleUserGroupOptionsChange(value) {
      this.formModel.userGroupIds = value
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
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          delete form.mobile;
          updateUser(form)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        }
      });
    },
  }
}
</script>
