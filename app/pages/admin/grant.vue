<template>
  <div class="admin-grant">
    <!-- 에러 표시 뷰 -->
    <div v-if="accessDenied" class="grant-error">
      <span v-if="message">{{ message }}</span>
    </div>

    <template v-else>
      <!-- 상단 검색 영역 -->
      <form @submit.prevent="loadUser" class="grant-search">
        <label for="username">Username</label>
        <input id="username" v-model.trim="username" type="text" placeholder="닉네임 입력" />
        <button type="submit" :disabled="pendingLoad">확인</button>
      </form>

      <!-- 피드백 메시지 -->
      <span v-if="message" :class="{ error: isError }">{{ message }}</span>

      <!-- 권한 체크박스 리스트 -->
      <div v-if="loadedUser" class="grant-list">
        <h3>{{ loadedUser }}</h3>
        <div class="grant-checkboxes">
          <label v-for="perm in grant_permission" :key="perm" class="grant-item">
            <input type="checkbox" :value="perm" v-model="selectedPerms" />
            <span>{{ perm }}</span>
          </label>
        </div>

        <button @click="submitPerms" :disabled="pendingSubmit">확인</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { setError } from '../../../server/utils/error.js'

const wikiPage = useState('wikiPage', () => ({
  title: '권한 부여'
}))

// 권한 목록: 서버에서 동적으로 로드 (allowed_perms or all_perms)
const grant_permission = ref([])

// 상태
const username = ref('')
const loadedUser = ref('')
const selectedPerms = ref([])
const pendingLoad = ref(false)
const pendingSubmit = ref(false)
const message = ref('')
const isError = ref(false)
const accessDenied = ref(false)

// 접속 시 권한 보유 여부 검사: developer 또는 grant 없으면 에러 표시
onMounted(async () => {
  try {
    await $fetch('/i/getPermissions', { method: 'GET', query: { type: 'grant' }, credentials: 'include' })
  } catch (e) {
    const err = setError('403')
    accessDenied.value = true
    wikiPage.value.title = err.title
    message.value = err.message
    return
  }
  // 권한이 있으면 초기 권한 목록을 불러온다
  await fetchGrantPermission()
})

// 권한 목록 불러오기: 세션 기반(actor는 서버 미들웨어에서 식별)
const fetchGrantPermission = async () => {
  grant_permission.value = []
  // 메시지는 유지하되, 목록 로딩 시 에러 상태는 초기화
  isError.value = false
  // 1) developer: all perms 시도
  try {
    const allRes = await $fetch('/i/getPermissions', { method: 'GET', query: { type: 'all' }, credentials: 'include' })
    if (Array.isArray(allRes?.all_perms) && allRes.all_perms.length) {
      grant_permission.value = allRes.all_perms
      return
    }
  } catch (e1) { /* no-op: fallback to grant */ }
  // 2) grant: allowed perms 시도
  try {
    const grantRes = await $fetch('/i/getPermissions', { method: 'GET', query: { type: 'grant' }, credentials: 'include' })
    const arr = Array.isArray(grantRes?.allowed_perms) ? grantRes.allowed_perms : []
    grant_permission.value = arr
    if (!arr.length) {
      message.value = '권한 목록이 비어 있습니다.'
      isError.value = true
    }
  } catch (e2) {
    const msg = (e2 && e2.data && e2.data.message) || '권한 목록을 가져올 권한이 없습니다. 로그인 또는 권한을 확인하세요.'
    message.value = msg
    isError.value = true
  }
}

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
      query: { username: username.value },
      credentials: 'include'
    })
    loadedUser.value = res.username
    selectedPerms.value = Array.isArray(res.perms) ? [...res.perms] : []
    if (!res.username) {
      message.value = '해당 사용자를 찾을 수 없습니다.'
      isError.value = true
    }
    // 사용자 로드 후에도, 현재 세션 권한이 바뀌었을 수 있으므로 목록 갱신
    await fetchGrantPermission()
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
    message.value = '사용자를 입력해주세요.'
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
      },
      credentials: 'include'
    })
    // 저장 후 세션 주체의 권한이 바뀌었다면 허용 목록이 달라지므로 즉시 갱신
    await fetchGrantPermission()
  } catch (err) {
    message.value = (err && err.data && err.data.message) || '권한 저장에 실패했습니다.'
    isError.value = true
  } finally {
    pendingSubmit.value = false
  }
}
</script>

<style scoped>
@import '@/assets/styles/admin.css';
@import '@/assets/styles/default.css';
</style>