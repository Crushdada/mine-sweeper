<script setup lang="ts">
import { isDev, toggleDev } from "~/composables";
import { GamePlay } from "~/composables/logic";
const play = new GamePlay(10, 10, 20);
useStorage("vue-sweeper-state", play.state);
const state = computed(() => play.board);
const minesCount = computed(() => {
  return play.blocks.reduce((count: number, b) => {
    return b.mine ? count + 1 : count;
  }, 0);
});

watchEffect(() => {
  play.checkGameState();
});

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
    <div flex="~" justify-center p5>
      <div v-for="(row, y) in state" :key="y">
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        ></MineBlock>
      </div>
    </div>
    <div>
      <div>Mines: {{ minesCount }}</div>
      <button btn @click="toggleDev()" mt-2>
        {{ isDev ? "DEV" : "NORMAL" }}
      </button>
    </div>
    <Confetti :passed="play.state.value.gameState === 'won'" />
  </div>
</template>
