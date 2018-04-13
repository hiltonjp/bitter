<template>
  <div v-bind:style="{
    'background-color': this.pixelColor,
    width: this.pixelWidth,
    height: this.pixelWidth,
  }" @mousedown="mouseDown" @mouseover="paint"/>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: "pixel",
    props: {
      index: {
        type: Number,
        required: true
      },
      width: {
        type: Number,
        required: true
      }
    },
    //data() {
      //return { pixelColor: this.$store.getters.pixels[this.index] }
    //},
    methods: {
      mouseDown() {
        this.$store.dispatch('draw',{index:this.index, color:this.brush});
      },
      paint() {
        if (this.drawing) {
          this.$store.dispatch('draw',{index:this.index, color:this.brush});
        }
      },
    },
    computed: {
      ...mapGetters({
        drawing: 'drawing',
        brush: 'brush',
        getPixel: 'pixel',
      }),
      pixelColor() {
        return this.getPixel(this.index);
      },
      pixelWidth() {
        return "" + this.width +"px";
      }
    }
  }
</script>

<style scoped>
  div {
    height: 20px;
    width: 20px;
    float: left;
  }
</style>
