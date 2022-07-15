<script setup lang="ts">
</script>

<template>
  <h1>Tauri + Vue3 + PixiJS Demo</h1>
  <router-link to="/game" custom v-slot="{ navigate, href, route }">
    <button @click="navigate(href)">START</button>
  </router-link>
</template>

<style scoped lang="scss">
</style>