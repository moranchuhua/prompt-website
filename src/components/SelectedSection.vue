<!-- src/components/SelectedSection.vue -->
<template>
  <div class="card-section">
    <div class="card-header">
      <h3>
        <span class="header-icon">📋</span>
        已选提示词
      </h3>
      <span class="badge">{{ store.totalCount }}</span>
    </div>

    <div class="content-container">
      <div v-if="store.selectedItems.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <span class="empty-text">暂无选中标签</span>
      </div>
      <div v-else class="tags-wrapper">
        <BilingualTag
          v-for="(item, index) in store.selectedItems"
          :key="`${item.category}-${item.subCategory}-${item.english}-${index}`"
          :item="item"
          :index="index"
          :active="store.activeTagIndex === index"
          :show-weight="store.activeTagIndex === index"
          :dragging="dragIndex === index"
          @drag-start="onDragStart"
          @drag-over="onDragOver"
          @drop="onDrop"
          @drag-end="onDragEnd"
          @click="onTagClick"
          @weight-adjust="onWeightAdjust"
          @delete="onDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePromptStore } from "../stores/promptStore";
import BilingualTag from "./BilingualTag.vue";

const store = usePromptStore();

const dragIndex = ref<number | null>(null);

const onDragStart = (index: number) => {
  dragIndex.value = index;
};

const onDragOver = () => {
  // 不需要额外处理
};

const onDrop = (fromIndex: number, toIndex: number) => {
  store.reorderItems(fromIndex, toIndex);
  dragIndex.value = null;
};

const onDragEnd = () => {
  dragIndex.value = null;
};

const onTagClick = (index: number) => {
  if (store.activeTagIndex === index) {
    store.setActiveTagIndex(null);
  } else {
    store.setActiveTagIndex(index);
  }
};

const onWeightAdjust = (index: number, delta: number) => {
  store.adjustWeight(index, delta);
};

const onDelete = (index: number) => {
  store.removeItem(index);
};
</script>
