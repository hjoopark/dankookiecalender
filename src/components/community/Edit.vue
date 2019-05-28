<template>
  <div class="community_edit_container">
    <div class="top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>커뮤니티</el-breadcrumb-item>
        <el-breadcrumb-item>게시글 수정</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="select_category">
      <!-- <div class="anonymous">
        <h5 class="name">익명 작성</h5>
        <el-switch v-model="post.anonymous"/>
      </div> -->

      <div class="stick_top" v-auth:admin>
        <h5 class="name">상단 고정</h5>
        <el-switch v-model="post.top"/>
      </div>

      <h5 class="name" v-auth:admin>카테고리 선택</h5>
      <dk-radio
        :enum="category.postCategoryEnum()"
        v-model="post.category"
        @change="changeCategory"
        ref="categoryRadio"
        v-auth:admin
      />

      <template v-if="post.category">
        <h5 class="name" v-auth:admin>서브 카테고리 선택</h5>
        <dk-radio
          :enum="category.postSubCategoryEnum(post.category)"
          v-model="post.sub_category"
          ref="subCategoryRadio"
          v-auth:admin
        />
      </template>

      <h5 class="name">게시글 제목</h5>
      <el-input
        placeholder="게시글 제목을 입력하세요."
        v-model="post.title"
        maxlength="60"
        clearable>
      </el-input>

      <h5 class="name">게시글 내용</h5>
      <vue-editor
        placeholder="단국인으로서 바르고 고운 말을 사용합시다!"
        v-model="post.content"
        :editorToolbar="postEditorToolbar"
        useCustomImageHandler
        @imageAdded="imageAdded"
      />

      <el-button
        class="post"
        size="midium"
        type="warning"
        :disabled="!validateForm"
        :loading="loading"
        @click="doEdit"
      >{{ validateForm ? '게시글 수정완료' : '작성하지 않은 필수 항목이 있습니다.'}}
      </el-button>
    </div>
  </div>
</template>

<script>
import category from '@/models/community/category'
import postEditorToolbar from '@/models/community/postEditorToolbar'
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex'

export default {
  name: 'CommunityEdit',

  components: {
    VueEditor
  },

  computed: {
    ...mapGetters(['hasAuth']),

    validateForm () {
      if (!this.post.category || !this.post.title || !this.post.content) { return false }
      return true
    }
  },

  data () {
    return {
      category,
      postEditorToolbar,
      id: this.$route.params.id,
      post: {
        category: '',
        sub_category: '',
        title: '',
        content: '',
        anonymous: false,
        top: false
      },
      loading: false
    }
  },

  methods: {
    init () {
      this.fetchDetail()
    },

    fetchDetail () {
      this.axios
        .get(`/community/${this.id}`)
        .then(response => {
          if (!response.data.is_mine && !this.hasAuth('ADMIN')) { return this.$router.push(`/community/${this.id}`) }

          this.post.anonymous = response.data.anonymous
          this.post.top = response.data.top || false
          this.post.title = response.data.title
          this.post.content = response.data.content

          this.$refs.categoryRadio.selectByValue(response.data.category)
          this.$nextTick().then(() => {
            this.$refs.subCategoryRadio.selectByValue(
              response.data.sub_category
            )
          })
        })
        .catch(() => {
          this.$router.go(-1)
        })
    },

    changeCategory () {
      this.post.sub_category = ''
    },

    imageAdded (file, Editor, cursorLocation, resetUploader) {
      this.$uploadFile('community', file)
        .then(data => {
          Editor.insertEmbed(cursorLocation, 'image', data.Location)
          resetUploader()
        })
        .catch(() => {
          alert('이미지 업로드에 문제가 발생했습니다.')
        })
    },

    doEdit () {
      this.loading = true
      this.axios.put(`/community/${this.id}`, this.post).then(response => {
        if (response.data.success) {
          this.$router.push(`/community/${this.id}`)
          this.$toasted.show('글 수정을 완료했습니다.')
        }
      })
    }
  },

  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.community_edit_container {
  .top {
    padding: 5px 10px;
    background-color: whitesmoke;
    height: 30px;

    .el-breadcrumb {
      display: inline-block;
      height: 30px;
      line-height: 30px;
    }
  }

  .select_category {
    padding: 0 10px 10px 10px;
    .name {
      margin: 20px 0 0 0;
    }
  }

  .el-switch {
    margin: 10px 0 0 10px;
  }

  .el-input {
    margin: 10px 0 0 10px;
    width: calc(100vw - 40px);
  }

  .quillWrapper {
    margin: 10px 10px 0 10px;
    border-radius: 4px;
  }

  .el-button {
    margin: 15px 0 0 10px;
    width: calc(100vw - 40px);
  }
}
</style>
