<template>
  <div class="root">
    <nuxt class="nuxt" />
  </div>
</template>

<script>
export default {
  middleware: ['fetchData', 'isLogin'],
}
</script>

<style>
@import '@/assets/styles/common.css';
</style>

<style scoped>
.root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: var(--font-base);
  background: var(--color-title-bar);
}

.nuxt {
  position: absolute;
  top: 0;
  left: 0;
  right: 2px;
  bottom: 2px;
  background: var(--color-page);
}
</style>
