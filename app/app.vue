<template>
  <h1>{{ hydrated ? heading : '\u00A0' }}</h1>
  <NuxtPage />
</template>

<script setup lang="ts">
const wikiPage = useState('wikiPage')

const { data } = useFetch('/i/getDocument', { lazy: true })

const hydrated = ref(false)
onMounted(() => { hydrated.value = true })

const heading = computed(() => {
  if (wikiPage?.isDocument) {
    return data?.docName || wikiPage?.title || '\u00A0'
  }
  return wikiPage?.title || '\u00A0'
})
</script>

<style>
/* @import '@/assets/styles/main.css'; */
</style>