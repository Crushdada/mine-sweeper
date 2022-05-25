<script setup lang="ts">
import { BlockState } from "~/types";
import { isDev, toggleDev } from "~/composables";
import { GamePlay } from "~/composables/logic";
const play = new GamePlay(10, 10);
const state = play.state;
</script>

<template>
  <div mt-10>
    <h1 text-6>MineSweeper</h1>
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
    <div flex="~ gap-1" justify-center>
      <button  btn @click="toggleDev()">
        {{ isDev ? "DEV" : "NORMAL" }}
      </button>
      <button btn @click="play.reset()">
        RESET
      </button>
    </div>
  </div>
</template>
