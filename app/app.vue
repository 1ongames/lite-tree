<template>
  <h1>{{ hydrated ? title : '\u00A0' }}</h1>
  <NuxtPage />
</template>

<script setup>
const wikiPage = useState('wikiPage')

const hydrated = ref(false)
onMounted(() => { hydrated.value = true })

const title = computed(() => {
  return wikiPage.value?.title || '\u00A0'
})
</script>

<style>
/* @import '@/assets/styles/main.css'; */
</style>