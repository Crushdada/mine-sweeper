<script setup lang="ts">
interface BolckState {
  x: number
  y: number
  revealed?: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines?: number
}
const WIDTH = 10;
const HEIGHT = 10;
const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BolckState => ({ x, y }))),
)
function onClick(x: number, y: number) {
  console.log(x, y)
}
</script>

<template>
  <div mt-10>
    <h1 text-6>
      MineSweeper
    </h1>

    <div>
      <div v-for="(row, y) in state" :key="y">
        <button v-for="(item, x) in row" :key="x" w-10 h-10 border hover:bg-gray @click="onClick(x, y)">
          {{ item.x }},{{ item.y }}
        </button>
      </div>
    </div>
  </div>
</template>
