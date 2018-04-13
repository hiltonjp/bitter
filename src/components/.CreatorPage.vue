<template>
  <div class="creator_page">
    <div v-if="numCreations > 0">
      <div id="focus">
        <div id="board">
          <bit-board :pixelsize=24 :pixels="JSON.parse(this.focus.data)" />
          <br>
          <div id="mainbuttons">
            <button id="edit_main" @click="editCreation()">Edit</button>
            <button id="delete_main" @click="deleteCreation()">Delete</button>
          </div>
        </div>
        <div id="latestinfo">
          <h1>"{{this.focus.title}}"</h1>
          <p>created: {{this.focus.created | since}}</p>
        </div>
      </div>
      <div v-if="numCreations > 1">
        <hr>
        <h1>Other Creations:</h1>
        <div id="creations">
          <div class="creation" v-for="creation in creations" @click="setFocus(creation)" >
            <bit-board :pixelsize=8 :pixels="creation.data" />
          </div>
        </div>
      </div>
      <hr>
    </div>
    <div v-else>
      <h1>Every artist starts small.</h1><br>
      <h2>Tell the world who you are with your first bitter creation</h2><br>
      <button @click="newCreation()">create</button>
    </div>
  </div>
</template>

<script>
  import BitBoard from './BitBoard';
  import moment from 'moment';
  export default {
    name: 'CreatorPage',
    components: {BitBoard},
    created: function() {
      this.$store.dispatch('getCreations');
    },
    filters: {
      since(datetime) {
       return moment(datetime).format('MMMM Do YYYY');
      }
    },
    computed: {
      creations() {
        return this.$store.getters.creations;
      },
      favorites() {
        return this.$store.getters.favorites;
      },
      numCreations() {
        console.log("numCreations:"+this.$store.getters.creations.length);
        return this.$store.getters.creations.length;
      },
      focus() {
        return this.$store.getters.focus;
      }
    },
    methods: {
      newCreation() {
        this.$store.dispatch('newCreation').then((image)=>{

        }).catch(error => {
          console.log(error);
        });
      },
      editCreation() {
        console.log(this.focus);
        this.$router.push({
          path: '/edit',
          id: this.focus.id,
        });
      },
      deleteCreation() {
        this.$store.dispatch('deleteCreation', this.focus.id);
      },
      setFocus(creation) {
        console.log(creation);
        this.$store.dispatch('setFocus', creation);
      }
    }
  }
</script>

<style scoped>
  #focus {
    display: flex;
    align-content: flex-start;
  }
  #board {
    display: inline-block;
    margin-left: 10px;
  }
  #latestinfo {
    display: inline-block;
    flex-grow: 1;
    margin: 0px 10px;
    padding: 20px;
    background-color: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0px 4px 16px #00000088;
  }
  h1, h2 {
    display: inline-block;
    float: none;
  }
  button {
    margin-top: 10px;
    display: inline-block;
    background-color: black;
  }
  #mainbuttons {
    display: flex;
  }
  #edit_main {
    flex-grow: 1;
    margin-left: 10px;
  }
  #delete_main {
    flex-grow: 0;
    margin-right: 16px;
  }
  #creations {
    display: flex;
  }
  .creation {
    margin: 20px;
  }
  .creation:hover {
    transform: rotateZ(-0.5deg) translateY(-4px);
    transition-duration: .2s;
  }
</style>
