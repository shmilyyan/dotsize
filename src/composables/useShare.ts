import { ref } from 'vue'

export function useShare() {
  const isSharing = ref(false)
  const error = ref<string | null>(null)

  /**
   * 检查是否支持Web Share API
   */
  const canShare = (): boolean => {
    return typeof navigator.share === 'function'
  }

  /**
   * 分享图片（使用Web Share API）
   */
  const shareImage = async (blob: Blob, filename: string): Promise<boolean> => {
    if (!canShare()) {
      error.value = '当前浏览器不支持分享功能'
      return false
    }

    isSharing.value = true
    error.value = null

    try {
      const file = new File([blob], filename, { type: blob.type })

      const shareData: ShareData = {
        files: [file],
        title: 'DotSize导出图片',
        text: '使用DotSize制作的标准尺寸照片',
      }

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        return true
      } else {
        error.value = '当前浏览器不支持分享文件'
        return false
      }
    } catch (err) {
      // 用户取消分享不算错误
      if (err instanceof Error && err.name === 'AbortError') {
        return true
      }
      error.value = err instanceof Error ? err.message : '分享失败'
      return false
    } finally {
      isSharing.value = false
    }
  }

  /**
   * 复制图片到剪贴板
   */
  const copyToClipboard = async (blob: Blob): Promise<boolean> => {
    try {
      if (!navigator.clipboard) {
        error.value = '浏览器不支持剪贴板功能'
        return false
      }

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ])
      return true
    } catch (err) {
      error.value = '复制到剪贴板失败'
      return false
    }
  }

  /**
   * 下载图片
   */
  const downloadImage = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    isSharing,
    error,
    canShare,
    shareImage,
    copyToClipboard,
    downloadImage,
  }
}
