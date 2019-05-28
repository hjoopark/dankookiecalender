<template>
  <el-button
    id="floating"
    circle
    @click="onClick"
    :style="getStyle()"
  >
    <i :class="`fa fa-${icon}`" aria-hidden="true"></i>
  </el-button>
</template>

<script>
export default {
  name: 'FloatingButton',

  data () {
    return {}
  },

  props: {
    icon: {
      type: String,
      default: 'pencil'
    },
    right: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    }
  },

  methods: {
    onClick (e) {
      this.$emit('click', e)
    },

    getBottomPosition () {
      var bottom = parseInt(this.bottom)

      if (bottom <= 0) return 70
      else {
        return 70 + (bottom * 55)
      }
    },

    getRightPosition () {
      var right = parseInt(this.right)

      if (right <= 0) return 20
      else {
        return 20 + (right * 55)
      }
    },

    getStyle () {
      return {
        right: `${this.getRightPosition()}px`,
        bottom: `${this.getBottomPosition()}px`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#floating {
  position: fixed;
  z-index: 500;
  opacity: 0.7;
  height: 50px;
  width: 50px;
  font-size: 1.2em;
}
</style>
