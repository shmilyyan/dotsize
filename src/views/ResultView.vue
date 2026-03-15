<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useImageStore } from '@/stores/image'
import { useHistoryStore } from '@/stores/history'
import { useShare } from '@/composables/useShare'

const router = useRouter()
const imageStore = useImageStore()
const historyStore = useHistoryStore()
const { shareImage, downloadImage, canShare } = useShare()

const isSharing = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const filename = computed(() => {
  if (!imageStore.selectedTemplate) return 'dotsize-export.jpg'
  const ext = imageStore.exportConfig.format === 'png' ? 'png' : 'jpg'
  return `dotsize_${imageStore.selectedTemplate.name}_${Date.now()}.${ext}`
})

// 保存到历史记录
const saveToHistory = () => {
  if (imageStore.croppedBlob && imageStore.selectedTemplate) {
    historyStore.add({
      originalName: '原始图片',
      templateName: imageStore.selectedTemplate.name,
      templateWidth: imageStore.selectedTemplate.widthPx,
      templateHeight: imageStore.selectedTemplate.heightPx,
      fileSize: imageStore.croppedBlob.size,
    })
  }
}

// 下载图片
const handleDownload = () => {
  if (!imageStore.croppedBlob) return
  downloadImage(imageStore.croppedBlob, filename.value)
  saveToHistory()
  showToastMessage('图片已下载')
}

// 分享图片
const handleShare = async () => {
  if (!imageStore.croppedBlob) return

  isSharing.value = true
  const success = await shareImage(imageStore.croppedBlob, filename.value)
  isSharing.value = false

  if (success) {
    showToastMessage('分享成功')
  }
}

// 显示提示
const showToastMessage = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 重新处理
const handleReset = () => {
  imageStore.reset()
  router.push('/')
}

// 继续处理
const handleContinue = () => {
  imageStore.croppedBlob = null
  imageStore.croppedUrl = null
  router.push('/editor')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <button class="p-2 -ml-2" @click="handleReset">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <h1 class="font-semibold text-gray-800">导出成功</h1>
        <button class="p-2 -mr-2" @click="handleContinue">
          <span class="text-primary font-medium">继续</span>
        </button>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6">
      <!-- 成功图标 -->
      <div class="text-center mb-6">
        <div class="w-20 h-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800">处理完成</h2>
        <p v-if="imageStore.selectedTemplate" class="text-gray-500">
          {{ imageStore.selectedTemplate.name }}
          <span v-if="imageStore.croppedSize" class="text-sm">({{ imageStore.croppedSize }})</span>
        </p>
      </div>

      <!-- 结果预览 -->
      <div v-if="imageStore.croppedUrl" class="mb-6">
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div
            class="relative overflow-hidden rounded-lg mx-auto"
            :style="{
              aspectRatio: imageStore.selectedTemplate
                ? `${imageStore.selectedTemplate.widthPx} / ${imageStore.selectedTemplate.heightPx}`
                : '1'
            }"
          >
            <img
              :src="imageStore.croppedUrl"
              class="w-full h-full object-contain"
              alt="处理结果"
            />
          </div>

          <!-- 尺寸信息 -->
          <div v-if="imageStore.selectedTemplate" class="mt-4 text-center text-sm text-gray-500">
            <p>{{ imageStore.selectedTemplate.widthPx }} × {{ imageStore.selectedTemplate.heightPx }} px @ 300 DPI</p>
            <p v-if="imageStore.selectedTemplate.widthMm > 0">{{ imageStore.selectedTemplate.widthMm }} × {{ imageStore.selectedTemplate.heightMm }} mm</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-3">
        <!-- 下载按钮 -->
        <button
          class="w-full py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          @click="handleDownload"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          保存到相册
        </button>

        <!-- 分享按钮 -->
        <button
          v-if="canShare()"
          class="w-full py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          :disabled="isSharing"
          @click="handleShare"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {{ isSharing ? '分享中...' : '分享' }}
        </button>

        <!-- 重新处理 -->
        <button
          class="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
          @click="handleContinue"
        >
          重新选择尺寸
        </button>
      </div>

      <!-- 提示 -->
      <div
        v-if="showToast"
        class="fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-800 text-white rounded-full text-sm shadow-lg transition-opacity"
      >
        {{ toastMessage }}
      </div>
    </main>
  </div>
</template>
