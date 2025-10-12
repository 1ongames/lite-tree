<template>
  <h1>{{ hydrated ? title : '\u00A0' }}</h1>
  <NuxtPage />
</template>

<script setup>
const wikiPage = useState('wikiPage')

const { data } = await useFetch('/i/getDocument', { lazy: true })

const hydrated = ref(false)
onMounted(() => { hydrated.value = true })

const title = computed(() => {
  if (wikiPage.value?.isDocument) {
    return data.value?.docName || wikiPage.value?.title || '\u00A0'
  }
  return wikiPage.value?.title || '\u00A0'
})
</script>

<style>
/* @import '@/assets/styles/main.css'; */
</style>