<template>
  <component :is="currentSkin" v-if="currentSkin">
    <slot />
  </component>
  <div v-else>
    <p>스킨을 로드하는 중...</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import NormalSkin from './skins/normal/index.vue'

const currentSkin = shallowRef(null)

onMounted(async () => {
  try {
    // 1. serverConfig에서 스킨 이름 가져오기
    const config = await $fetch('/api/config/skin')
    const skinName = config.default_skin || 'normal'
    
    // 2. 먼저 내장 스킨 시도
    if (skinName === 'normal') {
      currentSkin.value = NormalSkin
      return
    }
    
    // 3. 외부 스킨 로드 시도 (public/skins/)
    try {
      const response = await fetch(`/skins/${skinName}/index.js`)
      if (response.ok) {
        const skinCode = await response.text()
        // Vue 컴포넌트로 변환
        const skinModule = new Function('return ' + skinCode)()
        currentSkin.value = skinModule.default || skinModule
        return
      }
    } catch (e) {
      console.error('Failed to load external skin:', e)
    }
    
    // 4. 모두 실패하면 기본 스킨 사용
    currentSkin.value = NormalSkin
    
  } catch (error) {
    console.error('Skin loading error:', error)
    currentSkin.value = NormalSkin
  }
})
</script>

