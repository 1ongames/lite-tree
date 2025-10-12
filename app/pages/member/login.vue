<template>
  <div class="auth-form">
    <label>Email</label>
    <input v-model.trim="email" type="email" />
    <label>Password</label>
    <input v-model="password" type="password" />
    <a class="hint" href="#">비밀번호를 잊으셨나요?</a>
    <div class="row">
      <label><input type="checkbox" v-model="remember" /> 자동 로그인</label>
      <div class="spacer" />
      <NuxtLink to="/member/signup">계정 만들기</NuxtLink>
      <button @click="login" :disabled="pending">로그인</button>
    </div>
    <span v-if="msg" :class="{ error: isError }">{{ msg }}</span>
  </div>
</template>
  
  <style scoped>
  @import '@/assets/styles/auth.css';
  @import '@/assets/styles/default.css';
  </style>

  <script setup>
  const email = ref('')
  const password = ref('')
  const remember = ref(false)
  const pending = ref(false)
  const msg = ref('')
  const isError = ref(false)
  const router = useRouter()
  const wikiPage = useState('wikiPage', () => ({ title: '로그인' }))

  const login = async () => {
    msg.value = ''
    isError.value = false
    try {
      pending.value = true
      await $fetch('/member/login', { method: 'POST', body: { email: email.value, password: password.value, remember: remember.value } })
      router.push('/')
    } catch (e) {
      isError.value = true
      msg.value = (e && e.data && e.data.message) || '로그인 실패'
    } finally { pending.value = false }
  }
  </script>
