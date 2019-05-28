<template>
  <div class="community_list_container" ref="community_list_container">
    <div class="top" :class="{stick: isStickTop}">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>커뮤니티</el-breadcrumb-item>
        <el-breadcrumb-item v-if="!query.category">전체 글 보기</el-breadcrumb-item>
        <el-breadcrumb-item v-else>{{query.category}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="query.sub_category">{{query.sub_category}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        size="mini"
        plain
        @click="$refs.sidebar.open()"
      >게시판 선택</el-button>
    </div>

    <div class="list" ref="list" :class="{stick: isStickTop}">
      <div
        v-for="item in topList.concat(list)"
        class="item"
        :class="{'active': $route.params.id == item._id}"
        :key="item._id"
        @click="goDetail(item._id)"
      >
        <div class="category">
          <span
            :style="{'background-color': category.colorOfCategory(item.category)}"
            :class="{'has_sub': item.sub_category}"
          >{{item.category}}</span>
          <span
            v-if="item.sub_category"
            :style="{'background-color': category.colorOfSubCategory(item.category, item.sub_category)}"
            class="sub_category"
          >{{item.sub_category}}</span>
        </div>
        <div class="title">{{item.title}}</div>
        <div class="sub">
          <span class="author_name">{{item.author_name}}</span>
          <span class="right">
            <span class="view_count">
              <i class="fa fa-eye" aria-hidden="true" />
              {{item.view_count}}
            </span>
            <span class="vote_count">
              <i class="fa fa-heart-o" aria-hidden="true" />
              {{item.vote_count}}
            </span>
            <span class="comment_count">
              <i class="fa fa-comment-o" aria-hidden="true" />
              {{item.comment_count}}
            </span>
            <span class="reg_date">
              <i class="fa fa-clock-o" aria-hidden="true" />
              {{item.reg_date | moment('from', 'now')}}
            </span>
          </span>
        </div>
      </div>
      <i v-show="loading" class="el-icon-loading"></i>
    </div>

    <side-bar
      ref="sidebar"
      @changeCategory="changeCategory"
    />
    <floating-btn
      @click="goPost"
    />
  </div>
</template>

<script>
import SideBar from '@/components/community/SideBar.vue'
import category from '@/models/community/category'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CommuniyList',

  components: {
    SideBar
  },

  computed: {
    ...mapGetters(['hasAuth'])
  },

  data () {
    return {
      category,
      isStickTop: false,
      query: {
        page: this.$route.query.page || 1,
        category: this.$route.query.category || '',
        sub_category: this.$route.query.sub_category || ''
      },
      maxPage: 0,
      loading: true,
      topList: [],
      list: []
    }
  },

  beforeRouteUpdate (to) {
    this.clear()
    this.query.category = to.query.category || ''
    this.query.sub_category = to.query.sub_category || ''
    this.scrollToList()
    this.fetchList()
  },

  methods: {
    ...mapMutations(['toggleLoginModal']),

    fetchTopList () {
      this.axios
        .get('/community/list/top', {
          params: {
            category: this.query.category || '공지사항'
          }
        })
        .then(res => {
          this.topList = res.data.list
        })
    },

    fetchList () {
      this.loading = true
      this.axios
        .get('/community/list', {
          params: this.query
        })
        .then(res => {
          this.loading = false
          this.list.push(...res.data.list)
          this.maxPage = res.data.maxPage
        })
        .catch(() => {
          this.loading = false
        })
    },

    fetchListMore () {
      if (this.loading) return
      if (this.maxPage <= this.query.page) return
      this.query.page++
      this.fetchList()
    },

    changeCategory (category, subCategory) {
      if (!subCategory) {
        history.pushState({category}, '', `/community?category=${category}`)
      } else {
        history.pushState({category}, '', `/community?category=${category}&sub_category=${subCategory}`)
      }
      this.$router.replace({path: '/community', query: {category, sub_category: subCategory}})
    },

    clear () {
      this.query.page = 1
      this.query.category = ''
      this.query.sub_category = ''
      this.list = []
    },

    goDetail (id) {
      this.$router.push({
        path: `/community/${id}`,
        query: this.query
      })
    },

    goPost () {
      if (!this.hasAuth('LOGIN')) return this.toggleLoginModal()
      if (category.postCategoryEnum().length === 0 && !this.hasAuth('USER')) { return this.$toasted.show('내정보에서 단국대 인증을 완료해주세요.') }
      this.$router.push('/community/post')
    },

    onScroll (e) {
      this.$refs.sidebar.close()
      const maxScroll = document.body.scrollHeight - screen.height
      const current = scrollY
      const remaining = maxScroll - current
      const paddingToMore = 300
      const topOffset = this.$refs.community_list_container.offsetTop
      this.isStickTop = current > topOffset - 40

      if (remaining <= paddingToMore) {
        this.fetchListMore()
      }
    },

    scrollToList () {
      this.$refs.community_list_container.scrollIntoView()
    }
  },

  watch: {
    'query.category': function (oldValue, newValue) {
      this.fetchTopList()
    }
  },

  mounted () {
    this.fetchTopList()
    this.fetchList()
    window.addEventListener('scroll', this.onScroll)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="scss" scoped>
.community_list_container {
  min-height: calc(100vh - 90px);

  .top {
    padding: 5px 10px;
    background-color: whitesmoke;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    &.stick {
      position: fixed;
      top: 40px;
    }

    .el-breadcrumb {
      display: inline-block;
      height: 30px;
      line-height: 30px;
    }
    .el-button {
      height: 30px;
      float: right;
    }
  }

  .list {
    &.stick {
      padding-top: 40px;
    }
    .item {
      padding: 10px 15px;
      border-bottom: 1px solid whitesmoke;
      &.active {
        background-color: #f0f8ff;
      }

      .category {
        height: 17px;
        font-size: 7pt;
        color: white;
        margin: 0;

        span {
          padding: 3px;
          // display: inline-block;
          float: left;
          border-radius: 2px;

          &:after,
          &:before {
            content: '';
            display: table;
          }

          &.has_sub {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          &.sub_category {
            margin-left: 0px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }

      .title {
        margin: 5px 0 0 0;
        font-size: 12pt;
      }
      .sub {
        color: gray;
        margin: 5px 0 0 0;
        font-size: 9pt;
        span {
          margin-right: 10px;
          &.right {
            float: right;
            margin: 0;

            .reg_date {
              margin: 0;
            }
          }
        }
      }
    }

    .el-icon-loading {
      font-size: 30px;
      display: block;
      text-align: center;
    }
  }
}
</style>
