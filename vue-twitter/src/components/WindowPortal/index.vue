<template>
  <div v-if="open">
    <slot />
  </div>
</template>

<script>
function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement('style')

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText))
      })

      targetDoc.head.appendChild(newStyleEl)
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement('link')

      newLinkEl.rel = 'stylesheet'
      newLinkEl.href = styleSheet.href
      targetDoc.head.appendChild(newLinkEl)
    }
  })
}

export default {
  name: 'window-portal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
    url: {
      tyep: String,
      default: '',
    },
    popup: {
      tyep: Object,
      default: null,
    },
  },
  data() {
    return {
      windowRef: null,
    }
  },
  watch: {
    open(newOpen) {
      if (newOpen) {
        this.openPortal()
      } else {
        this.closePortal()
      }
    },
  },
  methods: {
    openPortal() {
      const width = this.isMobile ? window.innerWidth : 600
      const height = this.isMobile ? window.innerWidth : 600
      const left = this.isMobile ? 0 : window.innerWidth / 2 - width / 2
      const top = this.isMobile ? 0 : window.innerHeight / 2 - height / 2
      this.windowRef = window.open(
        this.url,
        '',
        `toolbar=no, location=yes, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=yes, copyhistory=no, width=${width}, 
        height=${height}, top=${top}, left=${left}`
      )
      this.windowRef.document.body.appendChild(this.$el)
      copyStyles(window.document, this.windowRef.document)
      this.windowRef.addEventListener('beforeunload', this.closePortal)
      this.$emit('update:popup', this.windowRef)
    },
    closePortal() {
      if (this.windowRef && !this.windowRef.closed) {
        this.windowRef.close()
        this.windowRef = null
        this.$emit('update:open', false)
        this.$emit('update:popup', null)
      }
    },
  },
  mounted() {
    if (this.open) {
      this.openPortal()
    }
  },
  beforeUnmount() {
    if (this.windowRef) {
      this.closePortal()
    }
  },
}
</script>
