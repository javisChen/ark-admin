<template>
  <div
      :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
  >
    <a-button :style="{ marginRight: '8px' }" @click="handleClose">
      取消
    </a-button>
    <a-button type="primary" @click="submitForm" :loading="confirmLoading">
      确认
    </a-button>
  </div>
</template>
<script>
export default {
  name: 'form-action-bar',
  props: {
    handleClose: {},
    submitForm: {},
    confirmLoading: false
  }
}
</script>