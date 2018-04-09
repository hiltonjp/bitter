import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pixels: [],
    drawing: false,
    brush: "#000000",
    filled: false,
    cleared: false,
    numPixels: 576,
  },
  getters: {
    pixels: state => state.pixels,
    pixel: (state) => (index) => { return state.pixels[index]; },
    drawing: state => state.drawing,
    brush: state => state.brush,
    filled: state => state.filled,
    cleared: state => state.cleared,
  },
  mutations: {
    CREATE_PIXELS(state) {
      for(let i = 0; i < state.numPixels; i++) {
        state.pixels.push('#FFFFFF');
      }
    },
    ADD_PIXEL(state, pixel) { pixels.push(pixel.color); },
    SET_PIXELS(state, pixels) { state.pixels = pixels },
    SET_PIXEL(state, pixel) { Vue.set(state.pixels, pixel.index, pixel.color); },
    MOUSE_DOWN(state) { state.drawing = true; },
    MOUSE_UP(state) { state.drawing = false; },
    CHANGE_BRUSH(state, color) { state.brush = color; },
    FILL(state) {
      for (let i = 0; i < state.numPixels; i++)
        Vue.set(state.pixels, i, state.brush);
    },
    CLEAR(state) {
      for (let i = 0; i < state.numPixels; i++)
        Vue.set(state.pixels, i, "#FFFFFF");
    },
  },
  actions: {
    addPixel(context, pixel) { context.commit('ADD_PIXEL', pixel); },
    setPixels(context, pixels) { context.commit('SET_PIXELS', pixels); },
    setPixel(context, pixel) { context.commit('SET_PIXEL', pixel); },
    createPixels(context) { context.commit('CREATE_PIXELS'); },
    mouseDown(context) { context.commit('MOUSE_DOWN'); },
    mouseUp(context) { context.commit('MOUSE_UP'); },
    changeBrush(context, color) { context.commit('CHANGE_BRUSH', color);},
    fill(context) { context.commit('FILL'); },
    clear(context) { context.commit('CLEAR'); },
    save(context) { /*not implemented yet*/}
  }
});
