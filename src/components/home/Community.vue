<template>
  <div>
    <el-tabs v-model="currentTab" :stretch="true">
      <el-tab-pane v-for="(tab, index) in tabs" :key="index" :name="tab.name">
        <span slot="label">
          <img :src="tab.img" style="margin-bottom: -1px;">
          {{tab.name}}
        </span>
        <div class="community_list">
          <div
            v-for="item in list[index]"
            class="item"
            :class="{'active': $route.params.id == item._id}"
            :key="item._id"
            @click="goDetail(item._id)"
          >
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
          <!-- <div @click="redirectToDetail(item._id)" class="banner_list" v-for="(item, i) in lists[index]" :key="i">
            <p class="title">
              {{item.title}}
              <span class="comment_count">[{{item.comment_count}}]</span>
            </p>
            <p class="list_info">
              <span class="reg_date">{{item.reg_date | moment("from", "now")}}</span>
              <span class="view_count"> | {{item.view_count}}</span>
              <span class="view_count"> | {{item.category}}</span>
              <small class="author_name">{{item.author_name}}</small>
            </p>
          </div> -->
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentTab: '최신글',
      tabs: [
        {
          name: '최신글',
          img: 'https://png.icons8.com/office/15/ffffff/new.png',
          class: 'latest'
        },
        {
          name: '인기글',
          img: 'https://png.icons8.com/office/15/ffffff/fairytale.png',
          class: 'best'
        },
        {
          name: '공지사항',
          img: 'https://png.icons8.com/office/15/ffffff/megaphone.png',
          class: 'notice'
        }
      ],
      list: []
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      this.axios.get('/community/mobile/latest').then(response => {
        this.list = response.data
      })
    },
    goDetail (_id) {
      this.$router.push('/community/' + _id)
    }
  }
}
</script>

<style lang="scss">
.el-tabs__header {
  margin-bottom: 0px !important;
  text-align: center;

  .el-tabs__nav-scroll {
    padding: 0px 10px;
  }
  .el-tabs__nav-prev,
  .el-tabs__nav-next {
    padding: 0px 10px;
    height: 100%;
    z-index: 10;
    color: black;
  }
  .el-tabs__item {
    padding: 0px 15px;
  }
}

.community_list {
  padding: 0px;

  .item {
    padding: 10px 15px;
    border-bottom: 1px solid whitesmoke;
    &.active {
      background-color: #f0f8ff;
    }

    .category {
      font-size: 7pt;
      color: white;
      margin: 0;

      span {
        padding: 3px;
        display: inline-block;
        border-radius: 2px;

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
      margin: 0;
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

    // padding: 10px 8px;
    // border-bottom: 1px solid #e2e2e2;

    // p {
    //   font-size: 14px;
    //   text-decoration: none;
    //   margin: 0px !important;
    // }
    // .title {
    //   margin-left: 5px !important;
    //   color: #0d0661;
    // }
    // .comment_count {
    //   color: skyblue;
    //   margin-left: 2px;
    // }
    // .list_info {
    //   margin-top: 8px !important;
    //   font-size: 11px;
    //   color: silver;
    //   .author_name {
    //     float: right;
    //     color: black;
    //     font-weight: 600;
    //   }
    // }
  }
}
.el-tabs__item.is-active {
  color: black !important;
}
.el-tabs__active-bar {
  background-color: #e2c100 !important;
  height: 4px !important;
}
</style>
