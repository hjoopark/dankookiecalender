<template>
  <div class="community_post_container">
    <div class="top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>커뮤니티</el-breadcrumb-item>
        <el-breadcrumb-item>글쓰기</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="select_category">
      <div class="anonymous">
        <h5 class="name">익명 작성</h5>
        <el-switch
          v-model="post.anonymous"
          :disabled="!ableAnonymous"
        />
        <p class="description" v-if="!ableAnonymous">익명 작성이 불가능한 게시판 카테고리 입니다.</p>
      </div>

      <div class="stick_top" v-auth:admin>
        <h5 class="name">상단 고정</h5>
        <el-switch v-model="post.top"/>
      </div>

      <h5 class="name">카테고리 선택</h5>
      <dk-radio
        :enum="category.postCategoryEnum()"
        v-model="post.category"
        @change="changeCategory"
      />

      <template v-if="post.category && category.postSubCategoryEnum(post.category).length">
        <h5 class="name">서브 카테고리 선택</h5>
        <dk-radio
          :enum="category.postSubCategoryEnum(post.category)"
          v-model="post.sub_category"
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
        @click="doPost"
      >{{ validateForm ? '게시글 작성하기' : '작성하지 않은 필수 항목이 있습니다.'}}
      </el-button>
    </div>
  </div>
</template>

<script>
import category from '@/models/community/category'
import postEditorToolbar from '@/models/community/postEditorToolbar'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'CommunityPost',

  components: {
    VueEditor
  },

  computed: {
    validateForm () {
      if (!this.post.category || !this.post.title || !this.post.content) { return false }
      return true
    },

    ableAnonymous () {
      if (!this.post.category) return true
      return this.category.isAbleAnonymous(this.post.category)
    }
  },

  data () {
    return {
      category,
      postEditorToolbar,
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
    changeCategory () {},

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

    doPost () {
      this.loading = true
      this.axios.post('/community', this.post).then(response => {
        if (response.data.success) {
          this.$router.push(`/community/${response.data._id}`)
          this.$toasted.show('글 작성을 완료했습니다.')
        }
      })
    }
  },

  watch: {
    'post.category': function (c) {
      this.post.sub_category = ''

      if (!this.category.isAbleAnonymous(c)) {
        this.post.anonymous = false
      }
    }
  },

  mounted () {}
}
</script>

<style lang="scss" scoped>
.community_post_container {
  .anonymous {
    .description {
      font-size: 8pt;
      margin: 5px 0 0 10px;
    }
  }

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
