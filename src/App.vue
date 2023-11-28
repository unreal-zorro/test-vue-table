<script setup lang="ts">
import TheTable from '@/components/TheTable/TheTable.vue';
</script>

<template>
  <div class="wrapper">
    <header class="header">
      <h1 class="header__title">Заказы клиентов</h1>
    </header>

    <main class="main">
      <TheTable />
    </main>
  </div>
</template>

<style scoped lang="scss">
// colors
$font-prim-color: #000;

// fonts
$font: Arial, sans-serif;
$font-prim-size: 11px;

.wrapper {
  min-height: 100%;
  width: 1370px;
  padding: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font: $font;
  font-size: $font-prim-size;
  color: $font-prim-color;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 2;

  &__title {
    font-size: 2 * $font-prim-size;
  }
}

.main {
  width: 100%;
}
</style>
