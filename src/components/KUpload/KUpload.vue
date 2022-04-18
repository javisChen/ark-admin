<template>
  <div>
    <a-upload
      list-type="picture-card"
      :file-list="fileList"
      :customRequest="customRequest"
      @preview="handlePreview"
      :remove="handleRemove"
    >
      <div v-if="fileList.length < limit">
        <a-icon type="plus"/>
        <!--      <div class="ant-upload-text">-->
        <!--        LOGO-->
        <!--      </div>-->
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>

</template>
<script>
import {upload} from "@/api/file/file-api";

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
      required: true,
    },
  },
  data() {
    return {
      fileList: [],
      previewImage: '',
      previewVisible: false
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
    async handleRemove() {
      this.fileList = []
    },
    handleChange(value) {
      this.$emit('change', value)
    },
    async customRequest(f) {
      const {file} = f
      const formData = new FormData();
      formData.append('file', file);
      try {
        const {data} = await upload(formData);
        this.fileList.push({
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: data.url
        })
        console.log(this.fileList)
        this.handleChange(this.fileList)
        this.$message.success('上传成功')
      } catch (e) {
        this.$message.error('上传失败')
      }
    }
  }
}
</script>