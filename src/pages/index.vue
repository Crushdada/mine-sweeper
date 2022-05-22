<script setup lang="ts">
interface BolckState {
  x: number;
  y: number;
  revealed?: boolean; // 是否已翻开
  mine?: boolean; // 是否有炸弹
  flagged?: boolean; // 是否已标记
  adjacentMines: number; // 周围炸弹数
}
const WIDTH = 10;
const HEIGHT = 10;
const state = reactive(
  Array.from({ length: HEIGHT }, (_, x) =>
    Array.from(
      { length: WIDTH },
      (_, y): BolckState => ({ x, y, adjacentMines: 0, revealed: false })
    )
  )
);
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
];
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
// 随机生成炸弹
function generateMines() {
  for (const row of state) {
    for (const block of row) {
      block.mine = Math.random() < 0.3;
    }
  }
}
// 计算每个block周围的炸弹数
function updateMineNums() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine) return;
      directions.forEach(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) return;
        if (state[x2][y2].mine) block.adjacentMines += 1;
      });
    });
  });
}
// block样式类
function getBlockClass(block: BolckState) {
  if (!block.revealed) return "bg-gray-500/10";
  return block.mine ? "bg-red-500/50" : numColors[block.adjacentMines];
}
// block点击事件
function onClick(block: BolckState) {
  block.revealed = true;
  if (block.mine) {
    alert("Boooom!")
  }
}

generateMines();
updateMineNums();
</script>

<template>
  <div mt-10>
    <h1 text-6>MineSweeper</h1>

    <div flex="~" justify-center p5>
      <div v-for="(row, y) in state" :key="y">
        <button
          v-for="(block, x) in row"
          :key="x"
          flex="~"
          justify-center
          items-center
          w-10
          h-10
          m="0.3"
          border="1 gray-300"
          hover="bg-gray/40"
          :class="getBlockClass(block)"
          @click="onClick(block)"
        >
          <template v-if="block.revealed">
            <div v-if="block.mine" i-mdi-mine></div>
            <div v-else>{{ block.adjacentMines }}</div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
