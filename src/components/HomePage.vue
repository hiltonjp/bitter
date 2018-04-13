<template>
  <div>
    <div v-if="loggedIn">
      <create-bitter/>
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
  import WelcomePage from './WelcomePage';
  import CreateBitter from './CreateBitter';

  export default {
    name: 'HomePage',
    components: {WelcomePage, CreateBitter},
    computed: {
      loggedIn: function() {
        console.log(this.$store.getters.loggedIn);
        return this.$store.getters.loggedIn;
      }
    }
  }
</script>

<style scoped>
</style>
