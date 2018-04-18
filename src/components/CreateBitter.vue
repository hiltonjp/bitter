<template>
  <div id="create">
    <div class="container">
        <edit-board :pixelsize=24 />
        <br>
        <input type="text" id="title" v-model="title">
        <div class="toolbox">
          <div class="picker">
            <sketch v-model="colors"/>
          </div>
          <div class="buttons">
            <p>File Tools:</p>
            <div class="tools">
              <button class="toolbutton" @click="save()">Save</button>
              <button class="toolbutton" @click="deleteBitter()">Delete</button>
              <button class="toolbutton" @click="newBitter()">New</button>
              <button class="toolbutton" @click="fill()">Fill</button>
              <button class="toolbutton" @click="clear()">Clear</button>
            </div>
            <p>Brush Sizes:</p>
            <div class="tools">
              <button class="brushbutton" @click="setBrushSize('small')">small</button>
              <button class="brushbutton" @click="setBrushSize('med')">medium</button>
              <button class="brushbutton" @click="setBrushSize('large')">large</button>
            </div>
          </div>
        </div>
    </div>
    <div class="images">
      <div v-for="creation in creations">
        <div class="menuitem" @click="setBitter(creation)">
          <h3>{{creation.title}}</h3>
          <p>{{creation.created | since}}</p>
          <div class="del" @click="deleteItem(creation)">X</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EditBoard from './EditBoard';
  import BitBoard from './BitBoard';
  import { Sketch } from 'vue-color';
  import moment from 'moment';

  export default {
    components: { EditBoard, 'sketch': Sketch, BitBoard },
    created: function() {
      this.$store.dispatch('getCreations').then(() => {
        this.title = this.$store.getters.title;
      })
    },
    data() {
      return {
        title: '',
        colors: [],
      }
    },
    methods: {
      fill() {
        this.$store.dispatch('fill');
      },
      clear() {
        this.$store.dispatch('clear');
      },
      save() {
        console.log(this.title);
        this.$store.dispatch('setTitle', this.title).then(() =>{
          let idx = this.$store.getters.creation_id;
	        //this.$store.dispatch('setCreationTitle',this.title, idx);
          this.$store.dispatch('saveCreation');
        })
      },
      newBitter() {
        this.$store.dispatch('newCreation').then(() => {
        })
      },
      deleteBitter() {
        this.deleteItem({id: this.$store.getters.creation_id});
      },
      deleteItem(bitter) {
        if (this.creations.length === 1) {
          this.$store.dispatch('newCreation').then(() => {
            this.$store.dispatch('deleteCreation', bitter.id);
          })
        } else {
          this.$store.dispatch('deleteCreation', bitter.id);
        }
      },
      setBitter(bitter) {
        this.$store.dispatch('setCreation', bitter);
      },
      setBrushSize(size) {
        this.$store.dispatch('setBrushSize', size);
      },
      pixels(creation) {
        return JSON.parse(creation.pixels)
      },
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
      stateTitle() {
        return this.$store.getters.title;
      }
    },
    watch: {
      colors: function(color) {
        this.$store.dispatch('changeBrush', color.hex);
      },
      stateTitle: function(title) {
        this.title = title;
      }
    }
  }
</script>

<style scoped>
  #create {
    display: flex;
    text-align: center;
  }
  .container {
    flex-grow: 1;
    flex-shrink: 1;
  }
  .images {
    display: inline-flex;
    flex-direction: column;
  }
  .toolbox {

    display: flex;
    padding-top: 20px;
    justify-content: center;
  }
  .picker {
    display: inline-block;
    text-align: center;
  }
  .buttons p {
    text-align: left;
    margin: 20px;
  }
  .buttons {
    padding: 20px;
    display: inline-flex;
    flex-wrap: wrap;
    margin-left: 10px;
    flex-direction: column;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 6px 10px #00000028;
  }
  .toolbutton {
    margin: 4px 4px;
    width: 100px;
    color: black;
  }
  .brushbutton {
    color: black;
  }
  .menuitem {
    display: inline-block;
    padding: 10px;
    margin: 12px;
    width: 240px;
    background-color: black;
    color: white;
    border-radius: 6px;
    box-shadow: 0px 2px 3px #00000088;
    text-align: left;
  }
  .menuitem h3 {
    font-size: 32px;
  }
  .menuitem h1 {
  }
  .menuitem:hover {
    transform: rotateZ(-1deg);
    transition-duration: .2s;
  }
  .menuitem:active {
    transform: translateY(3px) rotateZ(1deg);
    transition-duration: .1s;
  }
  #title {
    height: 60px;
    width: 560px;
    border: none;
    background-color: #FFFFFF;
    border-radius: 8px;
    font-size: 60px;
    padding: 8px;
    box-shadow: 0px 3px 8px #00000088;
    text-align: center;
    transition-duration: .2s;
    margin-top: 12px;
  }
  #title:hover {
    color: #AAAAAA;
    transition-duration: .2s;
  }
  #title:focus {
    outline: none;
  }
  .tools {
    display: flex;
    flex-wrap: wrap;
  }
  .del {
    font-size: 30px;
    float: right;
  }
</style>
