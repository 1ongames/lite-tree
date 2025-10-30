<template>
  <div v-if="isLoggedIn" class="user-menu">
    <span>{{ user?.name }}</span>
    <button @click="handleLogout" :disabled="loading">로그아웃</button>
  </div>
  <div v-else class="user-menu">
    <NuxtLink to="/member/login">로그인</NuxtLink>
    <NuxtLink to="/member/signup">회원가입</NuxtLink>
  </div>
</template>

<script setup>
const { user, isLoggedIn, logout } = useAuth()
const loading = ref(false)

const handleLogout = async () => {
  loading.value = true
  await logout()
  loading.value = false
}

// 페이지 로드 시 사용자 정보 가져오기
onMounted(async () => {
  const { fetchUser } = useAuth()
  await fetchUser()
})
</script>

<style scoped>
.user-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
