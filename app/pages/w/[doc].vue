<template>
    <div>
        <p>{{ data.doc }}</p>
    </div>
</template>

<script setup>
import { useFetch } from '#imports'
const route = useRoute()
const doc = route.params.doc

const { data } = await useFetch(`/i/getDocument?docName=${doc}`);

const wikiPage = useState('wikiPage', () => ({
  isDocument: true
}))

// TODO: 문서 표제어 출력
</script>