// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'
import VueAxios from 'vue-axios'
import axios from './plugins/customAxios'
import aws from './plugins/aws'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import SocialSharing from 'vue-social-sharing'
import Toasted from 'vue-toasted'
import VueBarcode from '@chenfengyuan/vue-barcode'
import VueCookie from 'vue-cookie'
import VeeValidate from 'vee-validate'
import ko from 'vee-validate/dist/locale/ko'
import eventBusPlugin from '@/plugins/eventBusPlugin.js'
import User from './models/user.js'
import VueAnalytics from 'vue-analytics'
import webViewScript from '@/plugins/webViewScript'

import moment from 'moment'
import 'moment/locale/ko'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCrown,
  faUser,
  faLock,
  faIdCard,
  faKey,
  faEnvelope,
  faSmile,
  faReply,
  faSearch
} from '@fortawesome/free-solid-svg-icons' // 원하는 것만 import
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import Button from './components/common/Button.vue'
import AuthButton from './components/common/AuthButton.vue'
import FloatingButton from './components/common/FloatingButton.vue'
import Pagination from './components/common/Pagination.vue'
import Social from './components/common/Social.vue'
import Radio from './components/common/Radio.vue'

// eslint-disable-next-line
Object.keys(webViewScript).map(k => {
  // eslint-disable-next-line
  window[k] = webViewScript[k]
})
library.add(
  faCrown,
  faUser,
  faLock,
  faIdCard,
  faKey,
  faEnvelope,
  faSmile,
  faReply,
  faSearch
)

Vue.use(ElementUI)
Vue.use(require('vue-moment'), { moment })
Vue.use(VueAxios, axios)
Vue.use(aws)
Vue.use(Toasted, {
  position: 'bottom-right',
  duration: 2500,
  action: {
    text: '닫기',
    onClick (e, toastObject) {
      toastObject.goAway(0)
    }
  }
})
Vue.use(SocialSharing)
Vue.use(eventBusPlugin)
Vue.use(VueCookie)
Vue.use(VeeValidate, {
  locale: 'ko',
  dictionary: {
    ko
  }
})
Vue.use(VueAnalytics, {
  id: 'UA-74895352-2',
  router
})

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('barcode', VueBarcode)
Vue.component('dk-btn', Button)
Vue.component('auth-btn', AuthButton)
Vue.component('floating-btn', FloatingButton)
Vue.component('dk-pagination', Pagination)
Vue.component('dk-social', Social)
Vue.component('dk-radio', Radio)

Vue.directive('auth', {
  inserted (el, binding) {
    el.style.display = User.hasAuth(binding.arg || binding.value)
      ? 'block'
      : 'none'
  }
})

Vue.filter('numberWithComma', value => {
  if (!value) return '0'
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
