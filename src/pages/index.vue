<script setup lang="ts">
interface BolckState {
  x: number
  y: number
  revealed?: boolean // 是否已翻开
  mine?: boolean // 是否有炸弹
  flagged?: boolean // 是否已标记
  adjacentMines: number // 周围炸弹数
}
const WIDTH = 10;
const HEIGHT = 10;
const state = reactive(
  Array.from({ length: HEIGHT }, (_, x) =>
    Array.from({ length: WIDTH }, (_, y): BolckState => ({ x, y, adjacentMines: 0 }))),
)
// block周围的方向
const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]
// 随机生成炸弹
function generateMines() {
  for (const row of state) {
    for (const block of row) {
      block.mine = Math.random() < 0.3
    }
  }
}
// 计算每个block周围的炸弹数
function updateMineNums() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine) return
      directions.forEach(([dx, dy]) => {
        const x2 = block.x + dx
        const y2 = block.y + dy
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) return
        if (state[x2][y2].mine)
          block.adjacentMines += 1
      })
    });
  });
}
// block点击事件
function onClick(x: number, y: number) {
  console.log(x, y)
}

generateMines()
updateMineNums()
</script>

<template>
  <div mt-10>
    <h1 text-6>
      MineSweeper
    </h1>

    <div>
      <div v-for="(row, y) in state" :key="y">
        <button v-for="(item, x) in row" :key="x" w-10 h-10 border hover:bg-gray @click="onClick(x, y)">
          {{ item.mine ? 'x' : item.adjacentMines }}
        </button>
      </div>
    </div>
  </div>
</template>
