import type { SizeTemplate } from '@/types'

/**
 * 预设尺寸模板
 */
export const sizeTemplates: SizeTemplate[] = [
  // 证件照
  {
    id: 'one_inch',
    name: '一寸照片',
    nameEn: '1 inch',
    category: '证件照',
    widthMm: 25,
    heightMm: 35,
    widthPx: 295,
    heightPx: 413,
    dpi: 300,
  },
  {
    id: 'two_inch',
    name: '二寸照片',
    nameEn: '2 inch',
    category: '证件照',
    widthMm: 35,
    heightMm: 49,
    widthPx: 413,
    heightPx: 579,
    dpi: 300,
  },
  {
    id: 'small_one_inch',
    name: '小一寸',
    nameEn: 'Small 1 inch',
    category: '证件照',
    widthMm: 22,
    heightMm: 32,
    widthPx: 260,
    heightPx: 378,
    dpi: 300,
  },
  {
    id: 'large_one_inch',
    name: '大一寸',
    nameEn: 'Large 1 inch',
    category: '证件照',
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
    dpi: 300,
  },
  {
    id: 'three_inch',
    name: '三寸照片',
    nameEn: '3 inch',
    category: '证件照',
    widthMm: 55,
    heightMm: 84,
    widthPx: 650,
    heightPx: 992,
    dpi: 300,
  },
  // 签证
  {
    id: 'japan_visa',
    name: '日本签证',
    nameEn: 'Japan Visa',
    category: '签证',
    widthMm: 45,
    heightMm: 45,
    widthPx: 531,
    heightPx: 531,
    dpi: 300,
  },
  {
    id: 'usa_visa',
    name: '美国签证',
    nameEn: 'USA Visa',
    category: '签证',
    widthMm: 50,
    heightMm: 50,
    widthPx: 590,
    heightPx: 590,
    dpi: 300,
  },
  {
    id: 'schengen_visa',
    name: '申根签证',
    nameEn: 'Schengen Visa',
    category: '签证',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
  },
  // 社交媒体
  {
    id: 'wechat_avatar',
    name: '微信头像',
    nameEn: 'WeChat Avatar',
    category: '社交媒体',
    widthMm: 0,
    heightMm: 0,
    widthPx: 200,
    heightPx: 200,
    dpi: 72,
  },
  {
    id: 'wechat_moments',
    name: '朋友圈',
    nameEn: 'WeChat Moments',
    category: '社交媒体',
    widthMm: 0,
    heightMm: 0,
    widthPx: 1080,
    heightPx: 1920,
    dpi: 72,
  },
  {
    id: 'instagram_avatar',
    name: 'Instagram 头像',
    nameEn: 'Instagram Avatar',
    category: '社交媒体',
    widthMm: 0,
    heightMm: 0,
    widthPx: 320,
    heightPx: 320,
    dpi: 72,
  },
]

/**
 * 按类别分组
 */
export const templatesByCategory = sizeTemplates.reduce((acc, template) => {
  if (!acc[template.category]) {
    acc[template.category] = []
  }
  acc[template.category].push(template)
  return acc
}, {} as Record<string, SizeTemplate[]>)

/**
 * 根据ID获取模板
 */
export function getTemplateById(id: string): SizeTemplate | undefined {
  return sizeTemplates.find((t) => t.id === id)
}
