import { ref } from 'vue'

export interface BeautyFilter {
  id: string
  name: string
  cssFilter: string
}

// 预设滤镜
export const presetFilters: BeautyFilter[] = [
  { id: 'none', name: '原图', cssFilter: 'none' },
  { id: 'bright', name: '明亮', cssFilter: 'brightness(1.1) contrast(1.05)' },
  { id: 'warm', name: '暖色', cssFilter: 'sepia(0.15) saturate(1.2) brightness(1.05)' },
  { id: 'cool', name: '冷色', cssFilter: 'saturate(0.9) brightness(1.05) hue-rotate(10deg)' },
  { id: 'vivid', name: '鲜艳', cssFilter: 'saturate(1.3) contrast(1.1)' },
  { id: 'soft', name: '柔和', cssFilter: 'brightness(1.05) contrast(0.95) saturate(0.9) blur(0.3px)' },
  { id: 'BW', name: '黑白', cssFilter: 'grayscale(1)' },
  { id: 'retro', name: '复古', cssFilter: 'sepia(0.4) contrast(1.2) brightness(0.95)' },
]

export function useBeautyFilter() {
  const currentFilter = ref<BeautyFilter>(presetFilters[0])

  // 应用滤镜到视频元素
  const applyFilterToVideo = (videoElement: HTMLVideoElement) => {
    videoElement.style.filter = currentFilter.value.cssFilter
  }

  // 应用滤镜到 Canvas（拍照时）
  const applyFilterToCanvas = (
    ctx: CanvasRenderingContext2D,
    _canvas: HTMLCanvasElement
  ) => {
    if (currentFilter.value.id === 'none') return

    // 使用 CSS filter 无法直接应用到 Canvas，
    // 需要通过 drawImage 时的图像处理实现
    // 这里简化处理：对于 brightness/saturate 使用 ctx.filter
    const filterMap: Record<string, string> = {
      bright: 'brightness(1.1) contrast(1.05)',
      warm: 'sepia(0.15) saturate(1.2) brightness(1.05)',
      cool: 'saturate(0.9) brightness(1.05)',
      vivid: 'saturate(1.3) contrast(1.1)',
      soft: 'brightness(1.05) contrast(0.95) saturate(0.9)',
      BW: 'grayscale(1)',
      retro: 'sepia(0.4) contrast(1.2) brightness(0.95)',
    }

    const filter = filterMap[currentFilter.value.id]
    if (filter) {
      ctx.filter = filter
    }
  }

  // 切换滤镜
  const setFilter = (filter: BeautyFilter) => {
    currentFilter.value = filter
  }

  return {
    currentFilter,
    presetFilters,
    applyFilterToVideo,
    applyFilterToCanvas,
    setFilter,
  }
}
