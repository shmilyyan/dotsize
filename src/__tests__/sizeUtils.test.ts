import { describe, it, expect } from 'vitest'
import { sizeUtils } from '../utils/sizeUtils'

describe('sizeUtils', () => {
  describe('mmToPixels', () => {
    it('should convert mm to pixels correctly', () => {
      // 25mm at 300 DPI should be ~295 pixels
      const result = sizeUtils.mmToPixels(25, 300)
      expect(result).toBe(295)
    })

    it('should handle zero', () => {
      expect(sizeUtils.mmToPixels(0, 300)).toBe(0)
    })
  })

  describe('pixelsToMm', () => {
    it('should convert pixels to mm correctly', () => {
      // 295 pixels at 300 DPI should be ~25mm
      const result = sizeUtils.pixelsToMm(295, 300)
      expect(result).toBeCloseTo(25, 1)
    })
  })

  describe('calculateCropRect', () => {
    it('should calculate correct crop for wider source', () => {
      const result = sizeUtils.calculateCropRect(1000, 1000, 295, 413)
      expect(result.sWidth).toBeLessThanOrEqual(1000)
      expect(result.sHeight).toBe(1000)
      expect(result.sx).toBeGreaterThanOrEqual(0)
      expect(result.sy).toBe(0)
    })

    it('should calculate correct crop for taller source', () => {
      const result = sizeUtils.calculateCropRect(1000, 2000, 295, 413)
      expect(result.sWidth).toBe(1000)
      expect(result.sHeight).toBeLessThanOrEqual(2000)
    })
  })

  describe('validateSizeInput', () => {
    it('should validate positive numbers', () => {
      expect(sizeUtils.validateSizeInput(100)).toBe(true)
    })

    it('should reject negative numbers', () => {
      expect(sizeUtils.validateSizeInput(-10)).toBe(false)
    })

    it('should reject numbers outside range', () => {
      expect(sizeUtils.validateSizeInput(0.5, 1, 100)).toBe(false)
      expect(sizeUtils.validateSizeInput(20000, 1, 10000)).toBe(false)
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(sizeUtils.formatFileSize(500)).toBe('500 B')
    })

    it('should format kilobytes', () => {
      expect(sizeUtils.formatFileSize(2048)).toBe('2.0 KB')
    })

    it('should format megabytes', () => {
      expect(sizeUtils.formatFileSize(2 * 1024 * 1024)).toBe('2.00 MB')
    })
  })
})
