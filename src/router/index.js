import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../store'
import User from '@/models/user.js'

import Home from '@/views/Home.vue'
import Attendance from '@/views/Attendance.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  beforeEach (to, from, next) {
    try {
      const auth = to.matched[to.matched.length - 1].meta.requireAuth // 해당 url의 메타 ( 즉 , auth 정보 )
      if (!auth) {
        if (!store.state.user.user.isLoggedIn) return next()
        store
          .dispatch('userInit')
          .then(() => {
            return next()
          })
          .catch(() => {
            return next()
          })
      } else {
        store
          .dispatch('userInit')
          .then(() => {
            if ((auth && User.hasAuth(auth)) || User.isAdmin()) return next()
            User.showMessage(auth, Vue) // 권한도 없고 / 관리자도 아닐때
          })
          .catch(() => {
            User.showMessage(auth, Vue)
          })
      }
    } catch (e) {
      next()
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/attendance',
      name: 'attendance',
      meta: {
        requireAuth: 'LOGIN'
      },
      component: Attendance
    }
  ]
})
