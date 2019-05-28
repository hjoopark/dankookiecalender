<template>
    <div class="calendar_wrapper">
        <div class="head">
            <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
            {{`${new Date().getFullYear()}년 ${new Date().getMonth()+1}월`}} 학사일정
        </div>
        <ul class="timeline">
            <li v-for="week in calendars" :key="week.title">
                <div class="timeline-date vertical-center">
                    <span v-for="(time, index) in week.term" :key="index">
                        {{time.month}}월 {{time.day}}일
                        <span v-if="week.term.length>1 && !index"> ~ </span>
                    </span>
                </div>
                <div class="timeline-content">
                    <h4>{{week.title}}</h4>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  data () {
    return {
      calendars: []
    }
  },
  mounted () {
    this.getCalendars()
  },
  methods: {
    getCalendars () {
      this.axios
        .get('/dankook/calendar')
        .then(response => {
          if (response.data.success) {
            this.calendars = response.data.calendars
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar_wrapper {
  .head {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin: 0px 0px 10px 0px;
    padding: 3px 0px;
    background-color: #f8f8f8;
    border-top: #e1e1e1 solid 1px;
    border-bottom: #e1e1e1 solid 1px;
    margin-top: -1px;
  }

  .timeline {
    margin: 0;
    padding: 5px 0 10px 15px;
    box-sizing: border-box;
    list-style: none;
    li {
      margin-bottom: 60px;
    }
  }

  .timeline > li {
    overflow: hidden;
    margin: 0;
    position: relative;
  }
  .timeline-date {
    padding-left: 21px;
    margin: 0px;
    width: 250px;
    font-size: 13px;
    min-height: 36px;
  }
  .timeline-date.vertical-center {
    line-height: 36px;
  }
  .timeline-content {
    width: 75%;
    float: left;
    border-left: 2px rgb(184, 200, 211) solid;
    padding-left: 15px;
    margin-left: 6px;
    h4 {
      margin: 15px 0;
      font-size: 10pt;
    }
  }
  .timeline-content:before {
    content: "";
    width: 8px;
    height: 8px;
    background: rgb(37, 151, 229);
    position: absolute;
    left: 3.1px;
    top: 14px;
    border-radius: 100%;
  }
}
</style>
