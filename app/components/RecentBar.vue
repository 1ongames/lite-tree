<template>
  <div class="recent-navbar recent-ui">
    <div class="recent-menu">
      <div class="recent-button">
        <ul class="recent-block">
          <li v-for="item in menuItems" :key="item.logtype">
            <a :href="`/RecentChanges?logtype=${item.logtype}`" :class="['recent-content', logparams === item.logtype || optType === item.logtype ? 'recent-item' : '']" v-if="type == 1">{{ item.label }}</a>
            <a :href="`/RecentDiscuss?logtype=${item.logtype}`" :class="['recent-content', logparams === item.logtype || optType === item.logtype ? 'recent-item' : '']" v-else-if="type == 2">{{ item.label }}</a>
            <!-- <a :href="`/contribution/${user.uuid}/${item.logtype}`" :class="['recent-content',  logparams=== item.logtype ? 'recent-item' : '']" v-else-if="type == 3">{{ item.label }}</a>-->
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="recent-border recent-line" style="opacity: 0;"></div>
  <div class="recent-border" style="opacity: 0; display: none;"></div>
</template>

<style>
@import '@/assets/styles/recent.css';
</style>

<script setup>
import { useRoute } from 'vue-router'

let logparams = useRoute().query.logtype;
const props = defineProps({
  type: {
    type: Number,
    default: 0
  },
  optType: {
    type: String,
    default: ''
  }
})

const menuMap = {
  1: [
    { logtype: 'all', label: '전체' },
    { logtype: 'create', label: '새 문서' },
    { logtype: 'delete', label: '삭제' },
    { logtype: 'move', label: '이동' },
    { logtype: 'revert', label: '되돌림' }
  ],
  2: [
    { logtype: 'normal_thread', label: '열린 토론' },
    { logtype: 'old_thread', label: '오래된 토론' },
    { logtype: 'pause_thread', label: '중지된 토론' },
    { logtype: 'closed_thread', label: '닫힌 토론' },
    { logtype: 'open_editrequest', label: '열린 편집 요청' },
    { logtype: 'accepted_editrequest', label: '승인된 편집 요청' },
    { logtype: 'closed_editrequest', label: '닫힌 편집 요청' },
    { logtype: 'old_editrequest', label: '오래된 편집 요청' }
  ],
/*  3: [
    { logtype: 'document', label: '문서' },
    { logtype: 'discuss', label: '토론' },
    { logtype: 'edit_request', label: '편집 요청' },
    { logtype: 'accepted_edit_request', label: '승인된 편집 요청' }
  ], */
}

const menuItems = menuMap[props.type] || menuMap[1]
</script>