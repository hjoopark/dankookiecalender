<template>
  <div id="app">
    <el-container>
      <el-header id="header" height="40px">
        <div class="menu_left" v-if="user.isLoggedIn">
          <el-dropdown trigger="click" :hide-on-click="false" class="search_btn_wrap">
            <span class="el-dropdown-link">
              <img src="@/icon/search_icon.svg">
            </span>
            <el-dropdown-menu slot="dropdown" class="search_input_wrap" ref="searchBar">
              <el-dropdown-item style="background:white">
                <el-input placeholder="검색어를 입력해 주세요" v-model="searchInput" @keyup.enter="search">
                  <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="menu_center">
          <router-link to="/">
            <img class="logo" src="https://s3.ap-northeast-2.amazonaws.com/dankookie/static/m_logo.png" alt="logo">
          </router-link>
        </div>
        <div class="menu_right">
          <img class="login_btn" src="https://png.icons8.com/small/50/000000/enter-2.png" @click="toggleLoginModal" v-if="!user.isLoggedIn">
          <div v-else class="after_login_btn_group">
            <router-link to="/message" class="message_btn">
              <el-badge :value="'N'" :hidden="!user.me.newMail" class="message_alarm_badge"></el-badge>
              <img src="@/icon/message_icon.svg">
            </router-link>
            <el-dropdown trigger="click">
              <el-badge :value="alarmLength" :hidden="!user.me.alarm.length" class="alarm_badge">
                <img src="@/icon/alert_icon.svg">
              </el-badge>
              <el-dropdown-menu slot="dropdown" class="alarm_list_wrap">
                <el-dropdown-item v-if="!user.me.alarm.length" class="alarm_item">남은 알림이 없습니다.</el-dropdown-item>
                <el-dropdown-item
                  v-else
                  v-for="(alarm, index) in user.me.alarm"
                  :key="index"
                  class="alarm_item"
                  @click="readAlarm(alarm)"
                >
                  <div @click="readAlarm(alarm)">
                    <span class="content">{{alarm.content}}</span>
                    <span class="date">{{ alarm.created_at | moment('from', 'now') }}</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main id="main">
        <router-view/>
        <Login :showLoginModal="showLoginModal"></Login>
      </el-main>
      <el-footer id="footer" height="50px" :class="{open:showMoreMenu}">
        <el-row :gutter="5" class="navigation">
          <router-link to="/" class="home">
            <el-col :span="4" class="item">
              <!-- <img src="https://png.icons8.com/ios/50/000000/home.png"> -->
              <img src="https://png.icons8.com/office/40/000000/home.png">
              홈
            </el-col>
          </router-link>
          <router-link to="/community">
            <el-col :span="4" class="item">
              <!-- <img src="https://png.icons8.com/ios/50/000000/speech-bubble-with-dots.png"> -->
              <img src="https://png.icons8.com/ultraviolet/40/000000/comments.png">
              커뮤니티
            </el-col>
          </router-link>
          <router-link to="/lecture">
            <el-col :span="4" class="item">
              <!-- <img src="https://png.icons8.com/ios/50/000000/university.png"> -->
              <img src="https://png.icons8.com/dusk/40/000000/library.png">
              강의정보
            </el-col>
          </router-link>
          <router-link to="/timetable">
            <el-col :span="4" class="item">
              <!-- <img src="https://png.icons8.com/ios/50/000000/timetable.png"> -->
              <img src="https://png.icons8.com/office/40/000000/overtime.png">
              시간표
            </el-col>
          </router-link>
          <router-link to="/meal">
            <el-col :span="4" class="item">
              <img src="https://png.icons8.com/office/40/000000/meal.png">
              학식메뉴
            </el-col>
          </router-link>
          <!-- <router-link to="/idcard">
            <el-col :span="4" class="item">
              <img src="https://png.icons8.com/dusk/64/000000/electronic-identity-card.png">
              학생증
            </el-col>
          </router-link> -->
          <a @click="toggleShowMoreMenu">
            <el-col :span="4" class="item">
              <span v-show="!showMoreMenu">
                <img src="https://png.icons8.com/ultraviolet/40/000000/more.png">
                더보기
              </span>
              <span v-show="showMoreMenu">
                <img src="https://png.icons8.com/ultraviolet/40/000000/circled-down.png">
                접기
              </span>
            </el-col>
          </a>
        </el-row>
        <el-row :gutter="5" class="navigation">
          <!-- <router-link to="/meal">
            <el-col :span="4" class="item">
              <img src="https://png.icons8.com/office/40/000000/meal.png">
              학식메뉴
            </el-col>
          </router-link> -->
          <!-- <router-link to="/land">
            <el-col :span="4" class="item">
              <img src="https://png.icons8.com/office/40/000000/real-estate.png">
              부동산
            </el-col>
          </router-link> -->
          <router-link to="/library">
            <el-col :span="4" class="item">
              <img src="https://png.icons8.com/office/40/000000/literature.png">
              도서관
            </el-col>
          </router-link>
          <router-link to="/calendar">
            <el-col :span="4" class="item">
              <img src="https://png.icons8.com/office/40/000000/week-view.png">
              학사일정
            </el-col>
          </router-link>
          <router-link to="/news">
            <el-col :span="4" class="item">
              <img src="https://png.icons8.com/office/40/000000/news.png">
              뉴스
            </el-col>
          </router-link>
          <router-link to="/mypage">
            <el-col :span="4" class="item">
              <img src="https://png.icons8.com/office/40/000000/webcam-man.png">
              내정보
            </el-col>
          </router-link>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Login from '@/views/Login'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      searchInput: ''
    }
  },
  components: {
    Login
  },
  computed: {
    ...mapGetters(['user', 'showLoginModal', 'showMoreMenu', 'alarmLength'])
  },
  methods: {
    ...mapActions(['userInit', 'logout', 'deleteAlarm']),
    ...mapMutations([
      'toggleLoginModal',
      'closeLoginModal',
      'toggleShowMoreMenu',
      'closeShowMoreMenu'
    ]),

    search () {
      if (this.searchInput.length < 2) { return this.$toasted.show('검색어를 2글자 이상 입력하세요.') }
      this.$refs.searchBar.showPopper = false
      this.$router.push({
        path: `/search`,
        query: { query: this.searchInput }
      })
    },

    readAlarm (alarm) {
      this.$router.push(alarm.link)
      this.axios.delete(`/user/alarm/${alarm._id}`).then(() => {
        this.userInit()
      })
    }
  },
  mounted () {
    this.userInit()
    this.eventBus.$on('alert', message => {
      this.$toasted.show(message)
    })
  },
  watch: {
    $route (to, from) {
      this.closeLoginModal()
      this.closeShowMoreMenu()
    }
  }
}
</script>

<style lang="scss">
@import "./style/style.scss";
@import url("https://fonts.googleapis.com/earlyaccess/notosanskr.css");

body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: "Noto Sans KR", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  #header {
    position: fixed;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-flow: row wrap;
    z-index: 2018;
    padding: 0 15px;
    width: 100%;
    background-color: white;
    border-bottom: 2px solid #fbbd08;

    .menu_center {
      max-width: 110px;
      margin: 0 auto;

      .logo {
        width: 100%;
      }
    }

    .menu_left {
      position: absolute;
      left: 15px;
      img {
        display: inline-block;
        left: 0px;
        position: relative;
        height: 18px;
        top: 1.2px;
        padding: 10px 2px;
      }
      .search_btn_wrap {
        span {
          display: block;
          outline: none;
        }
      }
    }

    .menu_right {
      position: absolute;

      img {
        cursor: pointer;
      }

      .login_btn {
        display: inherit;
        position: relative;
        height: 18px;
        padding: 10px 2px;
        cursor: pointer;
      }

      .after_login_btn_group {
        display: inline-flex;
        justify-content: center;
        align-items: center;

        .message_btn {
          margin-right: 10px;
          position: relative;
          img {
            display: inline-block;
            position: relative;
            height: 20px;
            top: 1.7px;
            padding: 10px 2px;
          }
          .message_alarm_badge {
            position: absolute;
            height: 25px;
            z-index: 50;
            outline: none;
            sup {
              top: 3px;
              right: -11.5px;
              font-size: 11px;
              padding: 0 4px;
              cursor: pointer;
            }
          }
        }

        .alarm_list_wrap {
          width: 100%;
        }

        .alarm_badge {
          height: 25px;
          outline: none;
          sup {
            top: 5px;
            right: 14px;
            font-size: 11px;
            padding: 0 4px;
            cursor: pointer;
          }
          img {
            height: 25px;
          }
        }
      }
      &.messgae {
        height: 25px;
        float: right;
        margin-top: 8px;
        margin-right: 20px;
      }
    }
  }

  #main {
    margin: 40px 0 50px 0;
    padding: 0;
    overflow: hidden;
  }

  #footer {
    background-color: white;
    border-top: 1px solid gray;
    width: 100%;
    padding: 0;
    position: fixed;
    bottom: 0;
    text-align: center;
    z-index: 3000;

    .navigation {
      a {
        color: inherit;
        text-decoration: none;
        &.router-link-active:not(.home) {
          .item {
            background-color: #f7f7f7;
            font-weight: bold;
          }
        }
        .item {
          padding: 4px 0 6px 0px;
          font-size: 0.8em;

          img {
            width: 25px;
            height: 25px;
            display: block;
            margin: 0 auto;
          }
        }
      }
    }
    -webkit-transition: height 0.5s; /* Safari */
    transition: height 0.5s;
  }
  #footer.open {
    height: 100px !important;
  }
}
</style>
