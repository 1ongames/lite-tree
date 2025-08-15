<template>
  <h1>{{ wikiPage?.isDocument ? data.docName : (wikiPage?.title || '&nbsp;') }}</h1>
  <NuxtPage />
</template>

<style>
/* @import '@/assets/styles/main.css'; */
</style>

<script setup>
const { data } = await useFetch('/i/getDocument')

const wikiPage = useState('wikiPage')
</script>