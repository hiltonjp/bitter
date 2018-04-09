<template>
  <div id="create">
    <div class="container">
      <div class="bitboard">
        <bit-board :colors="colors" ref="board"/>
      </div>
    </div>
    <br>
    <div class="toolbox">
      <div class="picker">
        <sketch v-model="colors"/>
      </div>
      <div class="buttons">
        <button class="toolbutton" @click="fill()">Fill</button>
        <button class="toolbutton" @click="clear()">Clear</button>
        <button class="toolbutton" @click="save()">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
  import BitBoard from './BitBoard';
  import { Sketch } from 'vue-color';

  export default {
    components: { BitBoard, 'sketch': Sketch },
    data() {
      return { colors: [] }
    },
    methods: {
      fill() {
        this.$store.dispatch('fill');
      },
      clear() {
        this.$store.dispatch('clear');
      },
      save() {
        this.$store.dispatch('save');
      }
    },
    watch: {
      colors: function(color) {
        this.$store.dispatch('changeBrush', color.hex);
      }
    }
  }
</script>

<style scoped>
  #create {
    margin: 24px;
  }
  .container {
    display: inline-block;
    text-align: center;
    background-color: #000033;
    border-radius: 3.5%;
    padding: 4px 4px 0px 4px;
    box-shadow: 0px 4px 16px #00000088;
  }
  .bitboard {
    display: inline-block;
    text-align: center;
    width: 480px;
    height: 480px;
    clip-path: inset(0px 0px 0px 0px round 3% 3% 3% 3%);
  }
  .toolbox {
    display: flex;
    padding-top: 20px;
    justify-content: center;
  }
  .picker {
    display: inline-block;
    text-align: center;
  }
  .buttons {
    padding: 20px;
    display: flex;
    margin-left: 10px;
    flex-direction: column;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 6px 10px #00000028;
  }
  .toolbutton {
    margin: 4px 0px;
    width: 100px;
  }
</style>
