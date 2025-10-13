<template>
  <!-- 약관 동의 -->
  <div v-if="!token" class="signup-request">
    <textarea rows="12" placeholder="약관을 입력해 주세요."></textarea>
    <label><input type="checkbox" v-model="agree" /> 동의합니다.</label>
    <label>Email</label>
    <input v-model.trim="email" type="email" />
    <div class="row">
      <button @click="request" :disabled="pending">가입</button>
    </div>
    <span v-if="msg" :class="{ error: isError }">{{ msg }}</span>
    <p v-if="verifyUrl">개발용 토큰: <NuxtLink :to="verifyUrl">{{ verifyUrl }}</NuxtLink></p>
  </div>

  <!-- 회원가입 -->
  <div v-else class="signup-complete">
    <label>이메일</label>
    <input v-model.trim="email" type="email" disabled/>
    <label>사용자 이름</label>
    <input v-model.trim="name" />
    <label>암호</label>
    <input v-model="password" type="password" />
    <label>암호 확인</label>
    <input v-model="password2" type="password" />
    <div class="row"><button @click="complete" :disabled="pending">가입</button></div>
    <span v-if="msg" :class="{ error: isError }">{{ msg }}</span>
  </div>
</template>

<style scoped>
@import '@/assets/styles/auth.css';
@import '@/assets/styles/default.css';
</style>

<script setup>
const route = useRoute()
const router = useRouter()
const token = computed(() => route.query.token || '')

// 공통 상태
const wikiPage = useState('wikiPage', () => ({ title: '회원 가입' }))
const pending = ref(false)
const msg = ref('')
const isError = ref(false)

// 1) 요청 단계 상태
const email = ref('')
const agree = ref(false)
const verifyUrl = ref('')

// 2) 완료 단계 상태
const name = ref('')
const password = ref('')
const password2 = ref('')

// 약관 동의 + 이메일 → 토큰 발급
const request = async () => {
  msg.value = ''
  isError.value = false
  verifyUrl.value = ''
  try {
    pending.value = true
    const res = await $fetch('/i/signup.request', { method: 'POST', body: { email: email.value, agree: agree.value } })
    verifyUrl.value = res?.verifyUrl || ''
  } catch (e) {
    isError.value = true
    msg.value = (e && e.data && e.data.message) || '요청 실패'
  } finally { pending.value = false }
}

// 토큰으로 회원가입 완료
const complete = async () => {
  msg.value = ''
  isError.value = false
  try {
    pending.value = true
    await $fetch('/i/signup.complete', {
      method: 'POST',
      body: { token: token.value, email: email.value, name: name.value, password: password.value, password2: password2.value }
    })
    router.push('/')
  } catch (e) {
    isError.value = true
    msg.value = (e && e.data && e.data.message) || '가입 실패'
  } finally { pending.value = false }
}
</script>


