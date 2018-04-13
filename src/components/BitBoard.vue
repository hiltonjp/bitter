<template>
  <div class="container">
    <div class="board"
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
    name: "BitBoard",
    components: { Pixel },
    props: {
      pixelsize: {
        type: Number,
        required: true
      },
      pixels: {
        type: Array,
        required: true
      }
    },
    created: function() {
      //this.$store.dispatch('createPixels');
    },
    methods: {

    },
    computed: {
      boarddim() {
        return "" + Math.sqrt(this.$store.getters.numPixels)*this.pixelsize + "px";
      },
      pixelwidth() {
        return this.pixelsize;
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
