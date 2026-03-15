# DotSize Web 版产品需求文档

> 基于 Vue 3 的纯 Web 照片尺寸工具 - 移动端浏览器访问，静态托管部署

---

## 1. 产品定位

**产品名称**: DotSize Web

**核心价值**: 打开浏览器即可使用的照片尺寸处理工具，支持拍照、相册导入、智能裁剪、高质量导出、一键分享。

**技术选型**:
- 前端框架: **Vue 3 + TypeScript**
- 构建工具: **Vite**
- 样式方案: **Tailwind CSS**
- 部署方式: **静态托管** (Vercel/Netlify)

---

## 2. 核心功能

### 2.1 功能清单

| 功能 | 优先级 | 实现方式 |
|-----|-------|---------|
| 相册导入 | P0 | `<input type="file">` + 拖拽 |
| 摄像头拍照 | P0 | `getUserMedia()` API |
| 尺寸模板 | P0 | 预设 + 自定义 |
| 智能裁剪 | P0 | Canvas API |
| 高质量导出 | P0 | Canvas + 质量参数 |
| 分享功能 | P0 | Web Share API + 链接 |

### 2.2 预设尺寸模板

**证件照**:
- 一寸: 25×35mm (295×413px @300DPI)
- 二寸: 35×49mm (413×579px @300DPI)
- 小一寸: 22×32mm (260×378px @300DPI)
- 大一寸: 33×48mm (390×567px @300DPI)

**社交媒体**:
- 微信头像: 200×200px
- 朋友圈: 1080×1920px
- Instagram: 320×320px

### 2.3 导出质量保障

| 参数 | 设置 |
|-----|------|
| 默认格式 | JPEG |
| 默认质量 | 95% |
| 可调范围 | 50%-100% |
| PNG支持 | 透明背景保留 |
| DPI | 300 (证件照标准) |

---

## 3. 技术架构

### 3.1 技术栈

```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.0",
  "pinia": "^2.1.0",
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0"
}
```

### 3.2 项目结构

```
dotsize-web/
├── public/
│   ├── favicon.ico
│   └── icons/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── assets/
│   ├── components/
│   │   ├── CameraCapture.vue      # 摄像头拍照
│   │   ├── FileUpload.vue         # 文件上传
│   │   ├── SizeSelector.vue       # 尺寸选择
│   │   ├── ImageCropper.vue       # 图片裁剪
│   │   ├── ExportPanel.vue        # 导出面板
│   │   └── ShareButton.vue        # 分享按钮
│   ├── composables/
│   │   ├── useCamera.ts           # 摄像头逻辑
│   │   ├── useImageProcessor.ts   # 图片处理
│   │   ├── useExport.ts           # 导出逻辑
│   │   └── useShare.ts            # 分享逻辑
│   ├── stores/
│   │   ├── image.ts               # 图片状态
│   │   └── settings.ts            # 设置状态
│   ├── constants/
│   │   └── sizeTemplates.ts       # 尺寸模板
│   ├── types/
│   │   └── index.ts               # 类型定义
│   ├── utils/
│   │   ├── canvas.ts              # Canvas工具
│   │   ├── file.ts                # 文件工具
│   │   └── download.ts            # 下载工具
│   └── views/
│       ├── HomeView.vue           # 首页
│       ├── EditorView.vue         # 编辑页
│       └── ResultView.vue         # 结果页
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### 3.3 核心模块设计

#### useImageProcessor - 图片处理

```typescript
// src/composables/useImageProcessor.ts
export function useImageProcessor() {
  /**
   * 裁剪图片到指定尺寸
   * 保证输出质量
   */
  const cropToTemplate = (
    image: HTMLImageElement,
    template: SizeTemplate,
    quality: number = 0.95
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    // 设置高质量输出
    canvas.width = template.widthPx
    canvas.height = template.heightPx

    // 高质量渲染设置
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // 计算裁剪区域（居中裁剪）
    const { sx, sy, sWidth, sHeight } = calculateCropRect(
      image.width,
      image.height,
      template.widthPx,
      template.heightPx
    )

    // 绘制
    ctx.drawImage(
      image,
      sx, sy, sWidth, sHeight,
      0, 0, template.widthPx, template.heightPx
    )

    // 导出高质量Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(),
        'image/jpeg',
        quality
      )
    })
  }

  return { cropToTemplate }
}
```

#### useShare - 分享功能

```typescript
// src/composables/useShare.ts
export function useShare() {
  /**
   * 使用Web Share API分享（移动端）
   */
  const shareImage = async (blob: Blob, filename: string) => {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: blob.type })
      await navigator.share({
        files: [file],
        title: 'DotSize导出图片',
      })
    } else {
      // 降级：复制链接或下载
      throw new Error('当前浏览器不支持分享')
    }
  }

  /**
   * 生成分享链接
   */
  const generateShareLink = async (blob: Blob): Promise<string> => {
    // 可选：上传到临时存储并返回链接
    // 或返回base64 data URL
    return URL.createObjectURL(blob)
  }

  return { shareImage, generateShareLink }
}
```

---

## 4. 用户流程

```
首页                    编辑页                    结果页
┌─────────┐            ┌─────────┐            ┌─────────┐
│ ┌─────┐ │            │ ┌─────┐ │            │ ┌─────┐ │
│ │拍照 │ │            │ │预览 │ │            │ │结果 │ │
│ └──┬──┘ │            │ └──┬──┘ │            │ └──┬──┘ │
│ ┌─────┐ │            │ ┌─────┐ │            │ ┌─────┐ │
│ │上传 │ │───选择────▶│ │裁剪 │ │───导出────▶│ │下载 │ │
│ └──┬──┘ │            │ └──┬──┘ │            │ └──┬──┘ │
│         │            │ ┌─────┐ │            │ ┌─────┐ │
│         │            │ │尺寸 │ │            │ │分享 │ │
│         │            │ └─────┘ │            │ └─────┘ │
└─────────┘            └─────────┘            └─────────┘
```

---

## 5. 部署方案

### 5.1 静态托管配置

**Vercel** (推荐):
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vue"
}
```

**Netlify**:
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
```

### 5.2 HTTPS 要求

摄像头 API 需要 HTTPS 环境：
- Vercel/Netlify 自动提供 HTTPS
- 本地开发使用 `localhost` 可豁免

---

## 6. 质量保障

### 6.1 导出质量检查

| 检查项 | 标准 | 方法 |
|-------|------|------|
| 尺寸准确性 | 误差 < 1px | 像素对比 |
| 格式正确性 | JPEG/PNG | 文件头检查 |
| 质量一致性 | 设定值 | 文件大小对比 |
| DPI准确性 | 300 DPI | 元数据检查 |

### 6.2 浏览器兼容性

| 浏览器 | 版本 | 支持 |
|-------|------|------|
| Chrome | 90+ | ✓ |
| Safari | 14+ | ✓ |
| Firefox | 88+ | ✓ |
| 微信内置 | 最新 | △ |
| Safari iOS | 14+ | ✓ |

---

## 7. 开发计划

| 阶段 | 内容 | 时间 |
|-----|------|------|
| Phase 1 | 项目初始化 + 文件上传 + 尺寸选择 | Day 1 |
| Phase 2 | Canvas裁剪 + 高质量导出 | Day 2 |
| Phase 3 | 摄像头拍照 + 分享功能 | Day 3 |
| Phase 4 | 响应式优化 + 部署上线 | Day 4 |

---

> 文档版本: Vue版 v1.0
> 更新日期: 2026-03-15
