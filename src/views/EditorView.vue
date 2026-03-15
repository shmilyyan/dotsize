<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useImageStore } from '@/stores/image'
import { useCamera } from '@/composables/useCamera'
import { useImageProcessor } from '@/composables/useImageProcessor'
import { useBeautyFilter } from '@/composables/useBeautyFilter'
import { templatesByCategory as defaultTemplatesByCategory } from '@/constants/sizeTemplates'
import CustomSizeDialog from '@/components/CustomSizeDialog.vue'
import type { SizeTemplate } from '@/types'

const router = useRouter()
const route = useRoute()
const imageStore = useImageStore()

// 摄像头相关
const videoRef = ref<HTMLVideoElement | null>(null)
const { startCamera, takePhoto, stopCamera } = useCamera()

// 图片处理相关
const { cropToTemplate, isProcessing } = useImageProcessor()

// 美颜滤镜
const { currentFilter, presetFilters } = useBeautyFilter()

// 状态
const mode = computed(() => route.query.mode as string || 'select')
const showCamera = computed(() => mode.value === 'camera')
const currentFacing = ref<'user' | 'environment'>('environment')

// 尺寸选择
const categories = ref([...Object.keys(defaultTemplatesByCategory), '自定义'])
const selectedCategory = ref(categories.value[0])
const selectedSizeId = ref('')

// 自定义模板
const customTemplates = ref<SizeTemplate[]>([])
const showCustomDialog = ref(false)

// 合并所有模板
const templatesByCategory = computed(() => {
  const result = { ...defaultTemplatesByCategory }
  if (customTemplates.value.length > 0) {
    result['自定义'] = customTemplates.value
  }
  return result
})

// 确认自定义尺寸
const handleCustomConfirm = (template: SizeTemplate) => {
  customTemplates.value.push(template)
  handleSelectSize(template)
  showCustomDialog.value = false
}

// 导出设置
const exportFormat = ref<'jpeg' | 'png'>('jpeg')
const exportQuality = ref(95)

// 初始化
onMounted(async () => {
  if (!imageStore.hasOriginal && !showCamera.value) {
    router.push('/')
    return
  }

  if (showCamera.value && videoRef.value) {
    await startCamera(videoRef.value, currentFacing.value)
  }
})

onUnmounted(() => {
  stopCamera()
})

// 拍照
const handleTakePhoto = async () => {
  if (!videoRef.value) return
  const blob = await takePhoto(videoRef.value, currentFilter.value.cssFilter)
  if (blob) {
    imageStore.setOriginal(blob)
    showCamera.value && stopCamera()
    // 切换到选择模式
    router.replace('/editor')
  }
}

// 切换摄像头
const handleSwitchCamera = async () => {
  if (!videoRef.value) return
  currentFacing.value = currentFacing.value === 'user' ? 'environment' : 'user'
  await startCamera(videoRef.value, currentFacing.value)
}

// 监听滤镜变化，实时应用到视频
watch(currentFilter, () => {
  if (videoRef.value) {
    videoRef.value.style.filter = currentFilter.value.cssFilter === 'none' ? '' : currentFilter.value.cssFilter
  }
})

// 选择尺寸
const handleSelectSize = (template: SizeTemplate) => {
  imageStore.setTemplate(template)
  selectedSizeId.value = template.id
}

// 开始处理
const handleProcess = async () => {
  if (!imageStore.selectedTemplate || !imageStore.originalUrl) return

  try {
    const img = new Image()
    img.src = imageStore.originalUrl
    await new Promise((resolve) => (img.onload = resolve))

    const quality = exportFormat.value === 'png' ? 1 : exportQuality.value / 100

    let blob: Blob
    if (exportFormat.value === 'png') {
      // TODO: 使用exportPng
      blob = await cropToTemplate(img, imageStore.selectedTemplate, 1)
    } else {
      blob = await cropToTemplate(img, imageStore.selectedTemplate, quality)
    }

    imageStore.setCropped(blob)
    router.push('/result')
  } catch (err) {
    alert('处理失败，请重试')
  }
}

// 返回
const handleBack = () => {
  stopCamera()
  imageStore.reset()
  router.push('/')
}

// 选择文件
const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    imageStore.setOriginal(input.files[0])
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <button class="p-2 -ml-2" @click="handleBack">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="font-semibold text-gray-800">选择尺寸</h1>
        <div class="w-10"></div>
      </div>
    </header>

    <!-- 摄像头模式 -->
    <div v-if="showCamera" class="relative">
      <video
        ref="videoRef"
        class="w-full h-[60vh] object-cover"
        autoplay
        playsinline
        muted
      ></video>

      <!-- 滤镜选择 -->
      <div class="absolute top-20 left-0 right-0 px-4">
        <div class="bg-black/40 backdrop-blur rounded-2xl p-3">
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="filter in presetFilters"
              :key="filter.id"
              class="flex-shrink-0 text-center"
              @click="currentFilter = filter"
            >
              <div
                class="w-12 h-12 rounded-lg mb-1 transition-all overflow-hidden"
                :class="currentFilter.id === filter.id ? 'ring-2 ring-white' : ''"
                :style="{ filter: filter.cssFilter === 'none' ? 'none' : filter.cssFilter }"
              >
                <div class="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300"></div>
              </div>
              <span class="text-xs text-white">{{ filter.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 摄像头控制 -->
      <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
        <div class="flex justify-center items-center gap-8">
          <!-- 切换摄像头 -->
          <button
            class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
            @click="handleSwitchCamera"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <!-- 拍照按钮 -->
          <button
            class="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center hover:scale-105 transition-transform"
            @click="handleTakePhoto"
          >
            <div class="w-16 h-16 bg-white rounded-full border-2 border-gray-400"></div>
          </button>

          <!-- 相册选择 -->
          <label class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center cursor-pointer">
            <input type="file" accept="image/*" class="hidden" @change="handleFileChange">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>
        </div>
      </div>
    </div>

    <!-- 选择模式 -->
    <main v-else class="max-w-lg mx-auto px-4 py-6">
      <!-- 图片预览 -->
      <div v-if="imageStore.originalUrl" class="mb-6">
        <img
          :src="imageStore.originalUrl"
          class="w-full h-48 object-contain bg-gray-200 rounded-xl"
          alt="预览"
        />
        <p class="text-center text-sm text-gray-500 mt-2">
          {{ imageStore.originalSize }}
        </p>
      </div>

      <!-- 尺寸选择 -->
      <div class="mb-6">
        <!-- 分类标签 -->
        <div class="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button
            v-for="cat in categories"
            :key="cat"
            class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors"
            :class="selectedCategory === cat
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- 尺寸列表 -->
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="template in templatesByCategory[selectedCategory]"
            :key="template.id"
            class="p-4 rounded-xl text-left transition-all"
            :class="selectedSizeId === template.id
              ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
              : 'bg-white hover:shadow-md'"
            @click="handleSelectSize(template)"
          >
            <div class="font-medium">{{ template.name }}</div>
            <div class="text-sm opacity-75">
              {{ template.widthMm > 0
                ? `${template.widthMm}×${template.heightMm}mm`
                : `${template.widthPx}×${template.heightPx}px` }}
            </div>
          </button>
        </div>
      </div>

      <!-- 导出设置 -->
      <div class="bg-white rounded-xl p-4 mb-6">
        <h3 class="font-medium text-gray-800 mb-4">导出设置</h3>

        <!-- 格式选择 -->
        <div class="flex gap-2 mb-4">
          <button
            class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="exportFormat === 'jpeg'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'"
            @click="exportFormat = 'jpeg'"
          >
            JPEG
          </button>
          <button
            class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="exportFormat === 'png'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'"
            @click="exportFormat = 'png'"
          >
            PNG
          </button>
        </div>

        <!-- 质量滑块 -->
        <div v-if="exportFormat === 'jpeg'" class="mb-2">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>质量</span>
            <span>{{ exportQuality }}%</span>
          </div>
          <input
            v-model="exportQuality"
            type="range"
            min="50"
            max="100"
            class="w-full accent-primary"
          />
        </div>
      </div>

      <!-- 处理按钮 -->
      <button
        class="w-full py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!imageStore.selectedTemplate || isProcessing"
        @click="handleProcess"
      >
        {{ isProcessing ? '处理中...' : '开始处理' }}
      </button>

      <!-- 自定义尺寸按钮 -->
      <button
        class="w-full py-3 mt-3 border border-primary text-primary font-medium rounded-xl hover:bg-primary/5 transition-colors"
        @click="showCustomDialog = true"
      >
        + 自定义尺寸
      </button>
    </main>

    <!-- 自定义尺寸对话框 -->
    <CustomSizeDialog
      v-if="showCustomDialog"
      @confirm="handleCustomConfirm"
      @cancel="showCustomDialog = false"
    />
  </div>
</template>
