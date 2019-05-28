<template>
  <div class="dk-radio">
    <el-button
      type="small"
      v-for="(item,idx) in items"
      :key="item.value"
      @click="select(idx)"
      :class="{'selected': selectedIdx === idx}"
    >
      {{item.label}}
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'dk-radio',
  // props: ['enum', 'disabled', 'default'],
  props: {
    name: String,
    value: {
      type: null,
      default: null
    },
    enum: {
      type: null,
      default: null
    },
    default: Number
  },
  data () {
    return {
      items: [],
      selectedIdx: -1
    }
  },
  // $_veeValidate: {
  //   value () {
  //     if(selectedIdx === -1) return null;
  //     return this.items[idx].value;
  //   },
  //   name () {
  //     return this.name;
  //   }
  // },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.clear()
      this.setItems()
    },

    clear () {
      this.items = []
      this.selectedIdx = this.default === 0 || this.default ? this.default : -1
    },

    setItems () {
      this.items = this.enum
    },

    select (idx) {
      this.selectedIdx = idx
      this.$emit('change', this.items[idx])
      this.$emit('input', this.items[idx].value)
    },

    selectByValue (value) {
      var selectedIdx = 0
      var result = this.items.some(e => {
        if (value === e.value) return true
        selectedIdx++
      })
      if (!result) return

      this.select(selectedIdx)
    }
  },

  watch: {
    enum (newValue, oldValue) {
      if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.dk-radio {
  .el-button {
    margin: 10px 0 0 10px;

    &:hover,
    &.selected {
      background: orange !important;
      border-color: orange !important;
      color: #fff;
      outline: 0;
    }
  }
}
</style>
