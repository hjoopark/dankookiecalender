<template>
  <modal ref="cookie_modal">
    <template slot="title">내정보</template>
    <template slot="body">
      <div>
        <p v-html="description.replace(/\\n/g, '<br/>')"></p>
        <ul class="list_container">
          <li>
            <span class="left">보유한 쿠키</span>
            <span class="right">
              <span class="highlight">{{user.me.point | numberWithComma }}</span> 개
            </span>
          </li>
          <li>
            <span class="left">필요한 쿠키</span>
            <span class="right">
              <span class="highlight">{{ point | numberWithComma }}</span> 개
            </span>
          </li>
        </ul>
        <el-button
          type="warning"
          size="midium"
          :disabled="user.me.point < point"
          @click="doConfirm"
        >{{ user.me.point >= point ? confirmBtnLabel : '쿠키가 부족합니다' }}</el-button>
      </div>
    </template>
  </modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'CookieModal',
  components: {
    Modal
  },
  computed: {
    ...mapGetters(['user'])
  },
  props: {
    title: {
      type: String,
      default: '쿠키샵'
    },
    point: {
      type: Number,
      required: true
    },
    confirmBtnLabel: {
      type: String,
      default: '확인'
    },
    description: {
      type: String
    }
  },

  methods: {
    ...mapActions(['userInit']),

    doConfirm () {
      this.$emit('confirm')
      this.userInit()
      this.close()
    },
    open () {
      this.$refs.cookie_modal.open()
    },
    close () {
      this.$refs.cookie_modal.close()
    }
  }
}
</script>

<style>
</style>
