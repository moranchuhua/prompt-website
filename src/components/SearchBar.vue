<!-- src/components/SearchBar.vue -->
<template>
  <div class="search-bar" :class="{ 'has-results': hasResults }">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        ref="inputRef"
        type="text"
        class="search-input"
        :value="modelValue"
        @input="onInput"
        @keydown.esc="onClear"
        placeholder="搜索中文或英文关键词..."
        autocomplete="off"
      />
      <button
        v-if="modelValue"
        class="clear-search-btn"
        @click="onClear"
        title="清空搜索"
      >
        <span class="clear-icon">✕</span>
      </button>
    </div>
    <!-- 加载动画 -->
    <div v-if="loading" class="search-loading">
      <span class="loading-spinner">⏳</span> 搜索中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "clear"): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const hasResults = computed(() => props.modelValue.length > 0);

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const onClear = () => {
  emit("update:modelValue", "");
  emit("clear");
  inputRef.value?.focus();
};
</script>
