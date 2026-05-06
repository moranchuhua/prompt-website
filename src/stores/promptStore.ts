// src/stores/promptStore.ts
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { SelectedItem, SearchResult } from '../types';
import { mainCategoryConfigs } from '../data/categoryConfig';
import { getCategoryCounts } from '../data/loader';

// 缓存过期时间：1小时（毫秒）
const CACHE_EXPIRY = 60 * 60 * 1000;

// 存储键名
const STORAGE_KEYS = {
  SELECTED_ITEMS: 'prompt-selected-items',
  NSFW_ENABLED: 'nsfw-enabled',
  SUB_CATEGORY_STATES: 'prompt-sub-category-states',
  CURRENT_MAIN_CATEGORY: 'prompt-current-main-category'
};

export const usePromptStore = defineStore('prompt', () => {
  // 加载已选提示词
  const loadSelectedItems = (): SelectedItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_ITEMS);
      if (!stored) return [];
      
      const data = JSON.parse(stored);
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_ITEMS);
        return [];
      }
      return data.value || [];
    } catch (error) {
      console.error('读取已选提示词失败:', error);
      return [];
    }
  };

  const saveSelectedItems = (items: SelectedItem[]) => {
    try {
      const data = {
        value: items,
        expiry: Date.now() + CACHE_EXPIRY
      };
      localStorage.setItem(STORAGE_KEYS.SELECTED_ITEMS, JSON.stringify(data));
    } catch (error) {
      console.error('保存已选提示词失败:', error);
    }
  };

  // 状态
  const selectedItems = ref<SelectedItem[]>(loadSelectedItems());
  
  // 添加上一次清空前的状态备份
  const lastClearedItems = ref<SelectedItem[] | null>(null);
  
  // 加载当前主分类
  const loadCurrentMainCategory = (): string => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_MAIN_CATEGORY);
      if (!stored) return 'picture';
      
      const data = JSON.parse(stored);
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_MAIN_CATEGORY);
        return 'picture';
      }
      return data.value || 'picture';
    } catch (error) {
      console.error('读取当前主分类失败:', error);
      return 'picture';
    }
  };

  const currentMainCategory = ref<string>(loadCurrentMainCategory());
  const activeTagIndex = ref<number | null>(null);
  
  // 搜索状态
  const searchQuery = ref<string>('');
  const searchResults = ref<SearchResult[]>([]);
  const isSearching = ref<boolean>(false);
  
  // 分类统计
  const categoryCounts = ref<Record<string, { total: number; nonNSFW: number }>>({});
  
  // NSFW 状态
  const loadNSFWState = (): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NSFW_ENABLED);
      if (!stored) return false;
      
      const data = JSON.parse(stored);
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(STORAGE_KEYS.NSFW_ENABLED);
        return false;
      }
      return data.value ?? false;
    } catch (error) {
      console.error('读取 NSFW 状态失败:', error);
      return false;
    }
  };
  
  const saveNSFWState = (value: boolean) => {
    try {
      const data = {
        value,
        expiry: Date.now() + CACHE_EXPIRY
      };
      localStorage.setItem(STORAGE_KEYS.NSFW_ENABLED, JSON.stringify(data));
    } catch (error) {
      console.error('保存 NSFW 状态失败:', error);
    }
  };

  const showNSFW = ref<boolean>(loadNSFWState());

  // 加载子分类状态
  const loadSubCategoryStates = (): Record<string, string> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUB_CATEGORY_STATES);
      if (!stored) return {};
      
      const data = JSON.parse(stored);
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(STORAGE_KEYS.SUB_CATEGORY_STATES);
        return {};
      }
      return data.value || {};
    } catch (error) {
      console.error('读取子分类状态失败:', error);
      return {};
    }
  };

  const saveSubCategoryStates = (states: Record<string, string>) => {
    try {
      const data = {
        value: states,
        expiry: Date.now() + CACHE_EXPIRY
      };
      localStorage.setItem(STORAGE_KEYS.SUB_CATEGORY_STATES, JSON.stringify(data));
    } catch (error) {
      console.error('保存子分类状态失败:', error);
    }
  };

  // 子分类状态
  const subCategoryStates = ref<Record<string, string>>(loadSubCategoryStates());
  
  // 初始化子分类状态（如果缓存中没有，则使用默认值）
  mainCategoryConfigs.forEach(config => {
    if (config.subCategories.length > 0 && config.subCategories[0]) {
      if (!subCategoryStates.value[config.id]) {
        subCategoryStates.value[config.id] = config.subCategories[0].key;
      }
    }
  });

  // 监听 selectedItems 变化
  watch(selectedItems, (newValue) => {
    saveSelectedItems(newValue);
  }, { deep: true });

  // 监听 currentMainCategory 变化
  watch(currentMainCategory, (newValue) => {
    try {
      const data = {
        value: newValue,
        expiry: Date.now() + CACHE_EXPIRY
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_MAIN_CATEGORY, JSON.stringify(data));
    } catch (error) {
      console.error('保存当前主分类失败:', error);
    }
  });

  // 监听 NSFW 状态变化
  watch(showNSFW, (newValue) => {
    saveNSFWState(newValue);
  });

  // 监听子分类状态变化
  watch(subCategoryStates, (newValue) => {
    saveSubCategoryStates(newValue);
  }, { deep: true });

  // 计算属性
  const totalCount = computed(() => selectedItems.value.length);
  
  const getEnglishWithWeight = (item: SelectedItem): string => {
    const weight = item.weight ?? 1.0;
    if (Math.abs(weight - 1.0) < 0.001) return item.english;
    return `(${item.english}:${weight.toFixed(1)})`;
  };

  const fullEnglishText = computed(() => 
    selectedItems.value.map(item => getEnglishWithWeight(item)).join(', ')
  );

  const fullChineseText = computed(() => 
    selectedItems.value.map(item => item.chinese).join('，')
  );

  // 是否可以撤销
  const canUndo = computed(() => lastClearedItems.value !== null);

  // 是否是搜索模式
  const isSearchMode = computed(() => searchQuery.value.trim().length > 0);

  // 获取分类统计数（根据 NSFW 状态）
  function getCategoryCount(categoryId: string): number {
    const counts = categoryCounts.value[categoryId];
    if (!counts) return 0;
    return showNSFW.value ? counts.total : counts.nonNSFW;
  }

  // 更新分类统计
  async function updateCategoryCounts() {
    const counts = await getCategoryCounts();
    categoryCounts.value = counts;
  }

  // 操作方法
  function toggleItem(item: Omit<SelectedItem, 'weight'>) {
    const existingIndex = selectedItems.value.findIndex(
      i => i.category === item.category && 
           i.subCategory === item.subCategory && 
           i.chinese === item.chinese && 
           i.english === item.english
    );

    if (existingIndex !== -1) {
      selectedItems.value.splice(existingIndex, 1);
      if (activeTagIndex.value === existingIndex) {
        activeTagIndex.value = null;
      } else if (activeTagIndex.value !== null && activeTagIndex.value > existingIndex) {
        activeTagIndex.value -= 1;
      }
    } else {
      selectedItems.value.push({ ...item, weight: 1.0 });
    }
  }

  function adjustWeight(index: number, delta: number) {
    const item = selectedItems.value[index];
    if (!item) return;
    
    let newWeight = (item.weight ?? 1.0) + delta;
    newWeight = Math.round(newWeight * 10) / 10;
    newWeight = Math.max(0.1, Math.min(5.0, newWeight));
    
    item.weight = newWeight;
  }

  function removeItem(index: number) {
    selectedItems.value.splice(index, 1);
    if (activeTagIndex.value === index) {
      activeTagIndex.value = null;
    } else if (activeTagIndex.value !== null && activeTagIndex.value > index) {
      activeTagIndex.value -= 1;
    }
  }

  function reorderItems(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= selectedItems.value.length || toIndex >= selectedItems.value.length) return;
    
    const items = [...selectedItems.value];
    const [moved] = items.splice(fromIndex, 1);
    if (!moved) return;
    
    items.splice(toIndex, 0, moved);
    selectedItems.value = items;
    
    if (activeTagIndex.value !== null) {
      if (activeTagIndex.value === fromIndex) {
        activeTagIndex.value = toIndex;
      } else if (activeTagIndex.value === toIndex) {
        activeTagIndex.value = fromIndex;
      } else if (activeTagIndex.value > fromIndex && activeTagIndex.value <= toIndex) {
        activeTagIndex.value -= 1;
      } else if (activeTagIndex.value < fromIndex && activeTagIndex.value >= toIndex) {
        activeTagIndex.value += 1;
      }
    }
  }

  // 修改 clearAll 方法，保存备份
  function clearAll() {
    if (selectedItems.value.length > 0) {
      // 保存当前状态到备份
      lastClearedItems.value = [...selectedItems.value];
      selectedItems.value = [];
      activeTagIndex.value = null;
      // 清除缓存
      localStorage.removeItem(STORAGE_KEYS.SELECTED_ITEMS);
    }
  }

  // 添加撤销方法
  function undoClear() {
    if (lastClearedItems.value) {
      selectedItems.value = [...lastClearedItems.value];
      lastClearedItems.value = null;
    }
  }

  function setActiveTagIndex(index: number | null) {
    activeTagIndex.value = index;
  }

  function setCurrentSubCategory(main: string, sub: string) {
    if (main) {
      subCategoryStates.value[main] = sub;
    }
  }

  function getCurrentSubCategory(main: string): string {
    return subCategoryStates.value[main] || '';
  }

  function isSelected(item: { chinese: string; english: string; category: string; subCategory: string }): boolean {
    return selectedItems.value.some(
      i => i.category === item.category && 
           i.subCategory === item.subCategory && 
           i.chinese === item.chinese && 
           i.english === item.english
    );
  }

  // 搜索相关方法
  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function setSearchResults(results: SearchResult[]) {
    searchResults.value = results;
  }

  function setIsSearching(value: boolean) {
    isSearching.value = value;
  }

  function clearSearch() {
    searchQuery.value = '';
    searchResults.value = [];
    isSearching.value = false;
  }

  // NSFW 相关方法
  function toggleNSFW() {
    showNSFW.value = !showNSFW.value;
  }

  function setShowNSFW(value: boolean) {
    showNSFW.value = value;
  }

  // 初始化加载分类统计
  updateCategoryCounts();

  return {
    selectedItems,
    currentMainCategory,
    activeTagIndex,
    searchQuery,
    searchResults,
    isSearching,
    isSearchMode,
    showNSFW,
    categoryCounts,
    lastClearedItems,  // 导出备份状态
    canUndo,           // 导出计算属性
    
    totalCount,
    fullEnglishText,
    fullChineseText,
    
    toggleItem,
    adjustWeight,
    removeItem,
    reorderItems,
    clearAll,
    undoClear,         // 导出撤销方法
    setActiveTagIndex,
    setCurrentSubCategory,
    getCurrentSubCategory,
    isSelected,
    getEnglishWithWeight,
    
    setSearchQuery,
    setSearchResults,
    setIsSearching,
    clearSearch,
    
    toggleNSFW,
    setShowNSFW,
    
    getCategoryCount,
    updateCategoryCounts
  };
});