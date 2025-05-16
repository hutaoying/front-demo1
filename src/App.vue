<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup>
// 这里可以添加全局的逻辑
</script>

<style>
/* 这里可以添加全局样式 */
</style>