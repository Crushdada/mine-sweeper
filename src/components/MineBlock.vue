<script setup lang="ts">
import type { BlockState } from "~/types";
import { isDev } from "~/composables";
defineProps<{ block: BlockState }>();
// 根据四周炸弹数目的不同，展示不同的颜色
const numColors = [
  "text-transparent",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
  "text-purple-500",
  "text-teal-500",
];
// block样式类
function getBlockClass(block: BlockState) {
  if (block.flagged) return "bg-gray-500/10";
  if (!block.revealed) return "bg-gray-400/20 hover:bg-gray-500/20";
  return block.mine ? "bg-red-500/50" : numColors[block.adjacentMines];
}
</script>

<template>
  <button
    flex="~"
    justify-center
    items-center
    w-10
    h-10
    m="0.3"
    border="1 gray-300"
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red></div>
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine></div>
      <div v-else>{{ block.adjacentMines }}</div>
    </template>
  </button>
</template>
