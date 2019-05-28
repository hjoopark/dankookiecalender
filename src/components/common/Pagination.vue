<template>
  <div class="pagination container">
    <div class="seven prev" @click="prevPage">
      이전
    </div>
    <div class="seven" @click="setPage(page)" v-for="page in pages" :key="page" :class="{'active': page == currentPage}">
      {{ validPage(page) ? page : ''}}
    </div>
    <div class="seven next" @click="nextPage">
      다음
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  data () {
    return {
      currentPage: 1
    }
  },
  props: ['maxPage'],
  methods: {
    setPage (page) {
      if (!this.validPage(page)) return
      this.currentPage = page
      this.$emit('change', page)
    },

    clear () {
      this.currentPage = 1
    },

    prevPage () {
      this.setPage(this.currentPage - 1)
    },

    nextPage () {
      this.setPage(this.currentPage + 1)
    },

    validPage (page) {
      if (page <= 0 || page > this.maxPage) return false
      else return true
    }
  },
  computed: {
    pages () {
      if (this.currentPage <= 2) {
        return [1, 2, 3, 4, 5]
      } else if (this.currentPage >= this.maxPage - 2) {
        return [
          this.maxPage - 4,
          this.maxPage - 3,
          this.maxPage - 2,
          this.maxPage - 1,
          this.maxPage
        ]
      } else {
        return [
          this.currentPage - 2,
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          this.currentPage + 2
        ]
      }
    },

    getPage () {
      return parseInt(this.currentPage)
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '../style/style.scss';

.pagination.container {
  list-style: none;
  padding-bottom: 10px;
  margin-top: 10px;
  text-align: center;
  color: white;
  font-size: 13px;
  font-weight: 600;
  .seven {
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px;
    padding: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background-color: #fbbd08;
    &.prev {
      border-radius: 50px 0 0 50px;
      padding: 0px 7px;
      &:hover {
        background-color: #fbbd08;
      }
    }
    &.next {
      border-radius: 0 50px 50px 0;
      padding: 0px 7px;
      &:hover {
        background-color: #fbbd08;
      }
    }
    &:hover {
      background-color: rgb(255, 136, 0);
    }
    &.active,
    &:active {
      background-color: rgb(255, 136, 0);
    }
  }
}
</style>
