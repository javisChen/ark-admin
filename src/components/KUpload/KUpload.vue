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
import moment from "moment";
import {v4 as uuidv4} from 'uuid';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * 文件名规范bucket/YYYY/MM/业务code/<filename>
 */
function createFileName(file, bucket) {
  const date = moment();
  const yyyyMM = date.format("YYYY/MM");
  const bizCode = 'product'
  return `${yyyyMM}/${bizCode}/${uuidv4()}.${file.name}`;
}

export default {
  name: 'KUpload',
  props: {
    limit: {
      type: Number,
      required: false,
      default: () => 1
    },
    files: {
      required: false,
      default: () => [],
      type: Array
    },
    value: {
      required: false,
      default: () => []
    },
  },
  watch: {
    files(val) {
      this.internalValue = val.map(item => {
        return {
          uid: Math.random() * 10,
          name: 'item',
          status: 'done',
          url: item
        }
      })
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
      this.$emit('change', value)
    },
    async customRequest(f) {
      const {file} = f
      const bucket = 'ark'
      const formData = new FormData();
      const fileName = createFileName(file, bucket);
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('bucket', bucket);
      try {
        const {data} = await upload(formData);
        this.internalValue.push({
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: `${process.env.VUE_APP_FILE_URL}/${bucket}/${fileName}`
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