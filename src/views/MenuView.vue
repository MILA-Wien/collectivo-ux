<template>
    <div>
        <Menu></Menu>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Menu from '../components/Menu.vue'

const text = ref('')

function onInput(e: { target: { value: string; }; }) {
    text.value = e.target.value
}
</script>


<style>

</style>
