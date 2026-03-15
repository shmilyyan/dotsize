<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useImageStore } from '@/stores/image'

const router = useRouter()
const imageStore = useImageStore()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

// 文件选择处理
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

// 处理文件
const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  imageStore.setOriginal(file)
  router.push('/editor')
}

// 拖拽处理
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files[0]) {
    processFile(e.dataTransfer.files[0])
  }
}

// 打开摄像头
const openCamera = () => {
  router.push('/editor?mode=camera')
}

// 最近使用（从localStorage读取）
const recentSizes = ['一寸照片', '二寸照片', '微信头像']
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800">DotSize</h1>
        <button
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          @click="router.push('/result')"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-8">
      <!-- Logo区域 -->
      <div class="text-center mb-10">
        <div class="w-24 h-24 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">照片尺寸工具</h2>
        <p class="text-gray-500">打开浏览器即可使用，无需安装</p>
      </div>

      <!-- 主要操作 -->
      <div class="space-y-4">
        <!-- 拍照按钮 -->
        <button
          class="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          @click="openCamera"
        >
          <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-semibold text-gray-800">相机拍照</h3>
            <p class="text-sm text-gray-500">直接拍摄照片</p>
          </div>
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- 上传按钮 -->
        <div
          class="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed"
          :class="isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          @click="fileInput?.click()"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1 text-left">
              <h3 class="font-semibold text-gray-800">从相册选择</h3>
              <p class="text-sm text-gray-500">点击或拖拽上传</p>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 最近使用 -->
      <div class="mt-8">
        <h3 class="text-sm font-medium text-gray-600 mb-3">最近使用</h3>
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="size in recentSizes"
            :key="size"
            class="px-4 py-2 bg-white rounded-full text-sm text-gray-700 shadow-sm whitespace-nowrap hover:bg-gray-50"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
