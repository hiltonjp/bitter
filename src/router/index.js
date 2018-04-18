import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import HomePage from '@/components/HomePage'
import CreateBitter from '@/components/CreateBitter'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/edit',
      name: 'CreateBitter',
      component: CreateBitter
    }
  ]
})
