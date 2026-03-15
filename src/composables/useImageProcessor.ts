import { ref } from 'vue'
import type { SizeTemplate } from '@/types'

export function useImageProcessor() {
  const isProcessing = ref(false)
  const progress = ref(0)

  /**
   * 加载图片文件
   */
  const loadImage = (blob: Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(blob)
    })
  }

  /**
   * 计算裁剪区域（居中裁剪，保持比例）
   */
  const calculateCropRect = (
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number
  ) => {
    const sourceRatio = sourceWidth / sourceHeight
    const targetRatio = targetWidth / targetHeight

    let sx, sy, sWidth, sHeight

    if (sourceRatio > targetRatio) {
      // 原图更宽，按高度裁剪
      sHeight = sourceHeight
      sWidth = sHeight * targetRatio
      sx = (sourceWidth - sWidth) / 2
      sy = 0
    } else {
      // 原图更高，按宽度裁剪
      sWidth = sourceWidth
      sHeight = sWidth / targetRatio
      sx = 0
      sy = (sourceHeight - sHeight) / 2
    }

    return { sx, sy, sWidth, sHeight }
  }

  /**
   * 裁剪图片到指定尺寸模板
   * 保证高质量输出
   */
  const cropToTemplate = async (
    image: HTMLImageElement,
    template: SizeTemplate,
    quality: number = 0.95
  ): Promise<Blob> => {
    isProcessing.value = true
    progress.value = 0

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('无法创建Canvas上下文')
      }

      // 设置目标尺寸
      canvas.width = template.widthPx
      canvas.height = template.heightPx

      progress.value = 20

      // 高质量渲染设置
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 计算裁剪区域
      const { sx, sy, sWidth, sHeight } = calculateCropRect(
        image.width,
        image.height,
        template.widthPx,
        template.heightPx
      )

      progress.value = 40

      // 使用白色背景（证件照标准）
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      progress.value = 60

      // 绘制裁剪后的图片
      ctx.drawImage(
        image,
        sx, sy, sWidth, sHeight,
        0, 0, template.widthPx, template.heightPx
      )

      progress.value = 80

      // 导出高质量Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('导出失败'))),
          'image/jpeg',
          quality
        )
      })

      progress.value = 100
      return blob
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * 导出PNG（支持透明背景）
   */
  const exportPng = async (image: HTMLImageElement, template: SizeTemplate): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('无法创建Canvas上下文')
    }

    canvas.width = template.widthPx
    canvas.height = template.heightPx

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const { sx, sy, sWidth, sHeight } = calculateCropRect(
      image.width,
      image.height,
      template.widthPx,
      template.heightPx
    )

    // PNG使用透明背景
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(
      image,
      sx, sy, sWidth, sHeight,
      0, 0, template.widthPx, template.heightPx
    )

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('导出失败'))),
        'image/png'
      )
    })
  }

  return {
    isProcessing,
    progress,
    loadImage,
    cropToTemplate,
    exportPng,
  }
}
