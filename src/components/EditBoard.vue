<template>
  <div class="container">
    <div class="board" @mousedown="mouseDown" @mouseup="mouseUp" @mouseleave="stopDrawing()"
        v-bind:style="{
          height: this.boarddim,
          width: this.boarddim,
        }">

      <div v-for="(color, index) in pixels">
        <Pixel :index="index" :width=pixelwidth />
      </div>
    </div>
  </div>
</template>

<script>
  import Pixel from './Pixel';
  export default {
    name: "EditBoard",
    components: { Pixel },
    props: {
      colors: '',
      pixelsize: {
        type: Number,
        required: true
      },
      editable: true,
    },
    created: function() {
    },
    methods: {
      mouseDown() {
        this.$store.dispatch('mouseDown');
      },
      mouseUp() {
        this.$store.dispatch('mouseUp');
      },
      stopDrawing() {
        this.$store.dispatch('mouseUp');
      },
      fill() {
        console.log("filled");
        this.$store.dispatch('fill');
      },
      clear() {
        console.log("cleared");
        this.$store.dispatch('clear');
      },
      save() {
        // not implemented
      }
    },
    computed: {
      color() {
        return this.colors.hex;
      },
      boarddim() {
        return "" + Math.sqrt(this.$store.getters.numPixels)*this.pixelsize + "px";
      },
      pixelwidth() {
        return this.pixelsize;
      },
      pixels: function() {
        return this.$store.getters.pixels;
      },
    }
  }
</script>

<style scoped>
  .container {
    display: inline-block;
    text-align: center;
    border-radius: 16px;
    background-color: #00000000;
    box-shadow: 0px 4px 16px #00000088;
  }
  .board {
    display: inline-block;
    text-align: center;
    margin: -1px -1px -4px -1px;
    clip-path: inset(0px 0px 0px 0px round 3% 3% 3% 3%);
  }
</style>
