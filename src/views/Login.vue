<template>
  <el-dialog :visible.sync="showLoginModal" width="100%" top="0" class="login_modal" :before-close="toggleLoginModal">
    <div class="user_form">
      <header class="logo_wrap">
        <span>
          <img src="https://s3.ap-northeast-2.amazonaws.com/dankookie/static/m_logo.png" alt="로고" class="logo">
        </span>
      </header>
      <section class="input_container">
        <!-- 로그인 -->
        <div class="input_wrap login_wrap" v-show="currentTab == '로그인'">
          <div class="input_box">
            <el-input type="text" name="login_id" ref="login_id" placeholder="아이디" v-model="loginForm.id" v-validate="'required|max:16|onlyEngNum'"
              data-vv-as="아이디" autofocus>
              <font-awesome-icon slot="prefix" icon="user" />
            </el-input>
            <p class="warning">{{errors.first('login_id')}}</p>
          </div>
          <div class="input_box">
            <el-input type="password" name="login_password" placeholder="비밀번호" v-model="loginForm.password" v-validate="'required'" data-vv-as="패스워드">
              <font-awesome-icon slot="prefix" icon="lock" />
            </el-input>
          </div>
          <el-button class="submit_btn" @click="doLogin" :loading="loginForm.loading" :disabled="!loginForm.id || !loginForm.password || errors.has('login_id') || errors.has('login_password')">로그인</el-button>
          <el-button class="submit_btn" @click="setTab('회원가입')">회원가입</el-button>
          <p class="result_msg">{{loginForm.message}}</p>
        </div>
        <!-- 회원가입 -->
        <div class="input_wrap signup_wrap" v-show="currentTab == '회원가입'">
          <h3 class="input_wrap_title">회원가입</h3>
          <div class="input_box">
            <el-input type="text" name="signup_id" maxlength="16" placeholder="아이디" v-model="signupForm.id" v-validate="'required|min:4|max:16|onlyEngNum|duplicateID'"
              data-vv-as="아이디">
              <font-awesome-icon slot="prefix" icon="user" />
            </el-input>
            <p class="warning">{{errors.first('signup_id')}}</p>
          </div>
          <div class="input_box">
            <el-input type="text" name="signup_nickname" maxlength="10" placeholder="닉네임" v-model="signupForm.nick_name" v-validate="'required|min:2|max:10|noSpecial|noBlank|duplicateNickName'"
              data-vv-as="닉네임">
              <font-awesome-icon slot="prefix" icon="smile" />
            </el-input>
            <p class="warning">{{errors.first('signup_nickname')}}</p>
          </div>
          <div class="input_box">
            <el-input type="password" name="signup_password" maxlength="20" placeholder="비밀번호" v-model="signupForm.password" v-validate="'required|min:6|max:20|noBlank'"
              data-vv-as="비밀번호">
              <font-awesome-icon slot="prefix" icon="lock" />
            </el-input>
            <p class="warning">{{errors.first('signup_password')}}</p>
          </div>
          <div class="input_box">
            <el-input type="password" name="signup_password_check" maxlength="20" placeholder="비밀번호 확인" v-model="signupForm.password_check"
              v-validate="'confirm:signupForm.password'" data-vv-as="비밀번호 확인">
              <font-awesome-icon slot="prefix" icon="lock" />
            </el-input>
            <p class="warning">{{errors.first('signup_password_check')}}</p>
          </div>
          <el-button class="submit_btn" @click="doSignup" :loading="signupForm.loading" :disabled="!signupForm.id || !signupForm.nick_name || !signupForm.password || !signupForm.password_check || errors.has('signup_id') || errors.has('signup_nickname') || errors.has('signup_password') || errors.has('signup_password_check')">
            회원가입</el-button>
          <p class="result_msg">{{signupForm.message}}</p>
        </div>
        <!-- 아이디 찾기 -->
        <div class="input_wrap find_id_wrap" v-show="currentTab == '아이디 찾기'">
          <h3 class="input_wrap_title">아이디 찾기</h3>
          <div class="input_box">
            <el-input type="text" name="findid_student_id" maxlength="8" placeholder="학번" v-model="find_id.student_id" v-validate="'required|numeric|length:8'"
              data-vv-as="학번">
              <font-awesome-icon slot="prefix" icon="id-card" />
            </el-input>
            <p class="warning">{{errors.first('findid_student_id')}}</p>
          </div>
          <div class="input_box">
            <el-input type="password" name="findid_student_pw" placeholder="단국대 포털 비밀번호" v-model="find_id.student_pw" v-validate="'required'"
              data-vv-as="단국대 비밀번호">
              <font-awesome-icon slot="prefix" icon="key" />
            </el-input>
            <p class="warning">{{errors.first('findid_student_pw')}}</p>
          </div>
          <el-button class="submit_btn" @click="doFindId" :loading="find_id.loading" :disabled="!find_id.student_id || !find_id.student_pw || errors.has('findid_student_id') || errors.has('findid_student_pw')">아이디 찾기</el-button>
          <p class="result_msg">{{find_id.message}}</p>
        </div>
        <!-- 비밀번호 찾기 -->
        <div class="input_wrap find_pw_wrap" v-show="currentTab == '비밀번호 찾기'">
          <h3 class="input_wrap_title">비밀번호 찾기</h3>
          <div class="input_box">
            <el-input type="text" name="findpw_id" maxlength="16" placeholder="단쿠키 아이디" v-model="find_pw.id" v-validate="'required|max:16|onlyEngNum'"
              data-vv-as="아이디">
              <font-awesome-icon slot="prefix" icon="user" />
            </el-input>
            <p class="warning">{{errors.first('findpw_id')}}</p>
          </div>
          <div class="input_box">
            <el-input type="text" name="findpw_student_id" maxlength="8" placeholder="학번" v-model="find_pw.student_id" v-validate="'required|numeric|length:8'"
              data-vv-as="학번">
              <font-awesome-icon slot="prefix" icon="id-card" />
            </el-input>
            <p class="warning">{{errors.first('findpw_student_id')}}</p>
          </div>
          <div class="input_box">
            <el-input type="password" name="findpw_student_pw" placeholder="단국대 포털 비밀번호" v-model="find_pw.student_pw" v-validate="'required'"
              data-vv-as="단국대 비밀번호">
              <font-awesome-icon slot="prefix" icon="key" />
            </el-input>
            <p class="warning">{{errors.first('findpw_student_pw')}}</p>
          </div>
          <el-button class="submit_btn" @click="doFindPassword" :loading="find_pw.loading" :disabled="!find_pw.id || !find_pw.student_id || !find_pw.student_pw || errors.has('findpw_id') || errors.has('findpw_student_id') || errors.has('findpw_stduent_pw')">
            비밀번호 찾기
          </el-button>
          <p class="result_msg">{{find_pw.message}}</p>
        </div>
        <ul class="user_nav">
          <li>
            <a href="#" @click.prevent="setTab('로그인')" v-show="currentTab !== 'login'">로그인</a>
          </li>
          <li>
            <a href="#" @click.prevent="setTab('아이디 찾기')">아이디 찾기</a>
          </li>
          <li>
            <a href="#" @click.prevent="setTab('비밀번호 찾기')">비밀번호 찾기</a>
          </li>
        </ul>
        <div class="keep_btn_wrap" v-show="currentTab == '로그인'">
          <el-checkbox v-model="loginForm.keep" class="keep_btn">로그인 유지</el-checkbox>
        </div>
      </section>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      showLogin: false,
      currentTab: '로그인',
      loginForm: {
        id: '',
        password: '',
        keep: false,
        message: '',
        loading: false
      },
      signupForm: {
        id: '',
        nick_name: '',
        password: '',
        password_check: '',
        message: '',
        agree: false,
        loading: false
      },
      find_id: {
        student_id: '',
        student_pw: '',
        message: '',
        loading: false
      },
      find_pw: {
        id: '',
        student_id: '',
        student_pw: '',
        message: '',
        loading: false
      }
    }
  },
  computed: {
    ...mapGetters(['showLoginModal'])
  },
  created () {
    var axios = this.axios
    var self = this

    this.$validator.extend('duplicateID', {
      getMessage (field) {
        return '탈퇴한 계정 혹은 이미 사용중인 아이디 입니다.'
      },
      validate (id) {
        return new Promise(resolve => {
          axios
            .post('/user/verify', {
              login_id: id
            })
            .then(response => {
              resolve(response.data.success)
            })
            .catch(err => {
              resolve(false)
              console.error(err)
            })
        })
      }
    })

    this.$validator.extend('duplicateStuID', {
      getMessage (field) {
        return '탈퇴한 계정 혹은 이미 사용중인 학번 입니다.'
      },
      validate (value) {
        return new Promise(resolve => {
          axios
            .post('/user/verify', {
              student_id: value
            })
            .then(response => {
              resolve(response.data.success)
            })
            .catch(() => {
              resolve(false)
            })
        })
      }
    })

    this.$validator.extend('duplicateNickName', {
      getMessage (field) {
        return '탈퇴한 계정 혹은 이미 사용중인 닉네임 입니다.'
      },
      validate (value) {
        return new Promise(resolve => {
          axios
            .post('/user/verify', {
              nick_name: value
            })
            .then(response => {
              resolve(response.data.success)
            })
            .catch(() => {
              resolve(false)
            })
        })
      }
    })

    this.$validator.extend('noSpecial', {
      getMessage (field) {
        return '특수문자는 사용할 수 없습니다.'
      },
      validate (value) {
        // eslint-disable-next-line
        return !new RegExp(/[`~!@#$%^&*|\\\'\";:\/?]/).test(value)
      }
    })

    this.$validator.extend('noBlank', {
      getMessage (field) {
        return '공백은 사용할 수 없습니다.'
      },
      validate (value) {
        return value.indexOf(' ') === -1
      }
    })

    this.$validator.extend('onlyEngNum', {
      getMessage (field) {
        return '특수문자나 한글, 공백은 사용할 수 없습니다.'
      },
      validate (value) {
        return /^[a-zA-Z0-9-_]*$/.test(value)
      }
    })

    this.$validator.extend('confirm', {
      getMessage (field) {
        return '비밀번호가 일치하지 않습니다.'
      },
      validate (value, [prop]) {
        var target = prop.split('.').reduce((acc, cur) => acc[cur], self)
        return String(value) === String(target)
      }
    })
  },
  mounted () {
    if (this.$refs.login_id) this.$refs.login_id.focus()
  },

  methods: {
    ...mapMutations(['toggleLoginModal']),
    ...mapActions(['login', 'logout', 'signup', 'findId', 'findPw']),

    close () {
      this.toggleLoginModal()
      this.resetData()
      this.currentTab = '로그인'
    },

    resetData () {
      this.loginForm = {
        id: '',
        password: '',
        keep: false,
        message: '',
        loading: false
      }
      this.signupForm = {
        id: '',
        nick_name: '',
        password: '',
        password_check: '',
        message: '',
        agree: false,
        loading: false
      }
      this.find_id = {
        student_id: '',
        loading: false
      }
      this.find_pw = {
        student_id: '',
        id: '',
        loading: false
      }
    },

    setTab (tab) {
      this.currentTab = tab
      this.resetData()
    },

    doLogin () {
      if (this.errors.has('login_id') || this.errors.has('login_pw')) return
      this.loginForm.loading = true
      this.login({
        login_id: this.loginForm.id,
        password: this.loginForm.password,
        keep: this.loginForm.keep
      })
        .then(res => {
          this.$toasted.success('로그인 성공')
          this.close()
        })
        .catch(err => {
          this.loginForm.message = err.message
        })
        .then(() => {
          this.loginForm.loading = false
        })
    },
    doSignup () {
      if (
        this.errors.has('signup_id') ||
        this.errors.has('signup_nick_name') ||
        this.errors.has('signup_password') ||
        this.errors.has('signup_password_check')
      ) { return }
      this.signupForm.loading = true
      this.signup({
        login_id: this.signupForm.id,
        nick_name: this.signupForm.nick_name,
        password: this.signupForm.password
      })
        .then(res => {
          if (res.data.success) {
            this.$toasted.success('회원가입이 완료되었습니다.')
            this.$toasted.show('로그인 후 단국대 인증을 해주세요.')
            this.setTab('로그인')
          }
        })
        .catch(err => {
          this.signupForm.message = err.message
        })
        .then(() => {
          this.signupForm.loading = false
        })
    },
    doFindId () {
      if (
        this.errors.has('findid_student_id') ||
        this.errors.has('findid_student_pw')
      ) { return }
      this.find_id.loading = true

      this.axios
        .post('/user/find/id', {
          student_id: this.find_id.student_id,
          student_pw: this.find_id.student_pw
        })
        .then(res => {
          this.resetData()
          if (res.data.success) {
            this.find_id.message = `찾으시는 아이디는 [ ${
              res.data.login_id
            } ] 입니다.`
          } else {
            this.find_id.message =
              res.data.message || '계정을 찾을 수 없습니다.'
          }
        })
        .catch(err => {
          this.find_id.message = err.message || '계정을 찾을 수 없습니다.'
        })
        .then(() => {
          this.find_id.loading = false
        })
    },
    doFindPassword () {
      if (
        this.errors.has('findpw_id') ||
        this.errors.has('findpw_student_id') ||
        this.errors.has('findpw_student_pw')
      ) { return }

      this.find_pw.loading = true
      this.axios
        .post('/user/find/password', {
          login_id: this.find_pw.id,
          student_id: this.find_pw.student_id,
          student_pw: this.find_pw.student_pw
        })
        .then(res => {
          this.resetData()
          this.find_pw.message = res.data.message
        })
        .catch(err => {
          this.find_pw.message = err.message
        })
        .then(() => {
          this.find_pw.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.login_modal {
  .el-dialog__headerbtn {
    top: 60px;
    padding: 10px;
  }
  .el-dialog {
    margin: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;

    .el-dialog__header,
    .el-dialog__body {
      max-width: 280px;
      width: 100%;
    }
  }

  .keep_btn_wrap {
    margin-top: 25px;

    .keep_btn {
      margin-left: -15px;
    }

    .el-checkbox__input {
      position: relative;
      top: -1px;

      .el-checkbox__inner {
        width: 12px;
        height: 12px;
      }
    }

    span {
      font-size: 12px;
    }
  }
}

.user_form {
  padding: 35px 0;

  .logo_wrap {
    padding-bottom: 1.5rem;
    text-align: center;

    span {
      display: inline-block;
      cursor: pointer;
    }
  }

  .input_container {
    margin: 0 auto;
    padding: 0;
    width: 100%;
    max-width: 350px;
    background-color: #ffffff;
    text-align: center;
    box-sizing: border-box;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 8px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
      background-color: #cccccc;
    }

    .input_wrap_title {
      margin: 0 0 1rem;
      text-align: center;
    }

    .input_box {
      margin: 0 auto;

      & + .input_box {
        margin-top: 20px;
      }

      input {
        background-color: #eeeeee;
        text-indent: 4px;

        &::placeholder {
          font-size: 13px;
          letter-spacing: -0.02rem;
          color: #aaaaaa;
        }
      }

      .el-input__prefix {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        left: 10px;
      }
    }

    .warning {
      margin-bottom: 0;
      text-align: left;
      margin-top: 3px;
      font-size: 12px;
      letter-spacing: -0.02rem;
      color: red;
      text-indent: 4px;

      &.portal {
        margin-bottom: 35px;
        font-size: 13px;
        font-weight: 300;
        color: #000;
      }
    }

    .notice {
      margin-bottom: 35px;
      word-break: keep-all;
      font-size: 13px;
      font-weight: 500;
      color: #cb8936;
      line-height: 1.8;
    }

    .submit_btn {
      display: block;
      margin-top: 20px;
      width: 100%;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: -0.02rem;

      & + button {
        margin-top: 10px;
        margin-left: 0;
      }
    }

    .result_msg {
      display: block;
      word-break: keep-all;
      margin-top: 15px;
      font-size: 14px;
      color: red;
    }

    .user_nav {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: row wrap;
      padding-left: 0;

      li {
        list-style-type: none;
        position: relative;

        a {
          color: #000;
          text-decoration: none;
          display: block;
          padding: 0 10px;
          font-size: 12px;
        }

        &:not(:last-child) > a::after {
          content: "|";
          display: inline-block;
          position: absolute;
          right: -2px;
        }
      }
    }
  }
}

.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
