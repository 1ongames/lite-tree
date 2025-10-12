<template>
  <div class="admin-grant">
    <!-- 상단 검색 영역 -->
    <form @submit.prevent="loadUser" class="grant-search">
      <label for="username">Username</label>
      <input id="username" v-model.trim="username" type="text" placeholder="닉네임 입력" />
      <button type="submit" :disabled="pendingLoad">확인</button>
    </form>

    <!-- 피드백 메시지 -->
    <p v-if="message" :class="{ error: isError }">{{ message }}</p>

    <!-- 권한 체크박스 리스트 -->
    <div v-if="loadedUser" class="grant-list">
      <h3>권한 선택 ({{ loadedUser }})</h3>
      <div class="grant-checkboxes">
        <label v-for="perm in grant_permission" :key="perm" class="grant-item">
          <input type="checkbox" :value="perm" v-model="selectedPerms" />
          <span>{{ perm }}</span>
        </label>
      </div>

      <button @click="submitPerms" :disabled="pendingSubmit">확인</button>
    </div>
  </div>
</template>

<script setup>
// 페이지 타이틀 상태
const wikiPage = useState('wikiPage', () => ({
  title: '권한 부여'
}))

// 권한 목록 (필요 시 별도 파일로 분리 가능)
const grant_permission = [
  'read',
  'write',
  'move',
  'delete',
  'revert',
  'upload',
  'grant',
  'admin'
]

// 상태
const username = ref('')
const loadedUser = ref('')
const selectedPerms = ref([])
const pendingLoad = ref(false)
const pendingSubmit = ref(false)
const message = ref('')
const isError = ref(false)

// 유저 권한 불러오기
const loadUser = async () => {
  message.value = ''
  isError.value = false
  selectedPerms.value = []
  loadedUser.value = ''
  if (!username.value) {
    message.value = '닉네임을 입력하세요.'
    isError.value = true
    return
  }
  try {
    pendingLoad.value = true
  const res = await $fetch('/i/getUserPerms', {
      method: 'GET',
      query: { username: username.value }
    })
    loadedUser.value = res.username
    selectedPerms.value = Array.isArray(res.perms) ? [...res.perms] : []
    if (!res.username) {
      message.value = '해당 사용자를 찾을 수 없습니다.'
      isError.value = true
    }
  } catch (err) {
    message.value = (err && err.data && err.data.message) || '권한 정보를 불러오지 못했습니다.'
    isError.value = true
  } finally {
    pendingLoad.value = false
  }
}

// 권한 저장
const submitPerms = async () => {
  message.value = ''
  isError.value = false
  if (!loadedUser.value) {
    message.value = '먼저 사용자를 조회하세요.'
    isError.value = true
    return
  }
  try {
    pendingSubmit.value = true
  const res = await $fetch('/i/setUserPerms', {
      method: 'POST',
      body: {
        username: loadedUser.value,
        perms: selectedPerms.value
      }
    })
    message.value = '권한이 저장되었습니다.'
  } catch (err) {
    message.value = (err && err.data && err.data.message) || '권한 저장에 실패했습니다.'
    isError.value = true
  } finally {
    pendingSubmit.value = false
  }
}
</script>

<style scoped>
.admin-grant { padding: 0.5rem 0; }
.grant-search { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.grant-search input { padding: 0.4rem 0.6rem; }
.grant-list { margin-top: 1rem; }
.grant-checkboxes { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem 1rem; margin: 0.75rem 0; }
.grant-item { display: flex; align-items: center; gap: 0.5rem; }
button { padding: 0.4rem 0.8rem; }
p.error { color: #d33; }
</style>