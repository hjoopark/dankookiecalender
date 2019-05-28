import { store } from '../store/index.js'

export default {
  hasAuth (auth) {
    try {
      if (auth.toUpperCase() === 'LOGIN') return store.getters.user.isLoggedIn
      if (store.getters.user.me.auth_scope.includes('ADMIN')) return true
      return store.getters.user.me.auth_scope.includes(auth.toUpperCase())
    } catch (err) {
      return false
    }
  },

  isAdmin () {
    return this.hasAuth('ADMIN')
  },

  showMessage (auth, Vue) {
    if (auth && !store.getters.user.isLoggedIn) {
      Vue.toasted.show('로그인이 필요합니다.')
      return store.commit('toggleLoginModal')
    }
    if (auth === 'USER') { return Vue.toasted.show('마이페이지에서 단국대 인증을 완료해주세요.') } else return Vue.toasted.show('권한이 없습니다.')
  }
}
