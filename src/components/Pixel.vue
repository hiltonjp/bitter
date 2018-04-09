<template>
  <div v-bind:style="{'background-color': this.pixelColor}" @mousedown="mouseDown" @mouseover="paint"/>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: "pixel",
    props: ['index'],
    //data() {
      //return { pixelColor: this.$store.getters.pixels[this.index] }
    //},
    methods: {
      mouseDown() {
        this.$store.dispatch('mouseDown');
        this.$store.dispatch('setPixel',{index:this.index, color:this.brush});
      },
      paint() {
        if (this.drawing) {
          this.$store.dispatch('setPixel',{index:this.index, color:this.brush});
        }
      },
    },
    computed: {
      ...mapGetters({
        drawing: 'drawing',
        brush: 'brush',
        getPixel: 'pixel',
      }),
      pixelColor: function() {
        return this.getPixel(this.index);
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
