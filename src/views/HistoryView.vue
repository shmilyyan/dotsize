<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'

const router = useRouter()
const historyStore = useHistoryStore()

// 格式化日期
const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}

// 格式化文件大小
const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// 返回首页
const goBack = () => {
  router.push('/')
}

// 清空历史
const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    historyStore.clear()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <button class="p-2 -ml-2" @click="goBack">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="font-semibold text-gray-800">历史记录</h1>
        <button
          v-if="historyStore.items.length > 0"
          class="p-2 -mr-2 text-red-500"
          @click="clearHistory"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-4">
      <!-- 空状态 -->
      <div v-if="historyStore.items.length === 0" class="text-center py-20">
        <div class="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-500">暂无历史记录</p>
        <p class="text-sm text-gray-400 mt-1">处理的照片将显示在这里</p>
      </div>

      <!-- 历史列表 -->
      <div v-else class="space-y-3">
        <div
          v-for="item in historyStore.items"
          :key="item.id"
          class="bg-white rounded-xl p-4 shadow-sm"
        >
          <div class="flex items-start gap-3">
            <!-- 缩略图占位 -->
            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- 信息 -->
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-800 truncate">{{ item.templateName }}</h4>
              <p class="text-sm text-gray-500 mt-1">
                {{ item.templateWidth }} × {{ item.templateHeight }} px
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatSize(item.fileSize) }} · {{ formatDate(item.exportedAt) }}
              </p>
            </div>

            <!-- 删除按钮 -->
            <button
              class="p-2 text-gray-400 hover:text-red-500"
              @click="historyStore.remove(item.id)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
