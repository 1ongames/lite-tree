<template>
    <RecentBar :type="1" optType="all" />

    <div class="change-menu">
      <div class="change-navbar change-header">
        <div class="change-value">문서</div>
        <div class="change-value">기능</div>
        <div class="change-value">수정자</div>
        <div class="change-value">수정 시간</div>
      </div>
    <!-- <ChangeLogs v-for="" :key="" /> -->
    </div>
</template>

<script setup>
const wikiPage = useState('wikiPage', () => ({
  title: '최근 변경내역'
}))
</script>
