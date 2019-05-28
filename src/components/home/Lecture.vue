<template>
  <div class="lecture_evaluation_list_wrapper">
    <div class="list" @click="redirectToDetail(item._id)" v-for="(item, index) in lists" :key="index">
      <p class="title">{{item.lecture.name}} : {{item.lecture.prof_name}}</p>
      <!-- <p class="title">의학사속의대발견 : 이익수</p> -->
      <div class="star_box avg_rate">
        <p class="label">총점 : </p>
        <el-rate
          class="star"
          v-model="item.rate"
          disabled>
        </el-rate>
      </div>
      <el-row>
        <el-col :span="12">
          <div class="star_box">
            <p class="label">강의 난이도 : </p>
            <el-rate
              class="star"
              v-model="item.lecture_difficulty"
              disabled>
            </el-rate>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="star_box">
            <p class="label">학점받기 : </p>
            <el-rate
              class="star"
              v-model="item.grade_difficulty"
              disabled>
            </el-rate>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="star_box">
            <p class="label">과제 : </p>
            <el-rate
              class="star"
              v-model="item.assignment"
              disabled>
            </el-rate>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="star_box">
            <p class="label">조별과제 : </p>
            <el-rate
              class="star"
              v-model="item.group_task"
              disabled>
            </el-rate>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lecture_evaluation_list_wrapper {
  .list {
    padding: 5px 10px;
    border-bottom: 1px solid #e2e2e2;
  }
  p {
    font-size: 12px;
    text-decoration: none;
    margin: 0px !important;
  }
  .title {
    display: inline;
    font-weight: 600;
  }
  .star_box.avg_rate {
    float: right;
    text-align: center;
    p {
      font-size: 12px !important;
    }
    .el-rate__icon {
      margin-top: -2px;
      font-size: 17px !important;
    }
  }
  .star_box {
    .label {
      font-size: 12px;
      display: inline;
    }
    .star {
      display: inline;
    }
    .el-rate__icon {
      margin-top: -2px;
      font-size: 12px;
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
    this.fetchList()
  },
  methods: {
    fetchList () {
      this.axios
        .get('/lecture/mobile/latest')
        .then(res => {
          this.lists = res.data
        })
        .catch(err => {
          console.log('error : ', err)
        })
    },
    redirectToDetail (id) {
      this.$router.push('/lecture/' + id)
    }
  }
}
</script>
