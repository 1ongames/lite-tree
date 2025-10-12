<template>
  <div class="signup-request">
    <textarea rows="12" placeholder="약관을 입력해 주세요."></textarea>
    <label><input type="checkbox" v-model="agree" /> 동의합니다.</label>
    <label>Email</label>
    <input v-model.trim="email" type="email" />
    <div class="row">
      <button @click="request" :disabled="pending">가입</button>
    </div>
    <p v-if="msg" :class="{ error: isError }">{{ msg }}</p>
    <p v-if="verifyUrl">개발용 토큰: <NuxtLink :to="verifyUrl">{{ verifyUrl }}</NuxtLink></p>
  </div>
</template>

  <style scoped>
  @import '@/assets/styles/auth.css';
  @import '@/assets/styles/default.css';
  </style>

  <script setup>
  const email = ref('')
  const agree = ref(false)
  const pending = ref(false)
  const msg = ref('')
  const verifyUrl = ref('')
  const isError = ref(false)
  const wikiPage = useState('wikiPage', () => ({ title: '회원 가입' }))

  const request = async () => {
    msg.value = ''
    isError.value = false
    verifyUrl.value = ''
    try {
      pending.value = true
      const res = await $fetch('/member/signup.request', { method: 'POST', body: { email: email.value, agree: agree.value } })
      verifyUrl.value = res?.verifyUrl || ''
    } catch (e) {
      isError.value = true
      msg.value = (e && e.data && e.data.message) || '요청 실패'
    } finally { pending.value = false }
  }
  </script>
  

