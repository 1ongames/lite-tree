<template>
  <h1>{{ wikiPage?.title || 'undefined' }}</h1>
  <NuxtPage />
</template>

<style>
/* @import '@/assets/styles/main.css'; */
</style>

<script setup>
const wikiPage = useState('wikiPage')
</script>