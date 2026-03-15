import { ref, onUnmounted } from 'vue'

export function useCamera() {
  const stream = ref<MediaStream | null>(null)
  const isReady = ref(false)
  const error = ref<string | null>(null)

  /**
   * 请求摄像头权限并开始预览
   */
  const startCamera = async (
    videoElement: HTMLVideoElement,
    facingMode: 'user' | 'environment' = 'environment'
  ): Promise<boolean> => {
    try {
      // 先停止之前的流
      stopCamera()

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      }

      stream.value = await navigator.mediaDevices.getUserMedia(constraints)
      videoElement.srcObject = stream.value

      return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play()
          isReady.value = true
          error.value = null
          resolve(true)
        }
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : '无法访问摄像头'
      isReady.value = false
      return false
    }
  }

  /**
   * 拍照
   * @param videoElement 视频元素
   * @param cssFilter 可选的CSS滤镜字符串
   */
  const takePhoto = async (
    videoElement: HTMLVideoElement,
    cssFilter: string = 'none'
  ): Promise<Blob | null> => {
    if (!videoElement.videoWidth) return null

    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // 如果是前置摄像头，水平翻转
    if (stream.value) {
      const videoTrack = stream.value.getVideoTracks()[0]
      const settings = videoTrack.getSettings()
      if (settings.facingMode === 'user') {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
    }

    // 应用滤镜
    if (cssFilter && cssFilter !== 'none') {
      ctx.filter = cssFilter
    }

    ctx.drawImage(videoElement, 0, 0)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95)
    })
  }

  /**
   * 切换摄像头
   */
  const switchCamera = async (
    videoElement: HTMLVideoElement,
    currentFacingMode: 'user' | 'environment'
  ): Promise<void> => {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user'
    await startCamera(videoElement, newFacingMode)
  }

  /**
   * 停止摄像头
   */
  const stopCamera = (): void => {
    if (stream.value) {
      stream.value.getTracks().forEach((track) => track.stop())
      stream.value = null
      isReady.value = false
    }
  }

  // 组件卸载时自动停止
  onUnmounted(() => {
    stopCamera()
  })

  return {
    stream,
    isReady,
    error,
    startCamera,
    takePhoto,
    switchCamera,
    stopCamera,
  }
}
