<!-- src/components/NSFWToggle.vue -->
<template>
  <button
    class="nsfw-toggle"
    :class="{ active: modelValue }"
    @click="onToggle"
    :title="modelValue ? '点击切换到 SFW 模式' : '点击切换到 NSFW 模式'"
  >
    <span class="toggle-text">{{ modelValue ? "NSFW" : "SFW" }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const onToggle = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>
