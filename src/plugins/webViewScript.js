import axios from './customAxios'
import eventBus from './eventBus'

var loggedIn = false

/* eslint-disable no-undef */
export default {
  registerToken (type, token) {
    return new Promise((resolve, reject) => {
      axios
        .post('/user/device', {
          type,
          token
        })
        .then(res => {
          if (res.success) resolve(true)
        })
        .catch(reject)
    })
  },

  emitDidLogin () {
    if (loggedIn) return

    try {
      if (window.android) {
        window.android.didLogin()
        loggedIn = true
      } else {
        webkit.messageHandlers.didLogin.postMessage(true)
        loggedIn = true
      }
    } catch (error) { }
  },

  callIdCardAuth () {
    try {
      if (window.android) {
        window.android.authIdCard()
      } else {
        webkit.messageHandlers.authIdCard.postMessage(true)
      }
    } catch (error) {
      eventBus.$emit('alert', '최신버전의 모바일 앱에서만 가능합니다.')
    }
  },

  registerIdCard (idCardCode) {
    return new Promise((resolve, reject) => {
      axios
        .post('/user/idcard', {
          id_card_code: idCardCode
        })
        .then(res => {
          if (res.data.success) {
            eventBus.$emit('alert', '정상적으로 학생증 인증이 완료되었습니다.')
            eventBus.$emit('didRegisterIdCard', idCardCode)
            resolve(true)
          } else {
            eventBus.$emit('alert', res.data.message)
            reject(new Error(res.data.message))
          }
        })
        .catch(reject)
    })
  }
}
