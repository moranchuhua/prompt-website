<!-- src/components/SubButtonSection.vue -->
<template>
  <div class="card-section">
    <div class="card-header">
      <h3>
        <span class="header-icon">{{ currentIcon }}</span>
        {{ headerTitle }}
      </h3>
      <span class="badge">{{ currentCategoryCount }}</span>
    </div>

    <div class="content-container">
      <!-- 子分类标签栏 - 非搜索模式显示 -->
      <div
        class="category-bar"
        v-if="!store.isSearchMode && filteredSubCategories.length > 0"
      >
        <button
          v-for="cat in filteredSubCategories"
          :key="cat.key"
          class="category-btn"
          :class="{
            active:
              store.getCurrentSubCategory(store.currentMainCategory) ===
              cat.key,
            'nsfw-btn': cat.nsfw,
          }"
          @click="switchSubCategory(cat.key)"
        >
          <span class="btn-label">{{ cat.label }}</span>
          <span class="btn-count" :class="{ 'nsfw-count': cat.nsfw }">{{
            cat.displayCount || 0
          }}</span>
        </button>
      </div>

      <!-- 搜索结果提示 - 搜索模式显示 - 显示搜索结果数量 -->
      <div v-if="store.isSearchMode" class="search-context-hint">
        <span class="hint-icon">🔍</span>
        搜索 "{{ store.searchQuery }}"
        <span class="search-count"
          >({{ store.searchResults.length }} 个结果)</span
        >
        <button class="back-btn" @click="clearSearch">返回分类</button>
      </div>

      <!-- 提示词按钮列表 -->
      <div class="tags-wrapper" v-if="!loading">
        <button
          v-for="item in displayItems"
          :key="getItemUniqueKey(item)"
          class="sub-btn"
          :class="{
            selected: isItemSelected(item),
            'nsfw-item': item.nsfw,
          }"
          @click="onToggleItem(item)"
          @mouseenter="showEnhancedTooltip(item, $event)"
          @mouseleave="hideTooltip"
        >
          {{ item.chinese }}
        </button>
        <div v-if="displayItems.length === 0" class="empty-state">
          <span class="empty-icon">
            {{
              store.isSearchMode
                ? "🔍"
                : !store.showNSFW && hasHiddenNSFWItems
                ? "🔞"
                : "📭"
            }}
          </span>
          <span class="empty-text">
            <template v-if="store.isSearchMode">
              没有找到匹配的"{{ store.searchQuery }}"
            </template>
            <template v-else-if="!store.showNSFW && hasHiddenNSFWItems">
              当前分类下所有内容均为 NSFW
            </template>
            <template v-else> 没有找到匹配的结果 </template>
          </span>
        </div>
      </div>
      <div v-else class="loading-hint">
        <span class="loading-spinner">⏳</span> 加载中...
      </div>
    </div>

    <!-- 增强版工具提示 -->
    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="tooltip.visible"
          class="enhanced-tooltip"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          <div class="tooltip-header">
            <span class="tooltip-label">EN:</span>
            <span class="tooltip-text">{{ tooltip.english }}</span>
          </div>
          <div v-if="tooltip.source" class="tooltip-source">
            <span class="source-label">出处:</span>
            <span class="source-text">{{ tooltip.source }}</span>
          </div>
          <div v-if="tooltip.nsfw" class="tooltip-nsfw-badge">NSFW</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from "vue";
import { usePromptStore } from "../stores/promptStore";
import type { PromptItem } from "../types";
import { mainCategoryConfigs } from "../data/categoryConfig";
import { loadPromptItems } from "../data/loader";

const store = usePromptStore();

// 状态
const currentItems = ref<PromptItem[]>([]);
const loading = ref(false);
const subCategoryCounts = ref<Record<string, number>>({});
const subCategoryNSFWCounts = ref<Record<string, number>>({});

// 增强版工具提示
const tooltip = reactive({
  visible: false,
  english: "",
  source: "",
  nsfw: false,
  x: 0,
  y: 0,
});

// 获取当前主分类的配置
const currentMainConfig = computed(() =>
  mainCategoryConfigs.find((c) => c.id === store.currentMainCategory)
);

// 当前图标
const currentIcon = computed(() => currentMainConfig.value?.icon || "📁");

// 当前标题 - 搜索模式显示"搜索结果"
const headerTitle = computed(() =>
  store.isSearchMode ? "搜索结果" : currentMainConfig.value?.label || "未知"
);

// 当前分类的统计数量（根据 NSFW 状态动态计算）
const currentCategoryCount = computed(() => {
  if (store.isSearchMode) {
    return store.searchResults.length;
  }

  // 从 store 获取当前分类的统计数
  return store.getCategoryCount(store.currentMainCategory);
});

// 当前所有子分类（带动态数量）
const allSubCategories = computed(() => {
  const categories = currentMainConfig.value?.subCategories || [];
  return categories.map((cat) => {
    const key = `${store.currentMainCategory}/${cat.fileName}`;
    const totalCount = subCategoryCounts.value[key] || 0;
    const nsfwCount = subCategoryNSFWCounts.value[key] || 0;
    const nonNSFWCount = totalCount - nsfwCount;

    return {
      ...cat,
      totalCount,
      nsfwCount,
      nonNSFWCount,
      // 根据 NSFW 状态显示对应的数量
      displayCount: store.showNSFW ? totalCount : nonNSFWCount,
    };
  });
});

// 根据 NSFW 状态过滤子分类
const filteredSubCategories = computed(() => {
  if (store.showNSFW) {
    return allSubCategories.value;
  } else {
    return allSubCategories.value.filter((cat) => !cat.nsfw);
  }
});

// 当前显示的条目
const displayItems = computed(() => {
  if (store.isSearchMode) {
    // 搜索模式：直接使用搜索结果
    return store.searchResults.map((r) => r.item);
  } else {
    // 非搜索模式：根据 NSFW 状态过滤当前分类的提示词
    if (store.showNSFW) {
      // NSFW 开启：显示所有提示词
      return currentItems.value;
    } else {
      // NSFW 关闭：只显示非 NSFW 提示词
      return currentItems.value.filter((item) => !item.nsfw);
    }
  }
});

// 获取项目的唯一键
const getItemUniqueKey = (item: PromptItem) => {
  if (store.isSearchMode) {
    const result = store.searchResults.find((r) => r.item === item);
    if (result) {
      return `search-${item.english}-${result.category}-${
        result.subCategory
      }-${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  return `normal-${item.english}-${
    store.currentMainCategory
  }-${store.getCurrentSubCategory(store.currentMainCategory)}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

// 是否有隐藏的 NSFW 条目（用于空状态提示）
const hasHiddenNSFWItems = computed(() => {
  if (store.isSearchMode) return false;
  // 检查当前分类下是否有 NSFW 内容
  return currentItems.value.some((item) => item.nsfw);
});

// 获取提示词来源信息
const getItemSource = (item: PromptItem): string => {
  if (store.isSearchMode) {
    const result = store.searchResults.find((r) => r.item === item);
    if (result) {
      return `${result.categoryLabel} > ${result.subCategoryLabel}`;
    }
  } else {
    // 修复：检查 currentMainConfig.value 是否存在
    const mainConfig = currentMainConfig.value;
    if (mainConfig) {
      const subKey = store.getCurrentSubCategory(store.currentMainCategory);
      const subConfig = mainConfig.subCategories?.find((s) => s.key === subKey);
      if (subConfig) {
        return `${mainConfig.label} > ${subConfig.label}`;
      }
    }
  }
  return "";
};

// 加载所有子分类的数量（包括 NSFW 统计）
const loadAllSubCategoryCounts = async () => {
  const mainCategory = store.currentMainCategory;
  const categories = currentMainConfig.value?.subCategories || [];

  const totalCounts: Record<string, number> = {};
  const nsfwCounts: Record<string, number> = {};

  for (const cat of categories) {
    const key = `${mainCategory}/${cat.fileName}`;
    const items = await loadPromptItems(mainCategory, cat.fileName);
    totalCounts[key] = items.length;
    nsfwCounts[key] = items.filter((item) => item.nsfw).length;
  }

  subCategoryCounts.value = totalCounts;
  subCategoryNSFWCounts.value = nsfwCounts;

  // 更新 store 中的分类统计
  await store.updateCategoryCounts();
};

// 监听主分类变化，加载数量
watch(
  () => store.currentMainCategory,
  async () => {
    await loadAllSubCategoryCounts();
  },
  { immediate: true }
);

// 监听主分类或子分类变化，加载数据
watch(
  [
    () => store.currentMainCategory,
    () => store.getCurrentSubCategory(store.currentMainCategory),
    () => store.isSearchMode,
  ],
  async ([mainCategory, subCategory, isSearchMode]) => {
    if (isSearchMode) return;

    if (!mainCategory || !subCategory) return;

    loading.value = true;
    try {
      const mainConfig = mainCategoryConfigs.find((c) => c.id === mainCategory);
      const subConfig = mainConfig?.subCategories?.find(
        (s) => s.key === subCategory
      );

      if (subConfig) {
        const items = await loadPromptItems(mainCategory, subConfig.fileName);
        currentItems.value = items;
      } else {
        currentItems.value = [];
      }
    } catch (error) {
      console.error("加载提示词失败:", error);
      currentItems.value = [];
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);

// 监听 NSFW 状态变化，如果当前选中的子分类被隐藏，自动切换到第一个可见子分类
watch([() => store.showNSFW, () => store.currentMainCategory], () => {
  if (store.isSearchMode) return;

  const currentSub = store.getCurrentSubCategory(store.currentMainCategory);
  const currentSubConfig = allSubCategories.value.find(
    (c) => c.key === currentSub
  );

  // 先获取第一个可见子分类
  const firstVisibleSubCategory = filteredSubCategories.value[0];

  if (
    !store.showNSFW &&
    currentSubConfig?.nsfw &&
    firstVisibleSubCategory // 直接检查元素是否存在
  ) {
    store.setCurrentSubCategory(
      store.currentMainCategory,
      firstVisibleSubCategory.key // 使用已验证存在的变量
    );
  }
});

// 切换子分类
const switchSubCategory = (subKey: string) => {
  store.setCurrentSubCategory(store.currentMainCategory, subKey);
};

// 清除搜索
const clearSearch = () => {
  store.clearSearch();
};

// 显示增强版工具提示
const showEnhancedTooltip = (item: PromptItem, event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();

  tooltip.english = item.english;
  tooltip.source = getItemSource(item);
  tooltip.nsfw = item.nsfw || false;
  tooltip.x = rect.left + rect.width / 2;
  tooltip.y = rect.bottom + window.scrollY + 8;
  tooltip.visible = true;
};

// 隐藏工具提示
const hideTooltip = () => {
  tooltip.visible = false;
};

// 判断是否已选中
function isItemSelected(item: PromptItem): boolean {
  if (store.isSearchMode) {
    const result = store.searchResults.find((r) => r.item === item);
    if (!result) return false;
    return store.isSelected({
      ...item,
      category: result.category,
      subCategory: result.subCategory,
    });
  } else {
    return store.isSelected({
      ...item,
      category: store.currentMainCategory,
      subCategory: store.getCurrentSubCategory(store.currentMainCategory),
    });
  }
}

// 切换选中状态
function onToggleItem(item: PromptItem) {
  if (store.isSearchMode) {
    const result = store.searchResults.find((r) => r.item === item);
    if (result) {
      store.toggleItem({
        ...item,
        category: result.category,
        subCategory: result.subCategory,
      });
    }
  } else {
    store.toggleItem({
      ...item,
      category: store.currentMainCategory,
      subCategory: store.getCurrentSubCategory(store.currentMainCategory),
    });
  }
  hideTooltip();
}
</script>
