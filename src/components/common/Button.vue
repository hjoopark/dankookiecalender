<template>
  <button class="dk-btn" :disabled="disabled" :loading="loading" @click="handleClick">
    <i class="fa fa-spinner fa-spin fa-2x fa-fw" v-show="loading"></i>
    <slot v-if="!loading"></slot>
  </button>
</template>

<script>
export default {
  name: 'dk-button',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick (e) {
      if (this.loading || this.disabled) return false
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #fbbd08;
$white-color: white;
$red-color: #db2828;

.dk-btn {
  cursor: pointer;
  border: none;
  background: 0 0;
  text-decoration: none;
  outline: 0;
  background-color: $primary-color;
  color: white;
  transition: background-color 0.2s;
  display: inline-block;
  padding: 10px 20px;

  &.red {
    border: 1px solid $red-color;
    background-color: $white-color;
    color: $red-color;

    &:hover,
    &.active {
      background-color: $red-color;
      color: white;
    }
  }
  &.basic {
    border: 1px solid gray;
    background-color: white;
    color: gray;

    &:hover,
    &.active {
      background-color: gray;
      color: white;
    }
  }

  &:hover {
    background-color: lighten($color: $primary-color, $amount: 5);
  }
  &[loading="true"],
  &:disabled {
    cursor: not-allowed;
    background-color: gray;
  }
}
</style>
