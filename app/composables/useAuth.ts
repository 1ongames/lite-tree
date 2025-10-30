import { computed, readonly } from 'vue'

// Nuxt 인증 composable
export const useAuth = () => {
  const router = useRouter()
  const user = useState<{ name: string; email?: string } | null>('auth:user', () => null)
  const isLoggedIn = computed(() => !!user.value)

  // 로그인
  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      const response = await $fetch('/i/login', {
        method: 'POST',
        body: { email, password, remember },
        credentials: 'include'
      })

      if (response.ok) {
        // 사용자 정보 가져오기
        await fetchUser()
        return { success: true }
      }
      return { success: false, error: 'login failed' }
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || 'login failed'
      }
    }
  }

  // 로그아웃
  const logout = async () => {
    try {
      await $fetch('/i/logout', {
        method: 'POST',
        credentials: 'include'
      })
      user.value = null
      await router.push('/member/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // 현재 사용자 정보 가져오기
  const fetchUser = async () => {
    try {
      const response = await $fetch('/i/me', {
        credentials: 'include'
      })
      user.value = response.user
    } catch (error) {
      user.value = null
    }
  }

  // 회원가입
  const signup = async (email: string, name: string, password: string, token: string) => {
    try {
      const response = await $fetch('/i/signup.complete', {
        method: 'POST',
        body: { email, name, password, password2: password, token },
        credentials: 'include'
      })

      if (response.ok) {
        await fetchUser()
        return { success: true }
      }
      return { success: false, error: '회원가입 실패' }
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || '회원가입 실패'
      }
    }
  }

  return {
    user: readonly(user),
    isLoggedIn,
    login,
    logout,
    fetchUser,
    signup
  }
}
