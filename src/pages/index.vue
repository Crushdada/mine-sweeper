<script setup lang="ts">

</script>

<template>
  <div>
    <h1 text-6>
      MineSweeper
    </h1>
    <div>
      <div v-for="y in 10" :key="y">
        <button v-for="x in 10" :key="x" w-10 h-10 border>
          {{ (y - 1) * 10 + x }}
        </button>
      </div>
    </div>
  </div>
</template>
