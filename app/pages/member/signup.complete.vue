<template>
  <div class="signup-complete">
    <label>이메일</label>
    <input v-model.trim="email" type="email" />
    <label>사용자 이름</label>
    <input v-model.trim="name" />
    <label>암호</label>
    <input v-model="password" type="password" />
    <label>암호 확인</label>
    <input v-model="password2" type="password" />
    <div class="row"><button @click="complete" :disabled="pending">가입</button></div>
    <p v-if="msg" :class="{ error: isError }">{{ msg }}</p>
  </div>
</template>

  <style scoped>
  @import '@/assets/styles/auth.css';
  @import '@/assets/styles/default.css';

  </style>

  <script setup>
  const route = useRoute()
  const token = computed(() => route.query.token || '')
  const email = ref('')
  const name = ref('')
  const password = ref('')
  const password2 = ref('')
  const pending = ref(false)
  const msg = ref('')
  const isError = ref(false)
  const router = useRouter()
  const wikiPage = useState('wikiPage', () => ({ title: '회원 가입' }))

  const complete = async () => {
    msg.value = ''
    isError.value = false
    try {
      pending.value = true
      await $fetch('/member/signup.complete', {
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
