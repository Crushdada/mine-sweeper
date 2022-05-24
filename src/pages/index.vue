<script setup lang="ts">
import { BolckState } from "~/types";
const WIDTH = 10;
const HEIGHT = 10;
/**
 * 为了工程化,采用ref而不是reactive
 * 我们可能需要移除或更新整个state,而reactive会阻止这样做--antf大佬如是说
 **/
const state = ref(
  Array.from({ length: HEIGHT }, (_, x) =>
    Array.from(
      { length: WIDTH },
      (_, y): BolckState => ({ x, y, adjacentMines: 0, revealed: false })
    )
  )
);
let mineGenerated = false; // 是否生成炸弹
let dev = true;
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
// 追踪插旗、翻开块的变动，应用检查游戏状态的副作用
watch(state.value, checkGameState);

// 检查游戏状态
function checkGameState() {
  if (!mineGenerated) return;
  const blocks = state.value.flat();
  const win = blocks.every(
    (block) =>
      (!block.revealed && block.flagged) || block.revealed || block.mine
  );
  if (win) {
    alert("You Win!");
  }
}
// 随机生成炸弹
function generateMines(initial: BolckState) {
  for (const row of state.value) {
    for (const block of row) {
      // 保证首次点击的block的周遭为空
      if (Math.abs(initial.x - block.x) <= 1) continue;
      if (Math.abs(initial.y - block.y) <= 1) continue;
      block.mine = Math.random() < 0.3;
    }
  }
  updateMineNums();
}
// 计算每个block周围的炸弹数
function updateMineNums() {
  state.value.forEach((row) => {
    row.forEach((block) => {
      if (block.mine) return;
      getSiblings(block).forEach((b) => {
        if (b.mine) block.adjacentMines += 1;
      });
    });
  });
}
// block样式类
function getBlockClass(block: BolckState) {
  if (block.flagged) return "bg-gray-500/10";
  if (!block.revealed) return "bg-gray-400/20 hover:bg-gray-500/20";
  return block.mine ? "bg-red-500/50" : numColors[block.adjacentMines];
}
// 小帮手：当你翻开一个空的块，游戏会帮你翻开它周遭的空块，并递归这个过程
function expandZero(block: BolckState) {
  if (block.adjacentMines) return;
  // 如果当前块周遭无炸弹
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true;
      expandZero(s);
    }
  });
}
// 获得block周遭的块
function getSiblings(block: BolckState) {
  return directions
    .map(([dx, dy]) => {
      const x = block.x + dx;
      const y = block.y + dy;
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
      return state.value[x][y];
    })
    .filter(Boolean) as BolckState[];
}
// block鼠标右键点击事件
function onRightClick(block: BolckState) {
  if (block.revealed) return;
  block.flagged = !block.flagged;
}
// block鼠标左键点击事件
function onClick(e: MouseEvent, block: BolckState) {
  if (!mineGenerated) {
    generateMines(block);
    mineGenerated = true;
  }
  block.revealed = true;
  if (block.mine) {
    alert("Boooom!");
    return;
  }
  expandZero(block);
}
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
          :class="getBlockClass(block)"
          @click="onClick($event, block)"
          @contextmenu.prevent="onRightClick(block)"
        >
          <template v-if="block.flagged">
            <div i-mdi-flag text-red></div>
          </template>
          <template v-else-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi-mine></div>
            <div v-else>{{ block.adjacentMines }}</div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
