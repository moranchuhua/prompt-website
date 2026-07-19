<!-- src/components/ImportExport.vue -->
<template>
  <div class="import-export">
    <button
      class="action-btn export-btn"
      @click="showExportModal = true"
      title="导出提示词"
    >
      <span class="btn-text">📤 导出</span>
    </button>
    <button
      class="action-btn import-btn"
      @click="showImportModal = true"
      title="导入提示词"
    >
      <span class="btn-text">📥 导入</span>
    </button>

    <!-- 导出模态框 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showExportModal"
          class="modal-overlay"
          @click.self="showExportModal = false"
        >
          <div class="modal-content export-modal">
            <div class="modal-header">
              <h3>
                <span class="header-icon">📤</span>
                导出提示词 (JSON格式)
              </h3>
              <button class="close-btn" @click="showExportModal = false">
                ✕
              </button>
            </div>
            <div class="modal-body">
              <div class="export-preview">
                <div class="preview-header">
                  <span class="preview-title"
                    >预览 ({{ store.totalCount }} 项)</span
                  >
                  <button class="copy-btn" @click="copyToClipboard(exportText)">
                    📋 复制
                  </button>
                </div>
                <textarea
                  v-model="exportText"
                  readonly
                  class="export-textarea json-mode"
                  @click="selectAllText"
                ></textarea>
              </div>

              <div class="export-options">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="includeWeights" />
                  <span>包含权重值</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="prettyPrint" />
                  <span>格式化输出（美化JSON）</span>
                </label>
              </div>

              <div class="export-info">
                <span class="info-icon">ℹ️</span>
                <span class="info-text"
                  >导出的JSON文件包含完整的中文、英文、权重和NSFW标记</span
                >
              </div>
            </div>
            <div class="modal-footer">
              <div class="footer-left"></div>
              <div class="footer-right">
                <button class="secondary-btn" @click="showExportModal = false">
                  取消
                </button>
                <button class="primary-btn" @click="downloadExport">
                  <span class="btn-icon">⬇️</span>
                  下载JSON文件
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 导入模态框 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showImportModal"
          class="modal-overlay"
          @click.self="showImportModal = false"
        >
          <div class="modal-content import-modal">
            <div class="modal-header">
              <h3>
                <span class="header-icon">📥</span>
                导入提示词 (JSON格式)
              </h3>
              <button class="close-btn" @click="showImportModal = false">
                ✕
              </button>
            </div>
            <div class="modal-body">
              <!-- 文本导入 -->
              <div class="import-text">
                <textarea
                  v-model="importText"
                  placeholder='粘贴JSON格式提示词，例如：&#10;[&#10;  {&#10;    "chinese": "美丽",&#10;    "english": "beautiful",&#10;    "nsfw": false,&#10;    "weight": 1.2&#10;  }&#10;]'
                  class="import-textarea"
                  :class="{ 'has-error': importError }"
                  @input="clearImportError"
                ></textarea>
                <div v-if="importError" class="import-error">
                  <span class="error-icon">⚠️</span>
                  {{ importError }}
                </div>
                <div v-if="importPreview.length > 0" class="import-preview">
                  <div class="preview-header">
                    <span class="preview-title"
                      >预览 ({{ importPreview.length }} 项)</span
                    >
                    <button
                      class="clear-preview-btn"
                      @click="clearImportPreview"
                      v-if="importPreview.length > 0"
                    >
                      清除
                    </button>
                  </div>
                  <div class="preview-tags">
                    <span
                      v-for="(item, index) in importPreview"
                      :key="index"
                      class="preview-tag"
                      :class="{ 'nsfw-tag': item.nsfw }"
                    >
                      {{ item.chinese }} / {{ item.english }}
                      <span
                        v-if="item.weight && item.weight !== 1.0"
                        class="preview-weight"
                      >
                        :{{ item.weight.toFixed(1) }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- 文件导入 -->
              <div class="import-file">
                <div class="file-info">
                  <span class="info-icon">📁</span>
                  <span class="info-text">支持从JSON文件导入</span>
                </div>
                <div
                  class="file-drop-area"
                  :class="{ 'drag-over': isDragOver }"
                  @dragover.prevent="onDragOver"
                  @dragleave.prevent="onDragLeave"
                  @drop.prevent="onFileDrop"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".json"
                    class="file-input"
                    @change="onFileSelect"
                  />
                  <div class="file-drop-content">
                    <span class="file-icon">📄</span>
                    <span class="file-text">拖放JSON文件到此处或点击选择</span>
                    <span class="file-hint">仅支持 .json 格式</span>
                  </div>
                </div>
                <div v-if="fileName" class="selected-file">
                  <span class="file-name">{{ fileName }}</span>
                  <button class="remove-file-btn" @click="clearSelectedFile">
                    ✕
                  </button>
                </div>
              </div>

              <div class="import-options">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="mergeMode" />
                  <span>合并到现有列表（不勾选则替换）</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preserveWeights" />
                  <span>保留权重信息</span>
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <div class="footer-left"></div>
              <div class="footer-right">
                <button class="secondary-btn" @click="showImportModal = false">
                  取消
                </button>
                <button
                  class="primary-btn"
                  :disabled="!canImport"
                  @click="executeImport"
                >
                  <span class="btn-icon">✅</span>
                  确认导入
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 全局提示 -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="global-toast" :class="toast.type">
          <span class="toast-icon">{{ toast.icon }}</span>
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { usePromptStore } from "../stores/promptStore";
import type { SelectedItem } from "../types";
import "./styles/ImportExport.scss";

const store = usePromptStore();

// 模态框状态
const showExportModal = ref(false);
const showImportModal = ref(false);

// 导出相关
const includeWeights = ref(true);
const prettyPrint = ref(true);

// 导入相关
const importText = ref("");
const importError = ref("");
const importPreview = ref<
  Array<{ chinese: string; english: string; nsfw?: boolean; weight?: number }>
>([]);
const mergeMode = ref(true);
const preserveWeights = ref(true);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const fileName = ref("");
const selectedFile = ref<File | null>(null);

// 提示相关
const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "error",
  icon: "✅",
});

// 导出文本计算 - 只支持JSON格式
const exportText = computed(() => {
  if (store.selectedItems.length === 0) return "";

  const exportData = store.selectedItems.map((item) => {
    const data: any = {
      chinese: item.chinese,
      english: item.english,
      nsfw: item.nsfw || false,
    };

    if (includeWeights.value && item.weight !== undefined) {
      data.weight = item.weight;
    }

    return data;
  });

  return prettyPrint.value
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData);
});

// 是否可以导入
const canImport = computed(() => {
  return importPreview.value.length > 0 && !importError.value;
});

// 显示提示
const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.value = {
    show: true,
    message,
    type,
    icon: type === "success" ? "✅" : "❌",
  };
  setTimeout(() => {
    toast.value.show = false;
  }, 2000);
};

// 复制到剪贴板（含 fallback 支持 HTTP 环境）
const copyToClipboard = async (text: string) => {
  if (!text) {
    showToast("没有内容可复制", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("已复制到剪贴板");
  } catch {
    // fallback: 使用传统的 execCommand 方式（支持 HTTP 环境）
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
        showToast("已复制到剪贴板");
      } else {
        throw new Error("Copy failed");
      }
    } catch {
      showToast("复制失败", "error");
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

// 全选文本
const selectAllText = (event: MouseEvent) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.select();
};

// 下载导出文件
const downloadExport = () => {
  if (!exportText.value) {
    showToast("没有内容可导出", "error");
    return;
  }

  const filename = `prompts-${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([exportText.value], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast("JSON文件已下载");
};

// 清除导入错误
const clearImportError = () => {
  importError.value = "";
};

// 解析导入JSON
const parseImportJSON = (text: string) => {
  try {
    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed)) {
      throw new Error("JSON必须是数组格式");
    }

    const items = parsed.map((item, index) => {
      // 验证必填字段
      if (!item.chinese && !item.english) {
        throw new Error(`第 ${index + 1} 项缺少中文或英文内容`);
      }

      return {
        chinese: item.chinese || "",
        english: item.english || "",
        nsfw: item.nsfw === true, // 默认为false
        weight: preserveWeights.value
          ? item.weight && !isNaN(item.weight)
            ? item.weight
            : 1.0
          : 1.0,
      };
    });

    return items;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error("JSON格式错误，请检查语法");
    }
    throw err;
  }
};

// 更新导入预览
const updateImportPreview = () => {
  if (!importText.value.trim()) {
    importPreview.value = [];
    return;
  }

  try {
    const items = parseImportJSON(importText.value);
    importPreview.value = items;
    importError.value = "";
  } catch (err) {
    importError.value = err instanceof Error ? err.message : "解析失败";
    importPreview.value = [];
  }
};

// 监听导入文本变化
watch(importText, () => {
  updateImportPreview();
});

// 文件拖拽处理
const onDragOver = () => {
  isDragOver.value = true;
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onFileDrop = (e: DragEvent) => {
  isDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file) {
      handleFile(file);
    }
  }
};

const onFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file) {
      handleFile(file);
    }
  }
};

const handleFile = (file: File) => {
  // 检查文件类型
  if (!file.name.toLowerCase().endsWith(".json")) {
    importError.value = "请选择JSON格式的文件";
    return;
  }

  selectedFile.value = file;
  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    if (content) {
      importText.value = content;
    }
  };
  reader.onerror = () => {
    importError.value = "文件读取失败";
  };
  reader.readAsText(file);
};

const clearSelectedFile = () => {
  selectedFile.value = null;
  fileName.value = "";
  importText.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const clearImportPreview = () => {
  importText.value = "";
  importPreview.value = [];
  clearSelectedFile();
};

// 执行导入
const executeImport = () => {
  if (importPreview.value.length === 0) {
    showToast("没有可导入的内容", "error");
    return;
  }

  // 将预览项转换为 SelectedItem 格式
  const itemsToImport: SelectedItem[] = importPreview.value.map((item) => ({
    chinese: item.chinese,
    english: item.english,
    nsfw: item.nsfw,
    weight: preserveWeights.value ? item.weight : 1.0,
    category: "imported",
    subCategory: "imported",
  }));

  if (mergeMode.value) {
    // 合并模式：去重后添加
    const existingKeys = new Set(
      store.selectedItems.map((item) => `${item.chinese}-${item.english}`)
    );

    const newItems = itemsToImport.filter(
      (item) => !existingKeys.has(`${item.chinese}-${item.english}`)
    );

    if (newItems.length > 0) {
      store.selectedItems.push(...newItems);
      showToast(`成功导入 ${newItems.length} 项`);
    } else {
      showToast("没有新内容可导入", "error");
    }
  } else {
    // 替换模式
    store.selectedItems = itemsToImport;
    showToast(`已替换为 ${itemsToImport.length} 项`);
  }

  // 关闭模态框并重置状态
  showImportModal.value = false;
  setTimeout(() => {
    importText.value = "";
    importPreview.value = [];
    clearSelectedFile();
    importError.value = "";
  }, 300);
};

// 监听模态框关闭
watch(showImportModal, (newVal) => {
  if (!newVal) {
    // 延迟重置，避免闪烁
    setTimeout(() => {
      importText.value = "";
      importPreview.value = [];
      clearSelectedFile();
      importError.value = "";
    }, 300);
  }
});
</script>
