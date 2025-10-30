import { defineAsyncComponent } from 'vue'

/**
 * 빌드 후 추가된 스킨을 동적으로 로드
 * 외부 스킨 파일은 public/skins/ 디렉토리에 배치
 */
export const useExternalSkin = () => {
  const loadExternalSkin = async (skinName: string) => {
    try {
      // 방법 1: public 디렉토리에서 로드
      const response = await fetch(`/skins/${skinName}/index.js`)
      if (!response.ok) throw new Error('Skin not found')
      
      const moduleText = await response.text()
      const module = eval(`(${moduleText})`)
      
      return defineAsyncComponent(() => Promise.resolve(module.default))
    } catch (error) {
      console.error(`Failed to load external skin: ${skinName}`, error)
      return null
    }
  }

  const loadSkinFromConfig = async () => {
    try {
      const config = await $fetch('/api/config/skin')
      const skinName = config.default_skin || 'normal'
      
      // 먼저 내장 스킨 시도
      try {
        const builtInSkin = await import(`~/layouts/skins/${skinName}/index.vue`)
        return builtInSkin.default
      } catch {
        // 내장 스킨 없으면 외부 스킨 로드
        return await loadExternalSkin(skinName)
      }
    } catch (error) {
      console.error('Failed to load skin:', error)
      return null
    }
  }

  return {
    loadExternalSkin,
    loadSkinFromConfig
  }
}
