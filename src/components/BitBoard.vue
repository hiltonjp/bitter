<template>
 <div id="board" @mousedown="mouseDown" @mouseup="mouseUp" @mouseleave="stopDrawing()">
   <div v-for="(color, index) in pixels">
     <Pixel :index="index"/>
   </div>
 </div>
</template>

<script>
  import Pixel from './Pixel';
  export default {
    name: "BitBoard",
    components: { Pixel },
    props: ['colors'],
    created: function() {
      console.log("creating pixels");
      this.$store.dispatch('createPixels');
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
      pixels: function() {
        return this.$store.getters.pixels;
      },
      color() {
        return this.colors.hex;
      }
    }
  }
</script>
