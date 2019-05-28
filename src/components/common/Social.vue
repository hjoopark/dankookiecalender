<template>
  <social-sharing
    :url="`http://www.dankookie.com${url}`"
    :title="title"
    :description="description"
    :quote="title"
    hashtags="단국대,커뮤니티,단쿠키,단국대커뮤니티,단국대학교"
    inline-template
  >
    <div class="sns_share">
      <ul>
        <li>
          <network network="email">
            <i class="fa fa-envelope"></i>
            <p class="description">이메일</p>
          </network>
        </li>
        <li>
          <network network="facebook">
            <i class="fa fa-facebook"></i>
            <p class="description">페이스북</p>
          </network>
        </li>
        <li>
          <network network="googleplus">
            <i class="fa fa-google-plus"></i>
            <p class="description">구글+</p>
          </network>
        </li>
        <li>
          <network network="sms">
            <i class="fa fa-commenting-o"></i>
            <p class="description">SMS</p>
          </network>
        </li>
        <li>
          <network network="twitter">
            <i class="fa fa-twitter"></i>
            <p class="description">트위터</p>
          </network>
        </li>
      </ul>
    </div>
  </social-sharing>
</template>

<script>
export default {
  props: ['url', 'title', 'description']
}
</script>

<style lang="scss">
.sns_share {
  background-color: white;
  border: 1px solid #dee3eb;
  width: 200px;

  ul {
    color: gray;
    list-style: none;
    margin: 0;
    padding: 0;
    text-align: center;
    font-size: 1.7em;
    height: 100px;

    li {
      width: 33%;
      float: left;
      height: 50px;
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
        color: #e2c100;
        transition: 0.2s transform, 0.2s color;
      }

      .description {
        font-size: 0.4em;
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>
