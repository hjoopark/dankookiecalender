<template>
  <div class="slide_banner">
    <el-carousel height="85px" :interval="5000" arrow="always">
      <el-carousel-item
        class="banner-item"
        v-for="(banner, index) in banners" :key="index"
        :style="{'background-image' : 'url(' + banner.image + ')'}"
        @click.native="linkToBanner(banner.link)"
      />
    </el-carousel>
  </div>
</template>

<style lang="scss">
.slide_banner {
  max-height: calc(100vw / 5);

  .el-carousel__container {
    max-height: calc(100vw / 5);
  }
  .el-carousel__item {
    max-height: calc(100vw / 5);
  }
  .banner-item {
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>

<script>
export default {
  data () {
    return {
      banners: [
        // {
        //   "name": "단쿠키 카카오톡 플친",
        //   "image": "https://s3.ap-northeast-2.amazonaws.com/dankookie/static/plusfriend.png",
        //   "link": "http://pf.kakao.com/_xdJIrd"
        // },
        // {
        //   "name": "죽대전",
        //   "image": "https://s3.ap-northeast-2.amazonaws.com/dankookie/static/jukdaejeon.png",
        //   "link": "https://www.facebook.com/jukjeon.send/"
        // },
      ]
    }
  },
  mounted () {
    this.axios
      .get(
        'https://2tq1npwsll.execute-api.ap-northeast-2.amazonaws.com/prod/banner',
        {
          withCredentials: false
        }
      )
      .then(response => {
        for (var banner of response.data) {
          this.banners.push(banner)
        }
      })
  },
  methods: {
    linkToBanner (link) {
      window.open(link, '_blank')
    }
  }
}
</script>
