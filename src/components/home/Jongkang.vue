<template>
    <div class="jongkang box">
        종강까지<span class="day">{{ getRemainingDay }}</span>일 남았습니다!
    </div>
</template>

<script>
export default {
  name: 'Jongkang',

  computed: {
    getRemainingDay () {
      return 30
    }
  },

  data () {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.jongkang.box {
    height: 50px;
    text-align: center;

    .day {
        color: red;
        font-size: 1.2em;
        font-weight: bold;
    }
}
</style>
