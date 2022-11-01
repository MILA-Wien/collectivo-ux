<script setup lang="ts">


defineProps<{
    src: string;
}>();
</script>

<template>
    <div class="greetings">
        <iframe :src="src" frameborder="0"></iframe>
        <div id="micro-view">
            <div class="wrapper">
                <h1>Micro</h1>
                <div class="content">
                    <HelloSingle />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>