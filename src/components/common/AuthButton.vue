<template>
  <span @click="onClick">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'auth',
  props: {
    require: {
      type: String,
      required: true
    }
  },
  methods: {
    onClick (e) {
      const auth = this.require.toUpperCase()

      if (!this.$store.getters.hasAuth(auth)) {
        if (!this.$store.getters.user.isLoggedIn) { this.$toasted.show('로그인이 필요합니다.') } else if (auth === 'USER') { this.$toasted.show('마이페이지에서 단국대 인증을 완료해주세요.') } else this.$toasted.show('권한이 없습니다.')
        return
      }

      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  cursor: pointer;
}
</style>
