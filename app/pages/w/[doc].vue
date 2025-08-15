<template>
    <div>
        <p>{{ data.doc }}</p>
    </div>
</template>

<script setup>
import { useFetch } from '#imports'
const { data } = await useFetch('/i/getDocument')

const wikiPage = useState('wikiPage', () => ({
  isDocument: true
}))
</script>