import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface HistoryItem {
  id: string
  originalName: string
  templateName: string
  templateWidth: number
  templateHeight: number
  fileSize: number
  exportedAt: Date
  thumbnail?: string
}

const STORAGE_KEY = 'dotsize_history'
const MAX_HISTORY = 20

export const useHistoryStore = defineStore('history', () => {
  const items = ref<HistoryItem[]>([])

  // 从localStorage加载
  const load = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        items.value = parsed.map((item: any) => ({
          ...item,
          exportedAt: new Date(item.exportedAt),
        }))
      }
    } catch {
      items.value = []
    }
  }

  // 保存到localStorage
  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch {
      // 存储失败，忽略
    }
  }

  // 添加历史记录
  const add = (item: Omit<HistoryItem, 'id' | 'exportedAt'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `history_${Date.now()}`,
      exportedAt: new Date(),
    }
    items.value.unshift(newItem)

    // 限制数量
    if (items.value.length > MAX_HISTORY) {
      items.value = items.value.slice(0, MAX_HISTORY)
    }

    save()
  }

  // 删除记录
  const remove = (id: string) => {
    items.value = items.value.filter((item) => item.id !== id)
    save()
  }

  // 清空记录
  const clear = () => {
    items.value = []
    save()
  }

  // 初始化
  load()

  return {
    items,
    add,
    remove,
    clear,
    load,
  }
})
