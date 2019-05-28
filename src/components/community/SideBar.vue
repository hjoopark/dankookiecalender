<template>
  <div
    :class="{
      open: show,
      close: !show
    }"
    class="sidebar"
    @click.self="close"
  >
    <el-menu
      class="category_menu el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      >

      <el-submenu
        v-for="(item, categoryIdx) in category.list"
        :index="`${categoryIdx + 1}`"
        :key="categoryIdx.toString()"
        :disabled="!hasAuth(item.requiredAuthToList)"
      >
        <template slot="title">
          <span>{{item.name}}</span>
        </template>
        <el-menu-item
          :index="`${categoryIdx+1}-1}`"
          @click="change(item.name)"
        >전체</el-menu-item>
        <el-menu-item
          v-for="(subItem, subIdx) in item.sub"
          :key="`${categoryIdx+1}-${subIdx+2}`"
          :index="`${categoryIdx+1}-${subIdx+2}`"
          @click="change(item.name, subItem.name)"
        >{{subItem.name}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import category from '@/models/community/category'
import { mapGetters } from 'vuex'

export default {
  name: 'CommuniySideBar',

  computed: {
    ...mapGetters(['hasAuth'])
  },

  data () {
    return {
      category,
      show: false
    }
  },

  methods: {
    open () {
      this.show = true
    },

    close () {
      this.show = false
    },

    change (category, subCategory) {
      this.$emit('changeCategory', category, subCategory)
      this.close()
    }
  }
}
</script>

<style lang="scss">
.sidebar {
  position: fixed;
  top: 40px;
  left: 0;
  width: calc(100vw + 200px);
  height: calc(100vh - 90px);
  transition: all 0.5s;

  &.open {
    visibility: visible;
    left: -200px;
    background-color: rgba(0, 0, 0, 0.3);
  }
  &.close {
    visibility: hidden;
    left: 0px;
    background-color: transparent;
  }

  .el-menu.category_menu {
    float: right;
    width: 200px;
    border: 0;
    height: calc(100vh - 90px);
    overflow-y: auto;

    .el-submenu__title {
      height: 45px !important;
      line-height: 45px !important;
    }
    .el-menu-item {
      height: 35px !important;
      line-height: 35px !important;
    }
  }
}
</style>
