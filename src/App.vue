<template>
  <div class="card">
    <LeftPanel />
    <RightPanel />
  </div>
</template>

<script setup lang="ts">
import LeftPanel from "./components/LeftPanel.vue";
import RightPanel from "./components/RightPanel.vue";
</script>

<style scoped lang="scss">
.card {
  width: 1400px;
  max-width: 100%;
  height: 860px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 48px;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4),
    inset 0 1px 3px rgba(255, 255, 255, 0.9);
  display: flex;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.6);
}
</style>
