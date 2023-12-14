<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>

import '@wangeditor/editor/dist/css/style.css'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import cloneDeep from "lodash.clonedeep";

export default {
  name: 'GoodsDetailInfo',
  components: { Editor, Toolbar },
  watch: {
    formModel(newV, oldV) {
      this.internalModel = newV
    },
  },
  data() {
    return {
      internalModel: cloneDeep(this.formModel),
      editor: null,
      html: '',
      toolbarConfig: {},
      editorConfig: {placeholder: '请输入内容...'},
      mode: 'default', // or 'simple'
    }
  },
  created() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    getData() {
      return {pcDetailHtml: this.html}
    }
  }
}
</script>
<style scoped>
</style>