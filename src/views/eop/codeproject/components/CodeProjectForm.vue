<template>

  <a-drawer
    :title="formTitle"
    :width="600"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleClose"
  >

    <a-form-model
      layout="horizontal"
      v-if="formModel"
      ref="form"
      :model="formModel"
      :rules="rules"
      :label-col="{span: 5}"
      :wrapper-col="{span: 19}">

      <a-form-model-item ref="name" label="工程名称" prop="name" has-feedback>
        <span v-if="isViewMode">{{ formModel.name }}</span>
        <a-input v-else placeholder="工程名称" v-model="formModel.name"/>
      </a-form-model-item>

      <a-form-model-item ref="code" label="工程编码" prop="code" has-feedback>
        <span v-if="isViewMode">{{ formModel.code }}</span>
        <a-input @change="onCodeChange($event)" v-else placeholder="工程编码" v-model="formModel.code"/>
      </a-form-model-item>

      <a-form-model-item ref="description" label="描述" prop="description">
        <span v-if="isViewMode">{{ formModel.description }}</span>
        <a-input v-else placeholder="描述" v-model="formModel.description"/>
      </a-form-model-item>

      <a-form-model-item ref="type" label="应用类型" prop="type">
        <span v-if="isViewMode">{{ formModel.type }}</span>
        <a-radio-group v-else v-model="formModel.type" name="radioGroup">
          <a-radio v-for="item in typeOptions"
                   :key="item.value"
                   :value="item.value">{{ item.desc }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item v-if="!isViewMode" ref="reposSource" label="仓库来源" prop="reposSource">
        <a-radio-group v-model="formModel.reposSource" name="radioGroup">
          <a-radio v-for="item in reposSourceOptions"
                   :key="item.value"
                   :value="item.value">{{ item.desc }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item v-if="!isViewMode" ref="generateMode" label="源码生成方式" prop="generateMode">
        <a-radio-group v-model="formModel.generateMode" name="radioGroup">
          <a-radio v-for="item in generateModeOptions"
                   :key="item.value"
                   :value="item.value">{{ item.desc }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item label="脚手架" prop="scaffold">
        <span v-if="isViewMode">{{ formModel.scaffold }}</span>
        <a-select v-else placeholder="请选择" :default-value="1">
          <a-select-option v-for="item in scaffoldOptions"
                           :key="item.value"
                           :value="item.value">
            {{ item.desc }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item v-if="isViewMode" label="仓库地址">
        <a :href="formModel.gitHtmlUrl">{{ formModel.gitHtmlUrl }}</a>
      </a-form-model-item>

      <template v-if="!isViewMode">
        <a-form-model-item ref="springCloud.artifactId" label="artifactId" prop="springCloud.artifactId" has-feedback>
          <span v-if="isViewMode">{{ formModel.artifactId }}</span>
          <a-input disabled="disabled" v-else placeholder="示例（demo-service）"
                   v-model="formModel.springCloud.artifactId"/>
        </a-form-model-item>

        <a-form-model-item ref="springCloud.groupId" label="groupId" prop="springCloud.groupId" has-feedback>
          <span v-if="isViewMode">{{ formModel.groupId }}</span>
          <a-input v-else placeholder="示例（com.xxx.xxx）" v-model="formModel.springCloud.groupId"/>
        </a-form-model-item>

        <a-form-model-item ref="springCloud.packageName" label="package" prop="springCloud.packageName" has-feedback>
          <span v-if="isViewMode">{{ formModel.name }}</span>
          <a-input v-else placeholder="示例（com.xxx.xxx）" v-model="formModel.springCloud.packageName"/>
        </a-form-model-item>

        <a-form-model-item ref="springCloud.genDAOCode" label="生成数据层代码" prop="springCloud.genDAOCode" has-feedback>
          <span v-if="isViewMode">{{ formModel.generateMode }}</span>
          <a-radio-group v-else
                         v-model="formModel.springCloud.genDAOCode"
                         name="radioGroup">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item ref="springCloud.dsUsername" label="dsUsername" prop="springCloud.dsUsername" has-feedback>
          <span v-if="isViewMode">{{ formModel.name }}</span>
          <a-input v-else placeholder="User" v-model="formModel.springCloud.dsUsername"/>
        </a-form-model-item>


        <a-form-model-item ref="springCloud.dsPassword" label="dsPassword" prop="springCloud.dsPassword" has-feedback>
          <span v-if="isViewMode">{{ formModel.name }}</span>
          <a-input v-else placeholder="Password" v-model="formModel.springCloud.dsPassword"/>
        </a-form-model-item>

        <a-form-model-item ref="springCloud.dsUrl" label="dsUrl" prop="springCloud.dsUrl" has-feedback>
          <span v-if="isViewMode">{{ formModel.name }}</span>
          <a-input v-else placeholder="URL" v-model="formModel.springCloud.dsUrl"/>
        </a-form-model-item>

      </template>
    </a-form-model>
    <form-action-bar :handle-close="handleClose"
                     :submit-form="submitForm"
                     :confirm-loading="confirmLoading"/>
  </a-drawer>
</template>

<script>

import {createCodeProject} from '@/api/eop/code-project-api'
import FormActionBar from "@/views/eop/codeproject/components/FormActionBar";

const TYPE_BACKEND = 1
const TYPE_FRONT = 2

const FORM_MODE_ADD = 'add';
const FORM_MODE_VIEW = 'view';
const FORM_MODE_GET_CODE_PROJECT = 'get_code_project';

let defaultModel = {
  name: "",
  code: "",
  description: "",
  type: 1,
  scaffold: 1,
  createGitRepos: false,
  generateMode: 1,
  reposSource: 1,
  springCloud: {
    artifactId: "",
    groupId: "",
    packageName: "",
    dsUrl: "jdbc:mysql://localhost:3306/cop?useSSL=false&useUnicode=true&characterEncoding=UTF-8&tinyInt1isBit=false&serverTimezone=Asia/Shanghai&serverTimezone=UTC&allowPublicKeyRetrieval=True",
    dsUsername: "root",
    dsPassword: "Root1234!@#$",
    genDAOCode: 1,
  }
}

let realSubmitModel = {
  name: "",
  code: "",
  description: "",
  type: 1,
  scaffold: 1,
  createGitRepos: false,
  generateMode: 1,
  reposSource: 1,
  extProperties: ''
}

const typeOptions = [
  {value: TYPE_BACKEND, desc: '后端应用'},
  {value: TYPE_FRONT, desc: '前端应用'}
]

const reposSourceOptions = [
  {value: 1, desc: '创建新仓库'},
]

const generateModeOptions = [
  {value: 1, desc: '基于脚手架生成'},
]

const scaffoldOptions = [
  {value: 1, desc: 'SpringCloud'},
]

export default {
  name: 'CodeProjectForm',
  components: {FormActionBar},
  props: {},
  data() {
    return {
      confirmLoading: false,
      checkedType: TYPE_BACKEND,
      visible: false,
      labelCol: {span: 6},
      wrapperCol: {span: 10},
      formModel: {...defaultModel},
      mode: FORM_MODE_ADD,
      form: {},
      routesOptionsDefaultValue: [],
      typeOptions,
      reposSourceOptions,
      scaffoldOptions,
      generateModeOptions,
      rules: {
        name: [{required: true, message: '请输入工程名称', trigger: 'blur'}],
        code: [{required: true, message: '请输入工程编码', trigger: 'blur'}],
        status: [{required: true, message: '请选择路由状态', trigger: 'blur'}],
        type: [{required: true, message: '请选择路由类型', trigger: 'blur'}],
        generateMode: [{required: true, message: '请选择源码生成方式', trigger: 'blur'}],
        scaffold: [{required: true, message: '请选择脚手架', trigger: 'blur'}],
        reposSource: [{required: true, message: '请选择仓库来源', trigger: 'blur'}],
        'springCloud.artifactId': [{required: true, message: '请输入artifactId', trigger: 'blur'}],
        'springCloud.groupId': [{required: true, message: '请输入groupId', trigger: 'blur'}],
        'springCloud.packageName': [{required: true, message: '请输入packageName', trigger: 'blur'}],
        'springCloud.dsUrl': [{required: true, message: '请输入数据库连接', trigger: 'blur'}],
        'springCloud.dsUsername': [{required: true, message: '请输入数据库用户', trigger: 'blur'}],
        'springCloud.dsPassword': [{required: true, message: '请输入数据库密码', trigger: 'blur'}],
      }
    }
  },
  computed: {
    formTitle() {
      let title = '工程';
      switch (this.mode) {
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
  },
  methods: {
    onCodeChange(event) {
      this.formModel.springCloud.artifactId = event.target.value
    },
    onSelectRouteChange(value, selectedOptions) {
      this.formModel.pid = value[value.length - 1]
    },
    open(formModel, mode = FORM_MODE_ADD) {
      if (formModel) {
        this.formModel = Object.assign(this.formModel, formModel)
        if (formModel.type === 1) {
          this.formModel.springCloud = JSON.parse(formModel.extProperties)
          console.log(this.formModel)
        }
      }
      this.visible = true
      this.mode = mode
    },
    close() {
      this.closeConfirmLoading()
      this.visible = false
      this.resetForm()
    },
    resetForm() {
      this.formModel = this.$cloneDeep(defaultModel)
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

        this.toggleConfirmLoading()
        let extProperties = ''
        if (this.formModel.scaffold === 1) {
          extProperties = JSON.stringify(this.formModel.springCloud)
          Object.assign(realSubmitModel, this.formModel)
          realSubmitModel.extProperties = extProperties;
          delete realSubmitModel.springCloud
        }
        createCodeProject(realSubmitModel)
          .then(({data}) => this.afterSuccess())
          .catch(e => e)
          .finally(() => this.closeConfirmLoading())
      });
    }
  },
  created() {
  }
}
</script>
