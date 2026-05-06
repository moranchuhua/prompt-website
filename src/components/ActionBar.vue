<!-- src/components/ActionBar.vue -->
<template>
  <div class="action-bar">
    <ImportExport />

    <button
      class="action-btn copy-btn"
      :class="{ 'copy-success': copyEnglishStatus === 'success' }"
      @click="copyEnglish"
    >
      <span class="btn-text">{{ copyEnglishBtnText }}</span>
    </button>

    <button
      class="action-btn copy-chinese-btn"
      :class="{ 'copy-success': copyChineseStatus === 'success' }"
      @click="copyChinese"
    >
      <span class="btn-text">{{ copyChineseBtnText }}</span>
    </button>

    <div class="clear-group">
      <button class="action-btn clear-btn" @click="clearAll">
        <span class="btn-text">清空全部</span>
      </button>

      <button
        class="action-btn undo-btn"
        :class="{ 'can-undo': store.canUndo }"
        @click="undoClear"
        :disabled="!store.canUndo"
      >
        <span class="btn-text">撤销</span>
      </button>
    </div>

    <!-- 全局提示 -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="showToast" class="global-toast">
          <span class="toast-icon">✅</span>
          {{ toastMessage }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePromptStore } from "../stores/promptStore";
import ImportExport from "./ImportExport.vue";

const store = usePromptStore();

const copyEnglishStatus = ref<"idle" | "success" | "error">("idle");
const copyChineseStatus = ref<"idle" | "success" | "error">("idle");
const showToast = ref(false);
const toastMessage = ref("");

const copyEnglishBtnText = computed(() => {
  switch (copyEnglishStatus.value) {
    case "success":
      return "英文复制成功";
    case "error":
      return "英文复制失败";
    default:
      return "复制全部英文";
  }
});

const copyChineseBtnText = computed(() => {
  switch (copyChineseStatus.value) {
    case "success":
      return "中文复制成功";
    case "error":
      return "中文复制失败";
    default:
      return "复制全部中文";
  }
});

const showToastMessage = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

const copyEnglish = async () => {
  if (store.selectedItems.length === 0) {
    showToastMessage("当前没有选中任何标签");
    copyEnglishStatus.value = "error";
    setTimeout(() => {
      copyEnglishStatus.value = "idle";
    }, 2000);
    return;
  }

  await copyToClipboard(store.fullEnglishText, "english");
};

const copyChinese = async () => {
  if (store.selectedItems.length === 0) {
    showToastMessage("当前没有选中任何标签");
    copyChineseStatus.value = "error";
    setTimeout(() => {
      copyChineseStatus.value = "idle";
    }, 2000);
    return;
  }

  await copyToClipboard(store.fullChineseText, "chinese");
};

const copyToClipboard = async (text: string, type: "english" | "chinese") => {
  try {
    await navigator.clipboard.writeText(text);

    if (type === "english") {
      copyEnglishStatus.value = "success";
    } else {
      copyChineseStatus.value = "success";
    }

    showToastMessage("已复制到剪贴板！");

    setTimeout(() => {
      if (type === "english") {
        copyEnglishStatus.value = "idle";
      } else {
        copyChineseStatus.value = "idle";
      }
    }, 2000);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const success = document.execCommand("copy");
      if (success) {
        if (type === "english") {
          copyEnglishStatus.value = "success";
        } else {
          copyChineseStatus.value = "success";
        }
        showToastMessage("已复制到剪贴板！");
      } else {
        throw new Error("Copy failed");
      }
    } catch {
      if (type === "english") {
        copyEnglishStatus.value = "error";
      } else {
        copyChineseStatus.value = "error";
      }
      showToastMessage("复制失败，请手动复制");
    } finally {
      document.body.removeChild(textarea);
    }

    setTimeout(() => {
      if (type === "english") {
        copyEnglishStatus.value = "idle";
      } else {
        copyChineseStatus.value = "idle";
      }
    }, 2000);
  }
};

const clearAll = () => {
  if (store.selectedItems.length === 0) {
    showToastMessage("已是空状态");
    return;
  }

  store.clearAll();
  showToastMessage("已清空所有提示词");
};

const undoClear = () => {
  if (store.canUndo) {
    store.undoClear();
    showToastMessage("已恢复清空的提示词");
  }
};
</script>
