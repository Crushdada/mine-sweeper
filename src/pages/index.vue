<script setup lang="ts">
import { BlockState } from "~/types";
import { isDev, toggleDev } from "~/composables";
const WIDTH = 10;
const HEIGHT = 10;
let mineGenerated = false; // 是否生成炸弹

/**
 * 为了工程化,采用ref而不是reactive
 * 我们可能需要移除或更新整个state,而reactive会阻止这样做--antf大佬如是说
 **/
const state = ref(
  Array.from({ length: HEIGHT }, (_, x) =>
    Array.from(
      { length: WIDTH },
      (_, y): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
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
function generateMines(initial: BlockState) {
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

// 小帮手：当你翻开一个空的块，游戏会帮你翻开它周遭的空块，并递归这个过程
function expandZero(block: BlockState) {
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
function getSiblings(block: BlockState) {
  return directions
    .map(([dx, dy]) => {
      const x = block.x + dx;
      const y = block.y + dy;
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
      return state.value[x][y];
    })
    .filter(Boolean) as BlockState[];
}
// block鼠标右键点击事件
function onRightClick(block: BlockState) {
  if (block.revealed) return;
  block.flagged = !block.flagged;
}
// block鼠标左键点击事件
function onClick(block: BlockState) {
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
    <br />
    作弊模式：<button @click="toggleDev()">{{ isDev ? "关闭" : "开启" }}</button>
    <div flex="~" justify-center p5>
      <div v-for="(row, y) in state" :key="y">
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="onClick(block)"
          @contextmenu.prevent="onRightClick(block)"
        ></MineBlock>
      </div>
    </div>
  </div>
</template>
