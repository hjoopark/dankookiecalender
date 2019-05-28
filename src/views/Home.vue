<template>
  <div class="home">
    <TopBanner />
    <Community />
    <News />
    <Jongkang></Jongkang>
    <floating-btn
      @click="goCommunityPost"
    />
  </div>
</template>

<script>
import TopBanner from '@/components/home/TopBanner.vue'
import Community from '@/components/home/Community.vue'
import Jongkang from '@/components/home/Jongkang.vue'
import category from '@/models/community/category'
import News from '@/components/home/News.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'home',

  components: {
    TopBanner,
    Community,
    News,
    Jongkang
  },

  computed: {
    ...mapGetters(['hasAuth'])
  },

  methods: {
    ...mapMutations(['toggleLoginModal']),

    goCommunityPost () {
      if (!this.hasAuth('LOGIN')) return this.toggleLoginModal()
      if (category.postCategoryEnum().length === 0 && !this.hasAuth('USER')) { return this.$toasted.show('내정보에서 단국대 인증을 완료해주세요.') }
      this.$router.push('/community/post')
    }
  }
}
</script>
