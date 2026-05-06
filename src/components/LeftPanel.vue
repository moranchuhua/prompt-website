<!-- src/components/LeftPanel.vue -->
<template>
  <div class="left-panel">
    <div class="main-btn-group">
      <button
        v-for="btn in filteredMainButtons"
        :key="btn.id"
        class="primary-btn"
        :class="{
          active: store.currentMainCategory === btn.id,
          'nsfw-btn': btn.nsfw,
        }"
        @click="store.currentMainCategory = btn.id"
      >
        <span class="btn-icon">{{ btn.icon }}</span>
        <span class="btn-label">{{ btn.label }}</span>
      </button>
    </div>

    <div class="footer-hint">
      <span>👆 点击主按钮</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePromptStore } from "../stores/promptStore";
import { mainButtons } from "../data/categoryConfig";

const store = usePromptStore();

// 根据 NSFW 状态过滤主按钮
const filteredMainButtons = computed(() => {
  if (store.showNSFW) {
    return mainButtons;
  } else {
    return mainButtons.filter((btn) => !btn.nsfw);
  }
});
</script>
