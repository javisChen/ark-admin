<template>
  <div>
    <a-upload
      list-type="picture-card"
      :file-list="internalValue"
      :customRequest="customRequest"
      @preview="handlePreview"
      :remove="handleRemove"
    >
      <div v-if="internalValue.length < limit">
        <a-icon type="plus"/>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>

</template>
<script>
import {upload} from "@/api/file/file-api";
import cloneDeep from "lodash.clonedeep";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  name: 'KUpload',
  props: {
    limit: {
      type: Number,
      required: false,
      default: () => 1
    },
    value: {
      required: false,
      default: () => []
    },
  },
  watch: {
    value(val) {
      console.log('val', val)
      this.internalValue = val.map(item => {
        return {
          uid: Math.random() * 10,
          name: 'item',
          status: 'done',
          url: item
        }
      })
      console.log('internalValue', this.internalValue)
    }
  },
  data() {
    return {
      previewImage: '',
      previewVisible: false,
      internalValue: []
    }
  },
  methods: {
    handleCancel() {
      this.previewVisible  = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    async handleRemove(v1) {
      this.internalValue = this.internalValue.filter(item => item.uid !== v1.uid)
    },
    handleChange(value) {
      console.log('value', value)
      this.$emit('change', value)
    },
    async customRequest(f) {
      const {file} = f
      const formData = new FormData();
      formData.append('file', file);
      try {
        const {data} = await upload(formData);
        this.internalValue.push({
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: data.url
        })
        this.handleChange(this.internalValue)
        this.$message.success('上传成功')
      } catch (e) {
        this.$message.error('上传失败')
      }
    }
  }
}
</script>