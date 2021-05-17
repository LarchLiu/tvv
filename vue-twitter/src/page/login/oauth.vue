<template>
  <div>success</div>
</template>

<script>
import { onMounted } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    onMounted(() => {
      const queryString = window.location.search
      console.log(queryString)
      const params = new URLSearchParams(queryString)
      let tokens = params.get('tokens')
      let user = params.get('user')
      if (tokens && user) {
        tokens = JSON.parse(tokens)
        user = JSON.parse(user)
        store.dispatch('setUserTokens', tokens).then(() => {
          store.dispatch('setUser', user)
          window.close()
        })
      }
    })
  },
}
</script>
