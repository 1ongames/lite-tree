<template>
    <RecentBar :type="1" optType="all" />
</template>

<script setup>
const wikiPage = useState('wikiPage', () => ({
  title: '최근 변경내역'
}))
</script>
