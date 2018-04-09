<template>
  <div id="app">
    <!--img src="./assets/logo.png"-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
html,body {
  margin: 0;
  padding: 0;
  background-color: #99BBFF;
}
</style>
