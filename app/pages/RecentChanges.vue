<template>
    <RecentBar type=1 />
</template>

<script setup>
const wikiPage = useState('wikiPage', () => ({
  title: '최근 변경내역'
}))
</script>
