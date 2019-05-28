import axios from '@/plugins/customAxios'
import eventBus from '@/plugins/eventBus'
import webViewScript from '@/plugins/webViewScript'

export default {
  state: {
    showLoginModal: false,
    showMoreMenu: false,
    user: {
      isLoggedIn: false,
      me: {}
    }
  },

  getters: {
    showLoginModal (state) {
      return state.showLoginModal
    },
    showMoreMenu (state) {
      return state.showMoreMenu
    },
    user (state) {
      return state.user
    },
    hasAuth (state) {
      return auth => {
        try {
          const requireAuth = auth.toUpperCase()
          if (requireAuth === 'NONE') return true
          else if (!state.user.isLoggedIn) return false
          else if (requireAuth === 'LOGIN') return true
          else if (state.user.me.auth_scope.includes(requireAuth)) return true
          else if (state.user.me.auth_scope.includes('ADMIN')) return true
          else return false
        } catch (error) {
          return false
        }
      }
    },
    alarmLength (state) {
      if (!state.user.isLoggedIn) return 0
      if (!state.user.me.alarm.length) return 0
      return state.user.me.alarm.length > 9 ? '9+' : state.user.me.alarm.length
    }
  },

  mutations: {
    toggleLoginModal (state) {
      state.showMoreMenu = false
      state.showLoginModal = !state.showLoginModal
    },
    closeLoginModal (state) {
      state.showLoginModal = false
    },
    toggleShowMoreMenu (state) {
      state.showMoreMenu = !state.showMoreMenu
    },
    closeShowMoreMenu (state) {
      state.showMoreMenu = false
    },
    fetchMe (state, result) {
      state.user.isLoggedIn = result.isLoggedIn
      state.user.me = result.me
    },
    fetchProfile (state, payload) {
      state.user.me.profile = payload.profile
    }
  },

  actions: {
    login ({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('/user/login', payload)
          .then(res => {
            if (res.data.success) {
              dispatch('userInit').then(() => {
                eventBus.$emit('didLogin')
                webViewScript.emitDidLogin()
                window.scrollTo(0, 0)
                resolve()
              })
            } else {
              reject(new Error(res.data.message))
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    logout ({ dispatch }) {
      return new Promise(resolve => {
        // reject
        axios.post('/user/logout').then(res => {
          if (res.data.success) {
            dispatch('userInit')
            resolve()
            location.href = '/'
          }
        })
      })
    },

    signup ({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('/user', payload)
          .then(res => {
            if (res.data.success) return resolve(res)
            return reject(res.data)
            // 자동 로그인
            // dispatch('login', {
            //   login_id: payload.login_id,
            //   password: payload.password,
            //   keep: false
            // }).then(response => {
            //   resolve(response);
            // }).catch(err => {
            //   reject(err);
            // });
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // findId({ dispatch }, payload) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post("/user/find/id", payload)
    //       .then(res => {
    //         let message;
    //         if (res.data.success) {
    //           message = `찾으시는 아이디는 [ ${res.data.login_id} ] 입니다.`;
    //         } else {
    //           message = `일치하는 아이디가 없습니다. 회원가입을 이용해주세요.`;
    //         }
    //         resolve({
    //           message: message
    //         });
    //       })
    //       .catch(err => {
    //         reject(err);
    //       });
    //   });
    // },
    // findPw({ dispatch }, payload) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post("/user/find/password", payload)
    //       .then(res => {
    //         resolve(res.data);
    //       })
    //       .catch(err => {
    //         reject(res.data);
    //       });
    //   });
    // },
    getDocument ({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios.get('/community/me').then(res => {
          res.data.success ? resolve(res.data) : reject(res.data)
        })
      })
    },
    changePw ({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/user/me/password`, payload)
          .then(res => {
            if (!res.data.success) reject(res.data)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    resign ({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/user/leave`, payload)
          .then(res => {
            if (!res.data.success) return reject(res.data)
            alert('정상적으로 회원탈퇴 되었습니다.')
            dispatch('logout')
          })
          .catch(err => {
            if (err.response.status === 401) { return reject(err) }
            reject(err)
          })
      })
    },
    auth ({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/user/me/auth`, payload)
          .then(res => {
            if (!res.data.success) reject(res.data)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    userInit ({ commit, state }) {
      return new Promise((resolve, reject) => {
        axios
          .get('/user/me')
          .then(res => {
            if (res.data.success) {
              commit('fetchMe', {
                isLoggedIn: true,
                me: res.data.me
              })
              webViewScript.emitDidLogin()
            } else {
              commit('fetchMe', {
                isLoggedIn: false,
                me: {}
              })
            }
            resolve(state.user.me)
          })
          .catch(err => {
            commit('fetchMe', {
              isLoggedIn: false,
              me: {}
            })
            reject(err)
          })
      })
    }
  }
}
