/**
 * 尺寸转换工具
 */
export const sizeUtils = {
  /**
   * 毫米转像素
   */
  mmToPixels(mm: number, dpi: number): number {
    const mmPerInch = 25.4
    return Math.round((mm / mmPerInch) * dpi)
  },

  /**
   * 像素转毫米
   */
  pixelsToMm(pixels: number, dpi: number): number {
    const mmPerInch = 25.4
    return (pixels / dpi) * mmPerInch
  },

  /**
   * 计算裁剪区域（居中裁剪）
   */
  calculateCropRect(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number
  ): { sx: number; sy: number; sWidth: number; sHeight: number } {
    const sourceRatio = sourceWidth / sourceHeight
    const targetRatio = targetWidth / targetHeight

    let sx, sy, sWidth, sHeight

    if (sourceRatio > targetRatio) {
      // 原图更宽，按高度裁剪
      sHeight = sourceHeight
      sWidth = Math.round(sHeight * targetRatio)
      sx = Math.round((sourceWidth - sWidth) / 2)
      sy = 0
    } else {
      // 原图更高，按宽度裁剪
      sWidth = sourceWidth
      sHeight = Math.round(sWidth / targetRatio)
      sx = 0
      sy = Math.round((sourceHeight - sHeight) / 2)
    }

    return { sx, sy, sWidth, sHeight }
  },

  /**
   * 验证尺寸输入
   */
  validateSizeInput(value: number, min: number = 1, max: number = 10000): boolean {
    return Number.isFinite(value) && value >= min && value <= max
  },

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  },
}
