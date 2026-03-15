/**
 * 尺寸模板
 */
export interface SizeTemplate {
  id: string
  name: string
  nameEn?: string
  category: string
  widthMm: number
  heightMm: number
  widthPx: number
  heightPx: number
  dpi: number
  isCustom?: boolean
}

/**
 * 图片处理状态
 */
export interface ImageState {
  originalImage: HTMLImageElement | null
  originalBlob: Blob | null
  croppedBlob: Blob | null
  selectedTemplate: SizeTemplate | null
}

/**
 * 导出配置
 */
export interface ExportConfig {
  format: 'jpeg' | 'png'
  quality: number // 0.5 - 1.0
  filename?: string
}

/**
 * 裁剪区域
 */
export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}
