import Vue from 'vue'
import Router from 'vue-router'
import CreateBitter from '@/components/CreateBitter'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CreateBitter',
      component: CreateBitter
    }
  ]
})
