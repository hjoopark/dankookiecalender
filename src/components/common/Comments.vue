<template>
  <div class="comments_container">
    <div
      class="comment_post box"
      ref="postForm"
      v-if="allowPost"
    >
      <textarea
        placeholder="댓글 내용을 입력하세요"
        v-model="postForm.content"
        :style="{'height': commentInputHeight() }"
        @keyup.ctrl.enter="post"
        @focus="scrollToPostForm"
        ref="postInput"
      />
      <div class="toolbar">
        <i
          class="fa fa-fw fa-user-secret"
          :class="{'active': postForm.anonymous}"
          @click="setAnonymous(!postForm.anonymous)"
          v-if="allowAnonymous"
          aria-hidden="true"
          ></i>
        <!-- <i class="fa fa-fw fa-file-image-o" aria-hidden="true" v-tooltip="'댓글에 사진을 추가합니다'"></i> -->
        <el-button
          type="text"
          class="post"
          :loading="postForm.loading"
          @click="post"
        >전송</el-button>
      </div>
    </div>
    <div class="no_comments" v-if="count === 0">
      <i class="fa fa-comments" aria-hidden="true"></i>
      <p>아직 작성된 댓글이 없습니다.</p>
    </div>
    <div class="comments mini">
      <div
        class="comment"
        v-for="c in comments"
        :key="c._id"
        :id="c._id"
        :ref="c._id"
        :class="{'highlight': c._id === activeId}"
        v-if="(c.status != 'BLOCKED' && c.status != 'DELETED') || ((c.status == 'BLOCKED' || c.status == 'DELETED') && c.replyLength!=0)"
      >
        <a class="avatar">
          <img :src="c.author && c.author.profile || 'https://s3.ap-northeast-2.amazonaws.com/dankookie/profiles/default.jpg'">
        </a>
        <div class="content">
          <a class="author" :class="{'official':c.author && c.author.official}">{{c.author_name}}</a>
          <div class="metadata">
            <span class="date">{{c.reg_date | moment("from", "now")}}</span>
            <auth-btn require="USER" class="vote" @click="vote(c)">
              <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
              {{c.vote_count}}
            </auth-btn>
            <auth-btn require="USER" class="blame" @click="blame(c)">
              <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
              {{c.blame_count}}
            </auth-btn>
            <span class="label author" v-if="c.isDocAuthor">글쓴이</span>
            <span class="label best" v-if="c.vote_count-c.blame_count > 5">베스트</span>
          </div>
          <pre class="text deleted" v-if="c.status === 'DELETED'">
            <i class="fa fa-info-circle" aria-hidden="true"></i> 작성자에 의해 삭제된 댓글입니다.
          </pre>
          <pre class="text blocked" v-else-if="c.status === 'BLOCKED'">
            <i class="fa fa-info-circle" aria-hidden="true"></i> 관리자에 의해 삭제된 댓글입니다.
          </pre>
          <textarea
            v-else-if="c._id === activeEdit"
            v-model="editForm.content"
            class="edit"
            ref="editInput"
            :style="{height: editInputHeight()}"
            @keyup.esc="cancelEdit"
            @keyup.ctrl.enter="postEdit(c)"
          />
          <pre class="text" v-else>
            {{c.content}}
          </pre>
          <div class="actions" v-if="c.status != 'DELETED' && c.status != 'BLOCKED'" v-auth:login>
            <template v-if="activeEdit != c._id">
              <span class="reply" @click="viewReplyForm(c._id)" v-if="allowPost && activeReply != c._id">
                <i class="fa fa-reply" aria-hidden="true"></i>
                답글
              </span>
              <span class="reply" @click="viewReplyForm('')" v-if="activeReply === c._id">
                <i class="fa fa-undo" aria-hidden="true"></i>
                답글접기
              </span>
              <auth-btn require="USER" class="report" v-if="!c.isMine" @click="report(c)">
                <i class="fa fa-frown-o" aria-hidden="true"></i>
                신고
              </auth-btn>
              <span class="edit" v-if="c.isMine" @click="edit(c)">
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                수정
              </span>
              <span class="remove" v-if="c.isMine || hasAuth('ADMIN')" @click="remove(c)">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
                삭제
              </span>
            </template>
            <template v-else>
              <span class="edit cancel" @click="cancelEdit()">
                취소
              </span>
              <span class="edit post" @click="postEdit(c)">
                수정 완료
              </span>
            </template>
          </div>
        </div>
        <div class="reply_post box" v-if="activeReply === c._id">
          <textarea
            placeholder="답글 내용을 입력하세요"
            v-model="replyForm.content"
            :style="{'height': replyInputHeight() }"
            @keyup.ctrl.enter="postReply(c)"
            ref="replyInput"
            autofocus
          />
          <div class="toolbar">
            <i
              class="fa fa-fw fa-user-secret"
              :class="{'active': replyForm.anonymous}"
              @click="setAnonymous(!replyForm.anonymous)"
              v-if="allowAnonymous"
              aria-hidden="true"
            />
            <!-- <i class="fa fa-fw fa-file-image-o" aria-hidden="true" v-tooltip="'답글에 사진을 추가합니다'"></i> -->
            <el-button
              type="text"
              class="post"
              :loading="replyForm.loading"
              @click="postReply(c)"
            >전송</el-button>
          </div>
        </div>
        <div class="comments mini" v-if="c.reply.some(r => r.status != 'BLOCKED' && r.status != 'DELETED')">
          <div
            class="comment"
            v-for="r in c.reply"
            :key="r._id"
            :id="r._id"
            :ref="r._id"
            :class="{'highlight': r._id === activeId}"
            v-if="r.status != 'BLOCKED' && r.status != 'DELETED'"
          >
            <a class="avatar">
              <img :src="r.author && r.author.profile || 'https://s3.ap-northeast-2.amazonaws.com/dankookie/profiles/default.jpg'">
            </a>
            <div class="content">
              <a class="author" :class="{'official':r.author && r.author.official}">{{r.author_name}}</a>
              <div class="metadata">
                <span class="date">{{r.reg_date | moment("from", "now")}}</span>
                <auth-btn require="USER" class="vote" @click="voteReply(c, r)">
                  <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                  {{r.vote_count}}
                </auth-btn>
                <auth-btn require="USER" class="blame" @click="blameReply(c, r)">
                  <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                  {{r.blame_count}}
                </auth-btn>
                <span class="label author" v-if="r.isDocAuthor">글쓴이</span>
              </div>
              <pre class="text deleted" v-if="r.status === 'DELETED'">
                <i class="fa fa-info-circle" aria-hidden="true"></i> 작성자에 의해 삭제된 댓글입니다.
              </pre>
              <pre class="text blocked" v-else-if="r.status === 'BLOCKED'">
                <i class="fa fa-info-circle" aria-hidden="true"></i> 관리자에 의해 삭제된 댓글입니다.
              </pre>
              <textarea class="edit" ref="editInput" v-else-if="r._id === activeEdit" v-model="editForm.content" :rows="editForm.content.split('\n').length + 2" @keyup.esc="cancelEdit" @keyup.ctrl.enter="postEditReply(c,r)"></textarea>
              <pre class="text" v-else-if="r.tag">
                <span class="tag">@{{r.tag}}</span>
                {{r.content}}
              </pre>
              <pre class="text" v-else>
                {{r.content}}
              </pre>
              <div class="actions" v-if="r.status != 'DELETED' && r.status != 'BLOCKED'" v-auth:login>
                <template v-if="activeEdit != r._id">
                  <span class="reply" @click="viewReplyForm(r._id)" v-if="allowPost && activeReply != r._id">
                    <i class="fa fa-reply" aria-hidden="true"></i>
                    답글
                  </span>
                  <span class="reply" @click="viewReplyForm('')" v-if="activeReply === r._id">
                    <i class="fa fa-undo" aria-hidden="true"></i>
                    답글접기
                  </span>
                  <auth-btn require="USER" class="report" v-if="!r.isMine" @click="reportReply(c,r)">
                    <i class="fa fa-frown-o" aria-hidden="true"></i>
                    신고
                  </auth-btn>
                  <span class="edit" v-if="r.isMine" @click="edit(r)">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    수정
                  </span>
                  <span class="remove" v-if="r.isMine" @click="removeReply(c,r)">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                    삭제
                  </span>
                </template>
                <template v-else>
                  <span class="edit cancel" @click="cancelEdit()">
                    취소
                  </span>
                  <span class="edit post" @click="postEditReply(c,r)">
                    수정 완료
                  </span>
                </template>
              </div>
            </div>

            <div class="reply_post box" v-if="activeReply === r._id">
              <textarea
                placeholder="댓글 내용을 입력하세요"
                v-model="replyForm.content"
                :style="{'height': replyInputHeight() }"
                @keyup.ctrl.enter="postReply(c,r)"
                ref="replyInput"
                autofocus
              />
              <div class="toolbar">
                <i
                  class="fa fa-fw fa-user-secret"
                  :class="{'active': replyForm.anonymous}"
                  @click="setAnonymous(!replyForm.anonymous)"
                  v-if="allowAnonymous"
                  aria-hidden="true"
                />
                <!-- <i class="fa fa-fw fa-file-image-o" aria-hidden="true"></i> -->
                <el-button
                  type="text"
                  class="post"
                  :loading="replyForm.loading"
                  @click="postReply(c,r)"
                >전송</el-button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    url: {
      type: String,
      required: true
    },
    allowAnonymous: {
      type: Boolean,
      default: false
    },
    allowPost: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollTarget: this.$route.hash ? this.$route.hash.substr(1) : '',
      activeId: this.$route.hash ? this.$route.hash.substr(1) : '',
      me: {},
      postForm: {
        content: '',
        anonymous: false,
        loading: false
      },
      replyForm: {
        content: '',
        anonymous: false,
        loading: false
      },
      editForm: {
        content: ''
      },
      comments: [],
      activeEdit: '',
      activeReply: ''
    }
  },
  mounted () {
    this.init()
  },

  computed: {
    ...mapGetters(['user', 'hasAuth']),

    count () {
      var c = 0
      this.comments.forEach(comment => {
        if (comment.status !== 'BLOCKED' && comment.status !== 'DELETED') c++
        comment.reply.forEach(reply => {
          if (reply.status !== 'BLOCKED' && reply.status !== 'DELETED') c++
        })
      })
      return c
    }
  },

  watch: {
    count (value) {
      this.$emit('changeCount', value)
    },

    url (value) {
      this.getAnonymous()
      this.fetch()
    },

    allowAnonymous (value) {
      this.getAnonymous()
    },

    '$route.hash': function (value) {
      this.activeId = value ? value.substr(1) : ''
      this.scrollToId(this.activeId)
    }
  },

  methods: {
    init () {
      this.fetch()
      this.getAnonymous()
    },

    fetch () {
      this.axios.get(this.url).then(response => {
        this.comments = response.data
        this.comments.forEach(c => {
          c.isEditing = false
          c.replyLength = 0
          c.reply.forEach(r => {
            r.isEditing = false
            if (r.status !== 'DELETED' && r.status !== 'BLOCKED') c.replyLength++
          })
        })

        this.scrollToId(this.scrollTarget)
      })
    },

    getAnonymous () {
      var anon = false
      if (!this.allowAnonymous) anon = false
      else anon = this.$cookie.get('commentAnonymous') === 'true' || false
      this.postForm.anonymous = anon
      this.replyForm.anonymous = anon
    },

    scrollToId (target) {
      if (!target) return
      this.$nextTick(() => {
        this.$refs[target][0].scrollIntoView()

        window.scrollTo(0, window.scrollY - 200)
        this.scrollTarget = ''
      })
    },

    scrollToPostForm () {
      if (!this.$refs.postForm) return
      var offset = this.$refs.postForm.offsetTop
      window.scrollTo(0, offset)
    },

    post () {
      if (this.postForm.loading) return
      if (!this.postForm.content) { return this.$toasted.show('댓글 내용을 입력해주세요') }
      this.postForm.loading = true
      this.axios
        .post(this.url, this.postForm)
        .then(response => {
          this.postForm.content = ''
          this.postForm.loading = false
          this.viewReplyForm('')
          this.scrollTarget = response.data._id
          this.activeId = response.data._id
          this.$toasted.show('댓글 작성을 완료했습니다')
          this.fetch()
        })
        .catch(() => {
          this.postForm.content = ''
          this.postForm.loading = false
        })
    },

    vote (c) {
      if (c.isMine) { return this.$toasted.show('본인 댓글은 추천할 수 없습니다.') }
      if (c.status !== 'PUBLIC') return

      this.axios.post(`${this.url}/${c._id}/vote`).then(response => {
        this.fetch()
        if (!response.data.success) {
          this.$toasted.show(response.data.message)
        }
      })
    },

    blame (c) {
      if (c.isMine) { return this.$toasted.show('본인 댓글은 비추천할 수 없습니다.') }
      if (c.status !== 'PUBLIC') return

      this.axios.post(`${this.url}/${c._id}/blame`).then(response => {
        this.fetch()
        if (!response.data.success) {
          this.$toasted.show(response.data.message)
        }
      })
    },

    edit (c) {
      this.activeEdit = c._id
      this.editForm.content = c.content
      this.cancelReplyForm()
      this.$nextTick(() => {
        if (this.$refs.editInput) {
          this.$refs.editInput[0].focus()
          this.$refs.editInput[0].style.height = this.editInputHeight()
        }
      })
    },

    cancelEdit () {
      this.activeEdit = ''
    },

    postEdit (c) {
      if (!confirm('댓글 수정을 완료합니다.')) return

      this.axios.put(`${this.url}/${c._id}`, this.editForm).then(response => {
        this.cancelEdit()
        this.fetch()
        this.$toasted.show('수정되었습니다.')
      })
    },

    postEditReply (c, r) {
      if (!confirm('댓글 수정을 완료합니다.')) return

      this.axios
        .put(`${this.url}/${c._id}/reply/${r._id}`, this.editForm)
        .then(response => {
          this.cancelEdit()
          this.fetch()
          this.$toasted.show('수정되었습니다.')
        })
    },

    remove (c) {
      if (!confirm('이 댓글을 삭제하시겠습니까?')) return

      this.axios.delete(`${this.url}/${c._id}`).then(response => {
        this.fetch()
        this.$toasted.show('삭제되었습니다.')
      })
    },

    report (c) {
      if (!confirm('이 댓글을 신고하시겠습니까??')) return

      this.axios
        .post(`${this.url}/${c._id}/report`)
        .then(response => {
          this.$toasted.show('운영팀에서 확인하는대로 조치하겠습니다.')
        })
        .catch(() => {
          this.$toasted.show('에러가 발생했습니다')
        })
    },

    viewReplyForm (id) {
      this.activeReply = id
      this.$nextTick(() => {
        if (this.$refs.replyInput && this.$refs.replyInput.length) { this.$refs.replyInput[0].focus() }
      })
    },

    cancelReplyForm () {
      this.activeReply = ''
    },

    postReply (comment, reply) {
      if (this.replyForm.loading) return
      if (!this.replyForm.content) return
      this.replyForm.loading = true

      var body
      if (reply) {
        body = { ...this.replyForm, replyFor: reply._id }
      } else {
        body = { ...this.replyForm }
      }

      this.axios
        .post(`${this.url}/${comment._id}/reply`, body)
        .then(response => {
          this.replyForm.content = ''
          this.replyForm.loading = false
          this.viewReplyForm('')
          this.$toasted.show('답글 작성을 완료했습니다.')
          this.scrollTarget = response.data._id
          this.activeId = response.data._id
          this.fetch()
        })
        .catch(() => {
          this.replyForm.content = ''
          this.replyForm.loading = false
        })
    },

    voteReply (comment, reply) {
      if (reply.isMine) { return this.$toasted.show('본인 댓글은 추천할 수 없습니다.') }
      if (reply.status !== 'PUBLIC') return

      this.axios
        .post(`${this.url}/${comment._id}/reply/${reply._id}/vote`)
        .then(response => {
          this.fetch()
          if (!response.data.success) {
            this.$toasted.show(response.data.message)
          }
        })
    },

    blameReply (comment, reply) {
      if (reply.isMine) { return this.$toasted.show('본인 댓글은 비추천할 수 없습니다.') }
      if (reply.status !== 'PUBLIC') return

      this.axios
        .post(`${this.url}/${comment._id}/reply/${reply._id}/blame`)
        .then(response => {
          this.fetch()
          if (!response.data.success) {
            this.$toasted.show(response.data.message)
          }
        })
    },

    removeReply (comment, reply) {
      if (!confirm('이 댓글을 삭제하시겠습니까?')) return

      this.axios
        .delete(`${this.url}/${comment._id}/reply/${reply._id}`)
        .then(respone => {
          this.fetch()
          this.$toasted.show('삭제되었습니다.')
        })
    },

    reportReply (c, r) {
      if (!confirm('이 댓글을 신고하시겠습니까?')) return

      this.axios
        .post(`${this.url}/${c._id}/reply/${r._id}/report`)
        .then(response => {
          this.$toasted.show('운영팀에서 확인하는대로 조치하겠습니다.')
        })
        .catch(() => {
          this.$toasted.show('에러가 발생했습니다')
        })
    },

    focusPostInput () {
      this.$refs.postInput.focus()
    },

    commentInputHeight () {
      var input = this.$refs.postInput
      var height = (input && input.scrollHeight) || 0
      return Math.max(50, height) + 'px'
    },

    replyInputHeight () {
      var input = this.$refs.replyInput
      if (!input || input.length === 0) return '50px'
      var height = input[0].scrollHeight
      return `${height}px`
    },

    editInputHeight () {
      var input = this.$refs.editInput && this.$refs.editInput[0]
      var height = (input && input.scrollHeight) || 0
      return Math.max(50, height) + 'px'
    },

    setAnonymous (isAnonymous) {
      this.postForm.anonymous = isAnonymous
      this.replyForm.anonymous = isAnonymous
      this.$cookie.set('commentAnonymous', isAnonymous)

      var nick = isAnonymous
        ? this.user.me.animal_nick
        : this.user.me.nick_name
      this.$toasted.show(`나는 ${nick}이다`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/comments.scss";

.comments_container {
  .reply_post {
    margin-top: 10px;
    z-index: 10000;
  }

  .comment_post,
  .reply_post {
    padding: 10px 10px 5px 10px;
    background-color: #f3f3f3;

    textarea {
      border: 0;
      border-radius: 0;
      width: 100%;
      resize: none;
      box-sizing: border-box;
      outline: none;
      overflow: hidden;
    }
    .post {
      float: right;
      padding: 0 15px;
      height: 25px;
      color: orange;
      font-weight: bold;
    }
    .toolbar {
      padding-left: 10px;
      line-height: 25px;
      height: 25px;

      i {
        font-size: 1.3em;
        width: 25px;
        color: #bbbbbb;
        cursor: pointer;

        &:hover {
          color: gray;
        }
        &.active {
          color: orange;
          // color: #e2c101;
        }
      }

      .dk-btn {
        height: 35px;
        width: 80px;
        float: right;
      }
    }
  }

  .no_comments {
    margin: 20px 0;
    text-align: center;

    i {
      font-size: 5em;
      color: #cecece;
    }
  }

  .el-collapse-item__content {
    padding: 0 !important;
  }
}
</style>
