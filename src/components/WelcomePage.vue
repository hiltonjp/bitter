<template>
  <div class="column">
    <!--img src="/static/images/home-icon.png" alt=""-->
    <h1>Bitter: express yourself</h1>
    <h2>{ stay sweet. }</h2>
    <form v-on:submit.prevent="register">
      <div class="infobox"v-bind:style="{
        'background-color': pickedColor,
      }">
        <p>Everybody needs a cool name</p>
        <input type="text" id="username" class="narrow" v-model="username" placeholder="username"/>

        <p>But enough about us...</p>
        <input type="text" class="narrow" v-model="fname" placeholder="first name"/>
        <input type="text" class="narrow" v-model="lname" placeholder="last name"/>

        <input type="text" class="narrow" v-model="email" placeholder="email"/>
        <input type="password" class="narrow" v-model="password" placeholder="password"/>
        <br>
        <hr>
        <p id="pick">Pick a favorite:</p>
        <br>
        <div class="picker">
          <slider v-model="colors" @input="changeColor"/>
        </div>
      </div>
      <button class=" wide alternate" type="submit">Create Account</button>
      <p class="error">{{registerError}}</p>
    </form>
  </div>
</template>

<script>
  import {Slider} from 'vue-color';

  export default {
    name: 'WelcomePage',
    components: {'slider': Slider},
    data() {
      return {
        username: '',
        email: '',
        password: '',
        fname: '',
        lname: '',
        pickedColor: '#EFEFEF',
        colors: "#FFFFFF",
      }
    },
    computed: {
      registerError: function() {
        return this.$store.getters.registerError;
      },
    },
    methods: {
      register: function() {
        this.$store.dispatch('register', {
          username: this.username,
          email: this.email,
          password: this.password,
          name:  this.fname + " " + this.lname,
          fname: this.fname,
          lname: this.lname,
          favcolor: this.colors.hex,
        });
      },
      changeColor: function() {
        this.pickedColor = this.colors.hex;
      },
    }
  }
</script>

<style scoped>
   img {
      width: 100px;
  }

  h1 {
    font-weight: bolder;
    font-size: 4em;
    margin-bottom: 0px;
  }
  h2 {
    font-weight: bolder;
     margin-top: 0px;
     font-size: 2em;
     font-weight: normal;
     margin-bottom: 50px;
  }
  .narrow {
     width: 300px;
  }
  .wide {
      width: 370px;
  }

  .column {
    min-width: 800px;
    text-align: center;
  }
  .infobox {
    position: relative;
    display: inline-block;
    width: 400px;
    padding: 20px;
    background-color: white;
    border-radius: 3px;
    -webkit-box-shadow: 0px  1px 4px #00000088;
    box-shadow: 0px  1px 4px #00000088;
  }
  form {
    text-align: center;
  }
  input {
    display: block;
    margin: 10px auto;
  }
  #username {
    margin-bottom: 30px;
  }
  button {
    display: block;
    margin: 10px auto;
  }
  .picker {
    background-color: white;
    border-radius: 3px;
    padding: 20px;
    box-shadow: 0px 1px 3px #00000088;
    display: flex;
    margin-top: 40px;
    justify-content: center;
  }
  slider {
    margin-top:  40px;
  }
  hr {
    background-color: black;
    border: none;
    height: 1px;
  }
  p {
    font-size: 20px;
    display: inline-block;
    padding:  6px 20px;
    border-radius: 3px;
    background-color: #FFFFFF33;
  }
  #pick {
    display: block;
    float: left;
    margin: 12px 12px 12px 0px;
  }
</style>
