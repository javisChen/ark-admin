<template>
  <a-config-provider :locale="locale"
                     :auto-insert-space-in-button="false">

    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  data () {
    return {
    }
  },
  methods: {
    // transformCellText: (text, row, index) => {
    //   if (!text || text == 'undefined') {
    //     return text || '-'
    //   }
    //   console.log(text)
    //   return text
    // },
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
