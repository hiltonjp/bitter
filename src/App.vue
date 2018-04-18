<template>
  <div id="app" v-bind:style="{
    'background-color': bg
  }">
    <app-header/>
    <router-view/>
    <app-footer/>
  </div>
</template>

<script>
  import AppHeader from './components/AppHeader';
  import AppFooter from './components/AppFooter';
  export default {
    name: 'App',
    components: { AppHeader, AppFooter },
    computed: {
      bg: function() {
        return this.$store.getters.favcolor +"!important";
      }
    }
  }
</script>

<style>
  #app {
  
  }
  body {
    font-size: 18px;
    padding: 20px 100px 0px 100px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  button {
    color: #000000;
    min-width: 100px;
    line-height: 1em;
    border: none;
    border-radius: 5px;
    color: white;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1.2rem;
    margin: 4px 2px;
  }
  button.primary {
    background-color: #F35537;
  }
  button.alternate {
    background-color: #77C4D3;
  }
  button:focus {
    outline: none;
  }
  button:hover {
    box-shadow: 0 2px 1px #00000088;
  }
  button:active {
    transform: translateY(4px);
  }
  input {
    height: 20px;
    padding: 10px;
  }
  .flexWrapper {
    display:flex;
  }
  .flexRight {
    margin-left: auto;
  }
  .error {
    color: #F35537;
  }
  .column {
   min-width: 500px;
   text-align: center;
  }
  html,body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
