import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { SizeTemplate, ExportConfig } from '@/types'

export const useImageStore = defineStore('image', () => {
  // State
  const originalBlob = ref<Blob | null>(null)
  const originalUrl = ref<string | null>(null)
  const croppedBlob = ref<Blob | null>(null)
  const croppedUrl = ref<string | null>(null)
  const selectedTemplate = ref<SizeTemplate | null>(null)
  const exportConfig = ref<ExportConfig>({
    format: 'jpeg',
    quality: 0.95,
  })

  // Getters
  const hasOriginal = computed(() => !!originalBlob.value)
  const hasCropped = computed(() => !!croppedBlob.value)
  const originalSize = computed(() => {
    if (!originalBlob.value) return null
    return `${(originalBlob.value.size / 1024 / 1024).toFixed(2)} MB`
  })
  const croppedSize = computed(() => {
    if (!croppedBlob.value) return null
    return `${(croppedBlob.value.size / 1024).toFixed(1)} KB`
  })

  // Actions
  const setOriginal = (blob: Blob) => {
    // 清理旧的URL
    if (originalUrl.value) {
      URL.revokeObjectURL(originalUrl.value)
    }
    originalBlob.value = blob
    originalUrl.value = URL.createObjectURL(blob)
    // 重置裁剪
    croppedBlob.value = null
    if (croppedUrl.value) {
      URL.revokeObjectURL(croppedUrl.value)
      croppedUrl.value = null
    }
  }

  const setCropped = (blob: Blob) => {
    if (croppedUrl.value) {
      URL.revokeObjectURL(croppedUrl.value)
    }
    croppedBlob.value = blob
    croppedUrl.value = URL.createObjectURL(blob)
  }

  const setTemplate = (template: SizeTemplate | null) => {
    selectedTemplate.value = template
  }

  const setExportConfig = (config: Partial<ExportConfig>) => {
    exportConfig.value = { ...exportConfig.value, ...config }
  }

  const reset = () => {
    if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
    if (croppedUrl.value) URL.revokeObjectURL(croppedUrl.value)
    originalBlob.value = null
    originalUrl.value = null
    croppedBlob.value = null
    croppedUrl.value = null
    selectedTemplate.value = null
    exportConfig.value = { format: 'jpeg', quality: 0.95 }
  }

  return {
    originalBlob,
    originalUrl,
    croppedBlob,
    croppedUrl,
    selectedTemplate,
    exportConfig,
    hasOriginal,
    hasCropped,
    originalSize,
    croppedSize,
    setOriginal,
    setCropped,
    setTemplate,
    setExportConfig,
    reset,
  }
})
