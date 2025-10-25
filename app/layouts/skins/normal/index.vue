<template>
    <div class="normal-skin">
        <ul>
            <li><NuxtLink to="/{{ publicConfig.wiki_FrontPage }}">{{ publicConfig.wiki_name }}</NuxtLink></li>
            <li><NuxtLink to="/RecentChanges">최근 변경</NuxtLink></li>
            <li><NuxtLink to="/RecentDiscuss">최근 토론</NuxtLink></li>
            <li><NuxtLink to="">특수</NuxtLink></li>
            <li><NuxtLink to="/member/login">로그인</NuxtLink></li>
        </ul>
        <h1>{{ hydrated ? title : '\u00A0' }}</h1>
        <NuxtPage />
    <footer class="skin-footer">
      <p>Powered by lite-tree</p>
    </footer>
  </div>
</template>

<script setup>
import publicConfig from '../../../../publicConfig.json'

const wikiPage = useState('wikiPage')

const hydrated = ref(false)
onMounted(() => { hydrated.value = true })

const title = computed(() => {
  return wikiPage.value?.title || '\u00A0'
})
</script>