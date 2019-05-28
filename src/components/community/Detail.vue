<template>
  <div>
    <floating-btn
      icon="bars"
      :right="1"
      @click="goListActiveItem"
      v-show="!errCode"
    />
    <floating-btn
      icon="commenting-o"
      :bottom="1"
      @click="goComment"
      v-show="!errCode"
    />
    <div class="community_detail_container" ref="detail_container">
      <template v-if="detail.title">

        <div class="header">
          <div class="main">
            <p class="category">#{{detail.category}} {{detail.sub_category ? `#${detail.sub_category}` : ''}}</p>
            <p class="detail_title">{{detail.title}}</p>
          </div>

          <div class="author">
            <img
              class="profile"
              :src="detail.author && detail.author.profile || 'https://s3.ap-northeast-2.amazonaws.com/dankookie/profiles/default.jpg'"
              alt="프로필"
            />
            <span class="name" :class="{'official': detail.author && detail.author.official }">
              {{detail.author_name}}
            </span>
            <span
              class="mail action"
              v-if="user.isLoggedIn && !detail.anonymous && !detail.is_mine && detail.author"
              @click="onClickMessage(detail.author)"
            >
              <i class="fa fa-envelope-o" aria-hidden="true"></i>
              쪽지
            </span>

            <div class="edit action right" v-if="detail.is_mine || hasAuth('ADMIN')">
              <el-button type="mini" @click="edit" >
                수정
              </el-button>
              <el-button type="mini" @click="remove" >
                삭제
              </el-button>
            </div>
          </div>
          <div class="sub">
            <div class="left">
              <img src="https://png.icons8.com/office/16/8D8D8D/visible.png">
              <span>
                {{detail.view_count}}
              </span>
              <img src="https://png.icons8.com/color/16/8D8D8D/hearts.png">
              <span>
                {{detail.vote_count}}
              </span>
              <img src="https://png.icons8.com/ultraviolet/16/8D8D8D/speech-bubble.png">
              <span>
                {{detail.comment_count}}
              </span>
            </div>
            <div class="right">
              <img src="https://png.icons8.com/color/16/8D8D8D/calendar.png">
              <span>
                {{ detail.reg_date | moment("YYYY/MM/DD A HH:mm") }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="content_html"
          v-html="detail.content"
        />

        <ul class="files" v-if="detail.file && detail.file.length">
          <li v-for="(f, index) in detail.file" :key="index" class="file">
            <i class="fa fa-floppy-o" aria-hidden="true"></i>
            <a target="blank" :href="f.url">{{f.name}}</a>
          </li>
        </ul>

        <div class="footer" v-auth:user>
          <el-button
            class="report"
            type="warning"
            size="mini"
            @click="report"
            v-auth:user
            plain
          >
            <img src="https://png.icons8.com/office/30/8D8D8D/error.png">
            신고
          </el-button>

          <!-- <el-button
            class="share"
            type="primary"
            size="mini"
            plain
          >
            <img src="https://png.icons8.com/color/30/8D8D8D/share.png">
            공유
          </el-button> -->

          <el-button
            class='like'
            type="danger"
            size="mini"
            @click="vote"
            plain
            v-auth:user
            :class="{'active': detail.voted}"
          >
            <img src="https://png.icons8.com/material-outlined/48/cccccc/hearts.png">
            좋아요
          </el-button>
        </div>

        <el-collapse v-model="openingCollapse" accordion>
          <el-collapse-item :title="`댓글 (${detail.comment_count})`" name="comments">
            <comments
              :url="`/community/${this.id}/comments`"
              :allow-anonymous="category.isAbleAnonymous(detail.category)"
              :allow-post="hasAuth(category.authToCommentPost(detail.category))"
              ref="comments"
              @changeCount="changeCommentCount"
            />
          </el-collapse-item>
        </el-collapse>
      </template>

      <div
        v-if="errCode"
        class="no_detail"
      >
        <i class="fa fa-info-circle" aria-hidden="true"></i>
        <h3 v-if="errCode === 401">게시글을 볼 권한이 없습니다</h3>
        <h3 v-else>게시글을 찾을 수 없습니다</h3>

        <el-button
          v-if="errCode === 401 && !hasAuth('LOGIN')"
          @click="toggleLoginModal"
        >로그인</el-button>
        <el-button
          v-else
          @click="goBack"
        >돌아가기</el-button>
      </div>

    </div>

    <list />
  </div>
</template>

<script>
import Comments from '../common/Comments.vue'
import List from '@/components/community/List.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
// import User from "../../models/user.js"
// import CommunityList from './Community.vue';
// import GoogleAdsense from './GoogleAdsense.vue';

import category from '@/models/community/category.js'

export default {
  components: {
    comments: Comments,
    list: List
    // 'community-list': CommunityList,
    // 'google-adsense': GoogleAdsense
  },

  computed: {
    ...mapGetters(['hasAuth'])
  },

  data () {
    return {
      ...mapState(['user']),
      category,
      id: this.$route.params.id,
      detail: {},
      errCode: '',
      openingCollapse: ['comments']
    }
  },

  mounted () {
    this.init()
    this.eventBus.$on('didLogin', this.init)
  },

  methods: {
    ...mapMutations(['toggleLoginModal']),

    init () {
      this.axios
        .get(`/community/${this.id}`)
        .then(response => {
          this.detail = response.data
          this.errCode = ''
        })
        .catch(err => {
          this.errCode = err.response.status || 500
          this.detail = {}
        })
    },

    changeCommentCount (value) {
      this.detail.comment_count = value
    },

    vote () {
      if (this.detail.voted) return

      this.axios
        .post(`/community/${this.id}/vote`, { vote: true })
        .then(response => {
          if (response.data.success) {
            this.detail.voted = true
            this.detail.vote_count++
            this.$toasted.show('추천되었습니다.')
          }
        })
    },

    edit () {
      if (!confirm('이 게시글을 수정하시겠습니까?')) return

      this.$router.push(`/community/${this.id}/edit`)
    },

    remove () {
      if (!confirm('이 게시글을 삭제하시겠습니까?')) return

      this.axios
        .delete(`/community/${this.id}`)
        .then(response => {
          this.$toasted.show('삭제되었습니다.')
          this.$router.push({ path: '/community', query: this.$route.query })
        })
        .catch(() => {
          this.$toasted.show('오류가 발생했습니다')
        })
    },

    report () {
      if (!confirm('이 게시글을 신고하시겠습니까?')) return
      this.axios
        .post(`/community/${this.id}/report`)
        .then(response => {
          if (response.data.success) {
            this.$toasted.show('운영팀에서 확인하는대로 조치하겠습니다.')
          }
        })
        .catch(() => {
          this.$toasted.show('신고 처리에 문제가 발생했습니다.')
        })
    },

    goComment () {
      var offset = this.$refs.comments.$el.offsetTop
      window.scrollTo(0, offset)
      this.$refs.comments.focusPostInput()
    },

    goListActiveItem () {
      var activeScrollOffset = document.querySelector('.community_list_container .item.active').offsetTop
      window.scrollTo(0, activeScrollOffset - 80)
    },

    goTop () {
      window.scrollTo(0, 0)
    },

    goBack () {
      this.$router.go(-1)
    },

    goBottom () {
      var hieght = this.$refs.detail_container.offsetHeight
      var offset = this.$refs.detail_container.offsetTop + hieght
      window.scrollTo(0, offset)
    },

    onClickLogin () {
      this.eventBus.$emit('openLoginModal')
      this.eventBus.$on('didLogin', this.init)
    },

    onClickMessage (nickName) {
      this.eventBus.$emit('openMessageModal', nickName)
    }
  },

  watch: {
    '$route.params.id': function (id) {
      this.id = id
      this.init()
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.community_detail_container {
  margin: 0;
  position: relative;
  overflow: initial;

  .header {
    padding-bottom: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #dee3eb;
    .main {
      padding: 5px 10px 0px 10px;
      .category {
        margin: 0;
        font-size: 10pt;
        color: orange;
      }
      .detail_title {
        margin: 5px 0 0 0;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .sub {
      padding: 5px 10px;
      font-size: 11px;
      img {
        height: 15px;
        vertical-align: middle;
      }
      .left {
        display: inline;
      }
      .right {
        float: right;
      }
      span {
        margin-right: 5px;
      }
    }

    .author {
      padding: 5px 10px 0px;
      color: #5482d0;
      font-weight: 600;
      .profile {
        border-radius: 50%;
        height: 25px;
        vertical-align: middle;
      }
      .name {
        display: inline-block;
        font-size: 13px;
        margin-left: 5px;

        &.official {
          color: white;
          background-color: #5b9bff;
          padding: 0 3px;
          border-radius: 5px;
          height: 1.6em;
          line-height: 1.6em;
          margin-top: 2px;
        }
      }

      .action {
        display: inline-block;
        img {
          height: 20px;
          vertical-align: middle;
        }
        .el-button {
          padding: 4px 7px;

          & + .el-button {
            margin-left: 3px;
          }
        }
        margin-left: 5px;

        &.right {
          float: right;
        }
        &:hover {
          font-weight: bold;
        }
      }

      .mail {
        margin: 4px 10px;
        height: 18px;
        line-height: 18px;
        font-size: 0.7em;
        padding: 2px 5px;
        background-color: #cecece;
        color: white;
        border-radius: 5px;

        &:hover {
          background-color: orange;
        }

        // height: 15px;
      }
    }
  }

  .files {
    background-color: #f8f8f8;
    border: 1px solid gray;
    padding: 10px;
    margin: 15px;
    list-style-type: none;

    .file {
      color: black;
      margin-left: 10px;
      font-size: 9pt;

      a {
        padding-left: 5px;
        color: blue;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .footer {
    display: block;
    text-align: center;
    border-bottom: 1px solid #dee3eb;
    padding: 20px 0px;
    font-size: 13px;

    img {
      height: 17px;
      vertical-align: middle;
    }

    .el-button {
      display: inline !important;

      &.like {
        &:hover {
          color: #f56c6c !important;
          background: #fef0f0 !important;
          border-color: #fbc4c4 !important;
        }
        &.active {
          background: #f56c6c !important;
          border-color: #f56c6c !important;
          color: #fff !important;
        }
      }

      &.report {
        &:hover {
          color: #e6a23c !important;
          background: #fdf6ec !important;
          border-color: #f5dab1 !important;
        }
      }
    }
  }

  .comment_count {
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    font-weight: bold;
  }

  .no_detail {
    margin: 50px 0;

    i {
      font-size: 3em;
      display: block;
      text-align: center;
      color: #a9a9a9;
    }
    h3 {
      text-align: center;
      margin-top: 15px;
      color: #a9a9a9;
    }
    .el-button {
      text-align: center;
      display: block;
      margin: 0 auto;
    }
  }
  // .dk-btn {
  //   text-align: center;
  //   display: block;
  //   width: 130px;
  //   height: 40px;
  //   margin: auto;
  // }
}
</style>
