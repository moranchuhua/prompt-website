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

    <div class="footer-section">
      <div class="footer-hint">
        <span>👆 点击主按钮</span>
      </div>

      <!-- GitHub 链接 - SVG 图标 + 文字 -->
      <a
        href="https://github.com/moranchuhua/prompt-website"
        target="_blank"
        rel="noopener noreferrer"
        class="github-link"
      >
        <svg
          class="github-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          ></path>
        </svg>
        <span class="github-text">GitHub</span>
      </a>
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
