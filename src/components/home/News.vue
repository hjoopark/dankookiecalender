<template>
  <div class="news_wrapper">
    <div class="news_list_wrapper">
      <div class="news_header">
        <div class="is_active"></div>
        <img src="https://png.icons8.com/office/15/ffffff/news.png" style="margin-bottom: -1px;">
        인기 뉴스
      </div>

        <div class="news_list_container">
          <div
            @click="redirectToDetail(item.idxno)"
            class="news_list"
            v-for="(item, i) in lists"
            :key="i"
          >
            <div class="text_wrapper">
              <div class="image_wrapper" :style="{ backgroundImage: 'url(' + item.thumbnail_image + ')' }" ></div>
              <div class="content_wrapper">
                <p class="title">
                  {{item.title}}
                </p>
                <p class="list_info">
                  <small class="author_name">{{item.author_name}}</small>
                  <span class="reg_date"> | {{item.reg_date | moment("from", "now")}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

    </div>
  </div>
</template>

<style lang="scss">
.news_list_wrapper {
  .news_header {
    padding: 10px;
    border-bottom: 1px solid #e2e2e2;
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    position: relative;
    .is_active {
      position: absolute;
      bottom: 0px;
      height: 3px;
      width: 130px;
      background-color: #e2c100 !important;
      left: 50%;
      -webkit-transform: translate(-50%);
      transform: translate(-50%);
    }
  }

  .news_list_container {
    .news_list {
      padding: 13px;
      border-bottom: 1px solid #e2e2e2;

      .text_wrapper {
        display: table-cell;
        vertical-align: middle;
        float: none;

        .image_wrapper {
          display: table-cell;
          vertical-align: middle;
          float: none;
          width: 70px !important;
          height: 70px !important;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
        }

        .content_wrapper {
          border-left: 10px transparent solid;
          display: table-cell;

          p {
            font-size: 14px;
            margin: 0px 0px 5px 0px;
          }

          .title {
            padding: 2px 0px;
            max-height: 45px !important;
            color: black;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .list_info {
            max-height: 17px !important;
            overflow: hidden;
            text-overflow: ellipsis;

            .author_name {
              float: none;
            }
            .reg_date {
              font-size: 12px;
              color: silver;
            }
          }
        }
      }
    }
  }
}
</style>

<script>
export default {
  data () {
    return {
      lists: []
    }
  },
  mounted () {
    this.getDkNewsList(5)
  },
  methods: {
    getDkNewsList (limit) {
      var params = {
        category: 'ALL',
        limit: limit
      }
      this.axios.get('/news/rank', { params }).then(response => {
        if (response.data.list.length < 0) {
          this.axios
            .get('/news/mobile/list', { params: { limit: 10 } })
            .then(response => {
              this.lists = response.data.list
            })
          return
        }
        this.lists = response.data.list
      })
      // .catch(err => {
      //   console.log('err : ', err)
      // });
    },
    redirectToDetail (no) {
      this.$router.push('/news/' + no)
    }
  }
}
</script>
