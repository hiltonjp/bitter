<template>
  <nav>
    <ul id="menu">
      <li><!--img src="/static/images/red-bird.png"/--></li>
      <li><router-link to="/"><!--img src="/static/images/red-bird.png"/-->Bitter</router-link></li>
      <li class="right" v-if="loggedIn"><a @click="logout" href="#">Logout</a></li>
      <li class="right" v-if="loggedIn">User: {{user.username}}</li>
      <form v-else class="right" v-on:submit.prevent="login">
      	<input v-model="email" placeholder="Email Address">
      	<input v-model="password" placeholder="Password">
      	<button class="primary" type="submit">Login</button>
      </form>
    </ul>
    <div class="flexWrapper errorPlace">
      <p v-if="loginError" class="flexRight error">{{loginError}}</p>
    </div>
  </nav>
</template>

<script>
 export default {
   name: 'AppHeader',
   data () {
     return {
       email: '',
       password: '',
     }
   },
   computed: {
     user: function() {
       return this.$store.getters.user;
     },
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
     loginError: function() {
       return this.$store.getters.loginError;
     },
   },
   methods: {
     login: function() {
       this.$store.dispatch('login',{
         email: this.email,
         password: this.password,
       }).then(user => {
      	 this.email = '';
      	 this.password = '';
       });
     },
     logout: function() {
       this.$store.dispatch('logout');
     }
   }
 }
</script>


<style scoped>
   nav {
      padding-top: 12px;
      background-color: #00004422;
      display: grid;
      margin-bottom: 20px;
   }
   ul {
       list-style-type:none;
       margin:0;
       padding:0;
   }
   /* Create a horizontal list with spacing */
   li {
       display:inline-block;
       float: left;
       margin-right: 20px;
       height: 50px;
       text-align: center;
       line-height: 50px;
       color: #00000088;
      text-decoration: none;
    }
   /*Active color*/
   li a.active {
   }
   /*Hover state for top level links*/
   li:hover a {
   }
   .right {
    float: right;
    margin-right: 16px;
   }
   .errorPlace {
     height: 16px;
   }
   img {
     width: 50px;
   }
  a {
    text-decoration: none;
    color: #00000088;
  }
  a:hover {
    color: #ffffffaa;
  }
  button {
    margin: 0;
    margin-bottom: 2px;
  }
</style>
