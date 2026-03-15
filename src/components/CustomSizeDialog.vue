<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SizeTemplate } from '@/types'

const emit = defineEmits<{
  (e: 'confirm', template: SizeTemplate): void
  (e: 'cancel'): void
}>()

// 表单数据
const width = ref(25)
const height = ref(35)
const unit = ref<'mm' | 'px'>('mm')
const templateName = ref('')

// DPI选择
const dpi = ref(300)

// 验证
const isValid = computed(() => {
  if (unit.value === 'mm') {
    return width.value > 0 && height.value > 0 && width.value <= 500 && height.value <= 500
  } else {
    return width.value > 0 && height.value > 0 && width.value <= 5000 && height.value <= 5000
  }
})

// 像素尺寸预览
const pixelSize = computed(() => {
  if (unit.value === 'mm') {
    return {
      width: Math.round((width.value / 25.4) * dpi.value),
      height: Math.round((height.value / 25.4) * dpi.value),
    }
  }
  return { width: width.value, height: height.value }
})

// 确认
const handleConfirm = () => {
  const template: SizeTemplate = {
    id: `custom_${Date.now()}`,
    name: templateName.value || `自定义 ${width.value}×${height.value}`,
    category: '自定义',
    widthMm: unit.value === 'mm' ? width.value : 0,
    heightMm: unit.value === 'mm' ? height.value : 0,
    widthPx: pixelSize.value.width,
    heightPx: pixelSize.value.height,
    dpi: dpi.value,
    isCustom: true,
  }
  emit('confirm', template)
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl w-full max-w-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">自定义尺寸</h3>

      <!-- 模板名称 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-600 mb-1">名称（可选）</label>
        <input
          v-model="templateName"
          type="text"
          placeholder="自定义尺寸"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <!-- 尺寸输入 -->
      <div class="flex gap-3 mb-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-600 mb-1">宽度</label>
          <input
            v-model.number="width"
            type="number"
            min="1"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-600 mb-1">高度</label>
          <input
            v-model.number="height"
            type="number"
            min="1"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <!-- 单位选择 -->
      <div class="flex gap-2 mb-4">
        <button
          class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="unit === 'mm' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
          @click="unit = 'mm'"
        >
          毫米 (mm)
        </button>
        <button
          class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="unit === 'px' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
          @click="unit = 'px'"
        >
          像素 (px)
        </button>
      </div>

      <!-- DPI选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-600 mb-1">DPI</label>
        <select
          v-model.number="dpi"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option :value="72">72 (屏幕显示)</option>
          <option :value="150">150 (低质量打印)</option>
          <option :value="300">300 (标准打印)</option>
          <option :value="600">600 (高质量打印)</option>
        </select>
      </div>

      <!-- 预览 -->
      <div v-if="isValid" class="mb-4 p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">
          输出尺寸: {{ pixelSize.width }} × {{ pixelSize.height }} px
        </p>
      </div>

      <!-- 按钮 -->
      <div class="flex gap-3">
        <button
          class="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          @click="emit('cancel')"
        >
          取消
        </button>
        <button
          class="flex-1 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          :disabled="!isValid"
          @click="handleConfirm"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>
