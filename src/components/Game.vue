<script setup lang="ts">
import {ref} from "vue"
import {Game} from "@/game/game";

const score = ref<number>(0)
const game:Game = new Game()

const vLoadGame = {
  mounted: (el:HTMLCanvasElement) => {
    game.init(el)
  }
}
</script>

<template>
  <div id="top-bar">
    <div id="score">SCORE: <b>{{score}}</b></div>
    <router-link to="/start" custom v-slot="{ navigate, href, route }">
      <button id="exit" @click="navigate(href)">X</button>
    </router-link>
  </div>
  <div id="game-frame"><canvas v-load-game id="game-canvas" /></div>
</template>

<style scoped lang="scss">

#top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 1280px;
  background-color: #00000066;
  padding: 10px 10px;

  #score {
    font-size: 24px;
    font-weight: 500;
  }

  #exit {
    width: 40px;
    height: 40px;
    background-color: #aa0000;
    padding: 3px;
    font-size: 24px;
  }
}

#game-frame, #game-canvas {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(lightskyblue 10%, teal);
}
</style>