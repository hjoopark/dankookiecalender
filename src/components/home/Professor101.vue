
<template>
  <div id="m_professor101">
    <!-- <div class="top_divider"></div> -->
    <div class="main_title">
      <div class="logo_wrapper">
        <!-- <img class="logo" src="../../images/professor101/main_logo.jpg" /> -->

        <p class="title">
          PROFESSOR 101
        </p>
        <img class="sub_title" src="../../images/professor101/professor101_title.png" />
      </div>
    </div>
    <section class="listRank">
      <div class="rankWrap">
        <ol class="list highrank" style="margin: 0px;">
          <li class="winner" :key="index" v-for="(result, index) in results">
            <a :href="result.intro_url" target="_blank">
              <strong></strong>
              <i class="rank" style="line-height: 32px;">{{index + 1}}</i>
              <div class="pf" :style="{'background-image': 'url(' + result.profile + ')', 'background-position': 'center', 'background-size': 'contain', 'background-repeat': 'no-repeat', 'width': '113px', 'height': '113px'}"></div>
            </a>
            <em class="name">
              <a :href="result.intro_url" target="_blank">{{result.name}}</a>
            </em>
            <span>{{result.belong}}</span>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
@import "../../style/professor101.scss";
#m_professor101 {
  .top_divider {
    padding: 5px;
  }
  background: #fcfcfc;
  .main_title {
    .logo_wrapper {
      text-align: center;
      .logo {
        padding: 5px;
        display: inline;
        width: 20%;
      }
      .title {
        margin: 0px;
        padding-top: 5px;
        font-weight: 600;
      }
      .sub_title {
        width: 60%;
        padding: 10px;
      }
    }
  }
  .list li:nth-child(3n) {
    float: left;
  }
}
</style>

<script>
export default {
  data () {
    return {
      results: []
    }
  },
  created () {
    this.axios
      .get('/professor101/rank', { params: { sortBy: this.sortBy } })
      .then(res => {
        this.results = res.data.results
        this.comments = res.data.comments
        this.commentsLength = res.data.commentsLength
      })
      .catch(err => {
        console.log('err : ', err)
      })
  }
}
</script>
