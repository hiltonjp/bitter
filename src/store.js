import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const getAuthHeader = () => {
   console.log("Get Auth Header:");
   console.log(localStorage.getItem('token'));
   return { headers: {'authorization': localStorage.getItem('token')}};
}

export default new Vuex.Store({
  state: {
    // login/register
    user: {},
    //loggedIn: false,
    token: '',
    loginError: '',
    registerError: '',


    // user page
    //focus: {},
    creations: [],
    favcolor: '#FFFFDD',

    // Editor tool
    title: '',
    creation_id: '',
    pixels: [],
    drawing: false,
    brush: "#000000",
    bsize: "small",
    filled: false,
    cleared: false,
    numPixels: Math.pow(24, 2),
  },
  getters: {
    // login/register
    user: state => state.user,
    //loggedIn: state => state.loggedIn,
    getToken: state => state.token,
    loggedIn: state => {
      if (state.token === '')
        return false;
      return true;
    },
    loginError: state => state.loginError,
    registerError: state => state.registerError,

    // user page
    focus: state => state.focus,
    creations: state => state.creations,
    favcolor: state => state.favcolor,

    //Editor tool
    title: state => state.title,
    creation_id: state =>state.creation_id,
    pixels: state => state.pixels,
    pixel: (state) => (index) => { return state.pixels[index]; },
    drawing: state => state.drawing,
    brush: state => state.brush,
    brushsize: state => state.bsize,
    filled: state => state.filled,
    cleared: state => state.cleared,
    numPixels: state => state.numPixels,
  },
  mutations: {
    // login/register
    SET_USER(state, user) {state.user = user;},
    //SET_LOGIN(state, status) {state.loggedIn = status;},
    SET_TOKEN(state, token) {
      state.token = token;
      if (token === '')
	localStorage.removeItem('token');
      else
	localStorage.setItem('token', token)
    },
    SET_LOGIN_ERROR(state, message) {state.loginError = message;},
    SET_REGISTER_ERROR(state, message) {state.registerError = message;},

    // user page
    SET_FAV_COLOR(state, favcolor) { state.favcolor = favcolor; },
    SET_CREATIONS(state, creations) { state.creations = creations; },
    SET_PIXELS(state, pixels) { state.pixels = pixels },
    SET_CREATION_ID(state, id) { state.creation_id = id; },
    SET_TITLE(state, title) {state.title = title},
    REMOVE_ITEM(state, id) {
      let i = 0;
      for (i; i < state.creations.length; i++) {
        if (state.creations[i].id === id) {
          break;
        }
      }
      Vue.delete(state.creations, i);
    },

    // Editor Tool
    CREATE_PIXELS(state) {
      for(let i = 0; i < state.numPixels; i++) {
        state.pixels.push('#FFFFFF');
      }
    },
    FILL(state) {
      for (let i = 0; i < state.numPixels; i++)
        Vue.set(state.pixels, i, state.brush);
    },
    CLEAR(state) {
      for (let i = 0; i < state.numPixels; i++)
        Vue.set(state.pixels, i, "#FFFFFF");
    },

    SET_PIXEL(state, pixel) { Vue.set(state.pixels, pixel.index, pixel.color); },
    MOUSE_DOWN(state) { state.drawing = true; },
    MOUSE_UP(state) { state.drawing = false; },
    SET_BRUSH_COLOR(state, color) { state.brush = color; },
    SET_BRUSH_SIZE(state, size) { state.bsize = size; },

  },
  actions: {

    // Initialize //
    initialize(context) {
      let token = localStorage.getItem('token');
      console.log("Is there actually one?");
      console.log(token);
      if(token) {
       // see if we can use the token to get my user account
       axios.get("/api/me",getAuthHeader()).then(response => {
         context.commit('SET_TOKEN',token);
         context.commit('SET_USER',response.data.user);
	 context.commit('SET_FAV_COLOR',response.data.user.favcolor);
       }).catch(err => {
         // remove token and user from state
         localStorage.removeItem('token');
         context.commit('SET_USER',{});
         context.commit('SET_TOKEN','');
       });
      }
    },

    // login/register
    register(context, user) {
      console.log("register");
      axios.post("/api/users",user).then(response => {
        context.commit('SET_USER', response.data.user);
        //context.commit('SET_LOGIN', true);
	console.log("Did I get a token? ", response.data.token);
	context.commit('SET_TOKEN', response.data.token);
        context.commit('SET_REGISTER_ERROR', '');
        context.commit('SET_LOGIN_ERROR', '');
        console.log(response.data.user.favcolor);
        context.commit('SET_FAV_COLOR', response.data.user.favcolor);
	console.log("Hehehehehehee");
      }).catch(error => {
        console.log("reg error");
	console.log(error);
        context.commit('SET_LOGIN_ERROR', '');
        //context.commit('SET_LOGIN', false);
	context.commit('SET_TOKEN', '');
        if (error.response) {
	        if (error.response.status === 403)
	          context.commit('SET_REGISTER_ERROR',"That email address already has an account.");
	        else if (error.response.status === 409)
            context.commit('SET_REGISTER_ERROR',"That user name is already taken.");
          return;
        }
        context.commit('SET_REGISTER_ERROR',"Sorry, your request failed. We will look into it.");
      });
    },

    login(context,user) {
      axios.post("/api/login",user).then(response => {
        context.commit('SET_USER', response.data.user);
        //context.commit('SET_LOGIN',true);
        context.commit('SET_TOKEN', response.data.token);
	context.commit('SET_REGISTER_ERROR',"");
        context.commit('SET_LOGIN_ERROR',"");
        context.commit('SET_FAV_COLOR', response.data.user.favcolor);
      }).catch(error => {
        context.commit('SET_REGISTER_ERROR',"");
        if (error.response) {
          if (error.response.status === 403 || error.response.status === 400)
            context.commit('SET_LOGIN_ERROR',"Invalid login.");
          context.commit('SET_REGISTER_ERROR',"");
	  context.commit('SET_TOKEN', '');
          return;
        }
        context.commit('SET_LOGIN_ERROR',"Sorry, your request failed. We will look into it.");
      });
    },

    logout(context,user) {
      context.dispatch('saveCreation').then(() => {
        context.commit('SET_USER', {});
        //context.commit('SET_LOGIN',false);
      	context.commit('SET_TOKEN', '');
        context.commit('SET_FAV_COLOR','#FFFFDD');
      });
    },

    //Editor utility
    getCreations(context) {
      axios.get("/api/users/" + context.state.user.id + "/creations").then(response => {
        console.log(response.data);
        if (response.data.creations.length === 0) {
          context.dispatch("newCreation");
        } else {
          let newest = response.data.creations.filter((bitter) => {
		return bitter.id === context.state.creation_id;
	  });
	  if  (newest.length === 0) {
		newest  = response.data.creations[0];
	  } else {
		newest = newest[0];
	  }

          let pixels = JSON.parse(newest.pixels);
          console.log("response data", response.data);
          context.commit('SET_CREATIONS', response.data.creations);
          context.commit("SET_PIXELS", pixels);
          context.commit("SET_TITLE", newest.title);
          context.commit("SET_CREATION_ID", newest.id);
        }
      }).catch(error => {
        console.log("getCreations failed:",error);
      });
    },

    newCreation(context) {
      axios.post("/api/users/"+context.state.user.id+"/creations", {
        resolution: context.state.numPixels,
      }, getAuthHeader()).then(response => {
        let pixels = JSON.parse(response.data.image.pixels);
        context.commit("SET_PIXELS", pixels);
        context.commit("SET_TITLE", response.data.image.title);
        context.commit("SET_CREATION_ID", response.data.image.id);
        context.dispatch('getCreations');
      }).catch(err => {
        console.log("newCreation failed:",err);
      });
    },

    saveCreation(context) {
      //console.log(context.state.pixels);
      let update = {
        title: context.state.title,
        data: JSON.stringify(context.state.pixels),
        univ_edit: false,
      }
      axios.patch("/api/creations/" + context.state.creation_id, update, getAuthHeader()).then(response => {
	console.log("response from save", response);
	if (context.state.user !== {}) {
	    context.dispatch("getCreations");
	}
      }).catch(error => {
        console.log("saveCreation failed:", error);
      });
    },

    deleteCurrentCreation(context) {
      console.log("before delete", context.state.creation_id);
      axios.delete("/api/creations/" + context.state.creation_id, getAuthHeader()).then(response =>{
        console.log("after delete", context.state.creation_id);
	context.commit('REMOVE_ITEM', context.state.creation_id);
      })
    },

    deleteCreation(context, id) {
      axios.delete("/api/creations/" + id, getAuthHeader()).then(response =>{
        context.commit("REMOVE_ITEM", id);
	context.dispatch('getCreations');
      });
    },

    setCreation(context, bitter) {
      let pixels = JSON.parse(bitter.pixels);
      context.commit("SET_PIXELS", pixels);
      context.commit("SET_TITLE", bitter.title);
      context.commit("SET_CREATION_ID", bitter.id);
    },

    // Editor tool
    draw(context, pixel) {
      let numPixels = context.state.numPixels;
      let row = Math.sqrt(numPixels);
      if (context.state.bsize === "small") {
        context.commit('SET_PIXEL', pixel);
      } else if (context.state.bsize === "med") {
        context.commit('SET_PIXEL', pixel);
        context.commit('SET_PIXEL', {color: pixel.color, index: Math.min(numPixels, pixel.index+24)});
        if (pixel.index % row != row-1) {
          context.commit('SET_PIXEL', {color: pixel.color, index: Math.min(numPixels, pixel.index+1)});
          context.commit('SET_PIXEL', {color: pixel.color, index: Math.min(numPixels, pixel.index+row+1)});
        }
      } else if (context.state.bsize === "large") {
        context.commit('SET_PIXEL', pixel);
        context.commit('SET_PIXEL', {color: pixel.color, index: Math.min(numPixels, pixel.index+24)});
        //console.log(pixel.index);
        if (pixel.index !== row-1)
          context.commit('SET_PIXEL', {color: pixel.color, index: Math.max(0, pixel.index-24)});
        if (pixel.index % row !== row-1) {
          context.commit('SET_PIXEL', {color: pixel.color, index: Math.max(0, pixel.index-row+1)});
          context.commit('SET_PIXEL', {color: pixel.color, index: Math.min(numPixels, pixel.index+1)});
          context.commit('SET_PIXEL', {color: pixel.color, index: Math.min(numPixels, pixel.index+row+1)});
        }
        if (pixel.index % row !== 0) {
          context.commit('SET_PIXEL', {color: pixel.color, index: Math.max(0, pixel.index-1)});
          context.commit('SET_PIXEL', {color: pixel.color, index: Math.min(numPixels, pixel.index+row-1)});
          if (pixel.index !== row-1)
            context.commit('SET_PIXEL', {color: pixel.color, index: Math.max(0, pixel.index-row-1)});
        }
      } else {
        console.log("got here");
        context.commit('SET_PIXEL', pixel);
      }
    },
    createPixels(context) { context.commit('CREATE_PIXELS'); },
    mouseDown(context) { context.commit('MOUSE_DOWN'); },
    mouseUp(context) { context.commit('MOUSE_UP'); },
    changeBrush(context, color) { context.commit('SET_BRUSH_COLOR', color);},
    fill(context) { context.commit('FILL'); },
    clear(context) { context.commit('CLEAR'); },
    setBrushSize(context, size) { context.commit('SET_BRUSH_SIZE', size); },
    setTitle(context, title) { context.commit('SET_TITLE', title); }
  }
});
