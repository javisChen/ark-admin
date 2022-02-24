<template>
  <a-modal
      title="获取工程代码"
      :visible="getCodeModalVisible"
      :closable="true"
      :mask="true"
      :maskClosable="true"
      :footer="null"
      :cancel="onClose"
  >
    <div class="download-box">
      <div class="download-title">
        下载代码包：
      </div>
      <div class="flex-row">
        <div class="download-input">
          <a-input readOnly placeholder="Basic usage" :value="'http://www.baidu.com'"/>
        </div>
        <div class="download-action">
          <a href="/#">下载</a>
        </div>
      </div>
    </div>
    <div class="download-box">
      <div class="download-title">
        Git Clone 命令：
      </div>
      <div class="flex-row">
        <div class="download-input">
          <a-input readOnly placeholder="Basic usage" :value="gitReposUrl"/>
        </div>
        <div class="download-action">
          <a href="/#" v-clipboard:copy="'git clone ' + gitReposUrl" v-clipboard:success="onCopy">复制</a>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
export default {
  name: 'get-project-modal',
  props: {
  },
  data() {
    return {
      getCodeModalVisible: false,
      // Git仓库地址
      gitReposUrl: '',
      // 代码压缩包地址
      packageUrl: '',
    }
  },
  methods: {
    open(data) {
      this.gitReposUrl = data.gitReposUrl;
      this.getCodeModalVisible = true
    },
    onCopy() {
      this.$message.success('复制成功')
      this.getCodeModalVisible = false
    },
    onClose() {
      console.log(123)
      this.getCodeModalVisible = false
    }
  }
}
</script>
<style lang="css">

.flex-row {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.download-box:not(:first-child) {
  margin-top: 20px;
}

.download-box .download-title {
  font-style: normal;
  font-size: 15px;
  color: #222;
  line-height: 32px;
  font-weight: bold;
}

.download-box .download-input {
  flex-grow: 8;
}

.download-box .download-input > input {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #ebebeb;
  outline: none;
  padding: 0;
  font-size: 15px;
}

input:focus {
  border: 0;
  outline: none;
}

.download-box .download-action {
  margin-left: 20px;
  flex-grow: 1;
}
</style>