import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import createUserPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    user
  },
  plugins: [createUserPersistedState()]
})
