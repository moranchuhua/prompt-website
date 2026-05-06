<!-- src/components/RightPanel.vue -->
<template>
  <div class="right-panel">
    <div class="search-section">
      <div class="search-wrapper">
        <SearchBar
          v-model="searchQuery"
          :loading="store.isSearching"
          @clear="handleClearSearch"
        />
      </div>
      <div class="nsfw-wrapper">
        <NSFWToggle v-model="store.showNSFW" />
      </div>
    </div>
    <SubButtonSection class="col-sub-buttons" />
    <SelectedSection class="col-selected" />
    <ActionBar class="action-bar" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { usePromptStore } from "../stores/promptStore";
import SubButtonSection from "./SubButtonSection.vue";
import SelectedSection from "./SelectedSection.vue";
import ActionBar from "./ActionBar.vue";
import SearchBar from "./SearchBar.vue";
import NSFWToggle from "./NSFWToggle.vue";
import { getAllPromptItems } from "../data/loader";
import { debounce } from "../utils/debounce";

const store = usePromptStore();
const searchQuery = ref(store.searchQuery);

// 防抖搜索函数 - 根据 NSFW 状态过滤结果
const debouncedSearch = debounce(async (query: string) => {
  if (!query.trim()) {
    store.clearSearch();
    return;
  }

  store.setIsSearching(true);
  store.setSearchQuery(query); // 保存搜索关键词到 store

  try {
    const allItems = await getAllPromptItems();
    const lowerQuery = query.toLowerCase();

    // 根据 NSFW 状态过滤结果
    const results = allItems.filter(({ item }) => {
      // 先检查是否匹配搜索词
      const matchesSearch =
        item.chinese.toLowerCase().includes(lowerQuery) ||
        item.english.toLowerCase().includes(lowerQuery);

      if (!matchesSearch) return false;

      // 根据 NSFW 状态过滤：关闭时隐藏 NSFW 内容，开启时显示所有
      if (!store.showNSFW && item.nsfw) {
        return false;
      }

      return true;
    });

    console.log("搜索结果:", results.length, "NSFW开启:", store.showNSFW); // 调试用
    store.setSearchResults(results);
  } catch (error) {
    console.error("搜索失败:", error);
    store.setSearchResults([]);
  } finally {
    store.setIsSearching(false);
  }
}, 300);

// 监听搜索关键词变化
watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

// 监听 NSFW 状态变化，刷新搜索结果
watch(
  () => store.showNSFW,
  () => {
    if (store.isSearchMode && searchQuery.value.trim()) {
      debouncedSearch(searchQuery.value);
    }
  }
);

// 处理清除搜索
const handleClearSearch = () => {
  searchQuery.value = "";
  store.clearSearch();
};

// 初始化时如果有关键词，执行搜索
if (store.searchQuery) {
  searchQuery.value = store.searchQuery;
  debouncedSearch(store.searchQuery);
}
</script>
