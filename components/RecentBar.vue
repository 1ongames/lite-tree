<template>
  <div class="recent-navbar recent-ui">
    <div class="recent-menu">
      <div class="recent-button">
        <ul class="recent-block">
          <li v-for="item in menuItems" :key="item.logtype">
            <a :href="`/RecentChanges?logtype=${item.logtype}`" class="recent-content" v-if="type == 'changes'">{{ item.label }}</a>
            <a :href="`/RecentDiscuss?logtype=${item.logtype}`" class="recent-content" v-else>{{ item.label }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'changes'
  }
})

const menuMap = {
  changes: [
    { logtype: 'all', label: '전체' },
    { logtype: 'create', label: '새 문서' },
    { logtype: 'delete', label: '삭제' },
    { logtype: 'move', label: '이동' },
    { logtype: 'revert', label: '되돌림' }
  ],
  discuss: [
    { logtype: 'normal_thread', label: '열린 토론' },
    { logtype: 'old_thread', label: '오래된 토론' },
    { logtype: 'pause_thread', label: '중지된 토론' },
    { logtype: 'closed_thread', label: '닫힌 토론' },
    { logtype: 'open_editrequest', label: '열린 편집 요청' },
    { logtype: 'accepted_editrequest', label: '승인된 편집 요청' },
    { logtype: 'closed_editrequest', label: '닫힌 편집 요청' },
    { logtype: 'old_editrequest', label: '오래된 편집 요청' }
  ],
}

const menuItems = menuMap[props.type] || menuMap['changes']
</script>