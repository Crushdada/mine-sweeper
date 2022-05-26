<script setup lang="ts">
import { isDev, toggleDev } from "~/composables";
import { GamePlay } from "~/composables/logic";
const play = new GamePlay(10, 10, 20);
// 计时器
const now = $(useNow());
const timerMS = $computed(() =>
  Math.round(
    ((play.state.value.endMS || +now) - play.state.value.startMS) / 1000
  )
);
// 持久化游戏状态
useStorage("vue-sweeper-state", play.state);
const state = computed(() => play.board);
// 计算剩余炸弹数量
const minesRest = $computed(() => {
  if (!play.state.value.mineGenerated) return play.mines;
  return play.blocks.reduce((count: number, b) => {
    return b.mine && !b.flagged ? count + 1 : count;
  }, 0);
});
// 检查游戏状态
watchEffect(() => {
  play.checkGameState();
});
// 新一轮游戏
function newGame(difficulty: "easy" | "medium" | "hard") {
  switch (difficulty) {
    case "easy":
      play.reset(9, 9, 10);
      break;
    case "medium":
      play.reset(16, 16, 40);
      break;
    case "hard":
      play.reset(20, 20, 99);
      break;
    default:
      break;
  }
}
</script>

<template>
  <div mt-10>
    <h1 text-6>MineSweeper</h1>
    <div flex="~ gap-2" justify-center pt-2>
      <button btn @click="play.reset()">New Game</button>
      <button btn @click="newGame('easy')">Easy</button>
      <button btn @click="newGame('medium')">Medium</button>
      <button btn @click="newGame('hard')">Hard</button>
    </div>
    <div flex="~ gap-10" justify-center pt-4>
      <div font-mono text-2xl flex="~ gap-1" items-center>
        <div i-carbon-timer />
        {{ timerMS }}
      </div>
      <div font-mono text-2xl flex="~ gap-1" items-center>
        <div i-mdi-mine />
        {{ minesRest }}
      </div>
    </div>
    <div flex="~" justify-center p5>
      <div v-for="(row, y) in state" :key="y">
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @dblclick="play.autoExpand(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        ></MineBlock>
      </div>
    </div>
    <div>
      <button btn @click="toggleDev()" mt-2>
        {{ isDev ? "DEV" : "NORMAL" }}
      </button>
    </div>
    <Confetti :passed="play.state.value.status === 'won'" />
  </div>
</template>
