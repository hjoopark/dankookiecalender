<template>
  <transition name="modal">
    <div class="modal" v-if="show" @click="clickOuter">
      <div class="modal_container">
        <div class="form_container modal_content">
          <div class="">
            <div class="title">
              <img src="https://s3.ap-northeast-2.amazonaws.com/dankookie/static/m_logo.png" alt="로고" class="logo">
              <slot name="title"></slot>
            </div>

            <slot name="body"></slot>

          </div>
          <!-- <div class="foot"></div> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },

  methods: {
    open () {
      this.show = true
    },

    close () {
      this.show = false
      this.$emit('close')
    },

    clickOuter (e) {
      if (e.target.className === 'modal_container') {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss">
.modal {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;

  .modal_container {
    display: table-cell;
    vertical-align: middle;

    .modal_content {
      width: 88%;
      max-width: 450px;
      margin: 0px auto;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      box-sizing: border-box;
      transition: all 0.3s ease;
    }

    .form_container {
      width: 88%;
      margin: 0 auto;
      padding: 30px;
      background-color: white;

      div {
        .title {
          padding: 5px 0;
          border-bottom: 1px solid #d3d3d3;
          .logo {
            display: inline-block;
            width: 100px;
            margin-right: 4px;
          }
        }
        p {
          font-size: 0.8em;
        }
        .list_container {
          list-style: none;
          padding: 0;

          li {
            font-size: 1.2em;
            height: 30px;
            line-height: 30px;

            span.left {
              float: left;
            }
            span.right {
              float: right;
              span.highlight {
                color: #e2c100;
              }
            }
          }
          .warning {
            font-size: 0.9em;
            display: block;
            margin-top: 3px;
            color: red;
          }
        }
        .input_container {
          .warning {
            display: block;
            margin-top: 3px;
            color: red;
          }
          .warning.portal {
            font-size: 13px;
            display: block;
            margin-top: 3px;
            color: #000 !important;
            line-height: 18px;
            letter-spacing: -1px;
            font-weight: bold;
          }
          .input_box {
            position: relative;
            margin-top: 10px;
            background-color: rgb(218, 214, 214);
            height: 56px;
            width: 100%;
            border: 1px solid rgb(218, 214, 214);
            i {
              position: absolute;
              left: 10px;
              top: 18px;
              text-align: center;
              width: 35px;
              font-size: 1.2em;
              color: rgb(102, 100, 100);
            }
            input {
              background-color: transparent;
              outline: none;
              margin-top: 13px;
              margin-left: 60px;
              width: 300px;
              vertical-align: middle;
              height: 30px;
              border: 0;
            }
          }
        }
        .checkbox_container {
          margin-top: 10px;

          .warning {
            font-size: 0.9em;
            display: block;
            margin-top: 10px;
            color: red;
          }
        }
        .dk-btn,
        .el-button {
          height: 50px;
          width: 100%;
          margin-top: 0;
          font-size: 13pt;
          border-radius: 0;
        }
        .result_msg {
          margin-top: 10px;
          font-weight: bold;
        }
        .notice {
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
          color: #000 !important;
          line-height: 20px;
          letter-spacing: -1px;
          font-weight: bold;
          span {
            color: tomato;
          }
        }
      }
      .foot {
        font-size: 0.8em;
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px solid #d3d3d3;
        width: 100%;
        text-align: center;
        a {
          margin: 0 10px;
          text-decoration: none;
          color: black;
          &:hover {
            text-decoration: underline;
          }
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
