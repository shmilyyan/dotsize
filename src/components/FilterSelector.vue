<script setup lang="ts">
import { presetFilters, type BeautyFilter } from '@/composables/useBeautyFilter'

const props = defineProps<{
  selected: BeautyFilter
}>()

const emit = defineEmits<{
  (e: 'select', filter: BeautyFilter): void
}>()
</script>

<template>
  <div class="bg-white rounded-xl p-4">
    <h3 class="font-medium text-gray-800 mb-3">滤镜</h3>
    <div class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="filter in presetFilters"
        :key="filter.id"
        class="flex-shrink-0 w-16"
        @click="emit('select', filter)"
      >
        <div
          class="w-14 h-14 rounded-lg mb-1 transition-all overflow-hidden"
          :class="selected.id === filter.id ? 'ring-2 ring-primary ring-offset-2' : ''"
          :style="{ filter: filter.cssFilter === 'none' ? 'none' : filter.cssFilter }"
        >
          <div class="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300"></div>
        </div>
        <span class="text-xs text-gray-600">{{ filter.name }}</span>
      </button>
    </div>
  </div>
</template>
