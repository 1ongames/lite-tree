<template>
    <div>
        <h1>{{ data.docName }}</h1>
        <p>{{ data.doc }}</p>
    </div>
</template>

<script setup>
import { useFetch } from '#imports'
const { data } = await useFetch('/i/getDocument')

const wikiPage = useState('wikiPage', () => ({
  title: data.docName || 'undefined'
}))
</script>