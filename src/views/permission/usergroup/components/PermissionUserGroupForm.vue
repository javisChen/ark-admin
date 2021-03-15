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

      <a-form-model-item label="用户组名称" prop="name" has-feedback>
        <a-input placeholder="用户组名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item label="所属用户组" prop="pid" has-feedback>
        <a-cascader popupPlacement="bottomLeft"
                    :changeOnSelect="true"
                    :options="userGroups"
                    :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                    placeholder="请选择上级用户组"
                    :default-value="userGroupsOptionsDefaultValue"
                    @change="onSelectUserGroupsChange"/>
      </a-form-model-item>

      <a-form-model-item label="拥有角色" prop="pid" has-feedback>
        <role-select v-model="formModel.roleIds"/>
      </a-form-model-item>

      <a-form-model-item label="用户组类型" prop="type" required>
        <a-select
          v-model="formModel.type"
          :allowClear="true"
          placeholder="用户组类型"
        >
          <a-select-option v-for="(value) in typeOptions" :key="value.value" :value="value.value">
            {{ value.desc }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="继承类型" prop="inheritType" required>
        <a-select
          v-model="formModel.inheritType"
          :allowClear="true"
          placeholder="继承类型"
        >
          <a-select-option v-for="(value) in inheritTypeOptions" :key="value.value" :value="value.value">
            {{ value.desc }}
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

import {addUserGroup, updateUserGroup} from '@/api/usergroup-api'
import RoleSelect from "@/views/permission/role/components/RoleSelect";
import {inheritTypeOptions, typeOptions} from "../dictionary";
import {parseLevelPath} from "@/utils/util";

const FORM_MODE_EDIT = 'edit';
const FORM_MODE_ADD = 'add';


const defaultModel = {
  id: '',
  name: '',
  status: 1,
  pid: 0,
  inheritType: 0,
  type: 1,
  roleIds: []
}

export default {
  name: 'PermissionUserGroupForm',
  components: {
    RoleSelect
  },
  props: {
    userGroups: {
      type: Array,
      required: true,
      default: () => []
    },},
  data() {
    return {
      typeOptions,
      inheritTypeOptions,
      confirmLoading: false,
      mode: FORM_MODE_ADD,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      formModel: Object.assign({}, defaultModel),
      form: {},
      rules: {
        name: [{required: true, message: '请输入用户组名称', trigger: 'blur'}],
        status: [{required: true, message: '请选择用户组状态', trigger: 'blur'}],
      },
      userGroupsOptionsDefaultValue: []
    }
  },
  computed: {
    isEditMode() {
      return this.mode === FORM_MODE_EDIT
    }
  },
  methods: {

    closeConfirmLoading() {
      this.confirmLoading = false
    },
    toggleConfirmLoading() {
      this.confirmLoading = !this.confirmLoading
    },
    onSelectUserGroupsChange(value, selectedOptions) {
      this.formModel.pid = value[value.length - 1]
    },
    open(formModel, mode = FORM_MODE_ADD) {
      this.visible = true
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
        if (this.formModel.levelPath) {
          this.userGroupsOptionsDefaultValue = parseLevelPath(this.formModel.levelPath)
        }
      }
      this.mode = mode
    },
    close() {
      this.confirmLoading = false
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
    submitForm() {
      const $form = this.$refs['form'];
      $form.validate(async valid => {
        if (!valid) {
          return false;
        }
        const form = Object.assign({}, this.formModel)
        this.toggleConfirmLoading()
        if (this.mode === FORM_MODE_ADD) {
          addUserGroup(form)
            .then(({data}) => this.afterSuccess())
            .catch(e => e)
            .finally(() => this.closeConfirmLoading())
        } else {
          updateUserGroup(form)
            .then(({data}) => this.afterSuccess())
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
