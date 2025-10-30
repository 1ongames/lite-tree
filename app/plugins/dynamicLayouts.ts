export default defineNuxtPlugin((nuxtApp) => {
  // 빌드 후 추가된 레이아웃을 동적으로 등록
  const registerExternalLayout = (name: string, component: any) => {
    nuxtApp.vueApp.component(`${name}Layout`, component)
  }

  return {
    provide: {
      registerLayout: registerExternalLayout
    }
  }
})
