<script setup lang="ts">
import {computed, ref, watch} from "vue"
import {Game} from "@/game/game"

const gameOver = ref<boolean>(false)
const score = ref<number>(0)
const scoreFormatter = new Intl.NumberFormat()
const scoreDisplayed = computed<string>(() => {
  return scoreFormatter.format(score.value)
})

const game:Game = new Game()
game.on(Game.SCORED, () => {
  score.value = game.score
})
game.on(Game.GAMEOVER, () => {
  gameOver.value = true
})

const vLoadGame = {
  mounted: (el:HTMLCanvasElement) => {
    game.init(el)
  },
  unmounted: () => {
    game.cleanup()
  }
}

function playAgain() {
  score.value = 0
  gameOver.value = false
  game.reset()
}

</script>

<template>
  <div id="top-bar">
    <div id="score">SCORE: <b>{{ scoreDisplayed }}</b></div>
    <router-link to="/start" custom v-slot="{ navigate, href, route }">
      <button id="exit" @click="navigate">X</button>
    </router-link>
  </div>
  <div id="game-over" v-show="gameOver">
    <h1>GAME OVER</h1>
    <div id="score-final">FINAL SCORE: <b>{{ scoreDisplayed }}</b></div>
    <div id="game-reset"><button @click="playAgain">PLAY AGAIN</button></div>
  </div>
  <div id="game-frame"><canvas v-load-game id="game-canvas" /></div>
</template>

<style scoped lang="scss">

#top-bar {
  display: flex;
  z-index: 2;
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

#game-over {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 300px;
  left: 340px;
  z-index: 3;

  width: 600px;
  background-color: #00000099;
  border-radius: 24px;

  align-items: center;
  justify-content: center;

  #score-final {
    font-size: 24px;
    font-weight: 500;
  }

  #game-reset {
    padding: 20px;
  }
}

#game-frame, #game-canvas {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(lightskyblue 10%, teal);
}
</style>