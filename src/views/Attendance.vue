<template>
    <div>
        <!-- <div id="calendar"></div> -->
        <FullCalendar defaultView="dayGridMonth" @eventRender="showCheckedDate"  @dateClick="handleDateClick" :plugins="calendarPlugins" :events="events" />
        <!-- <button id="check" @click="attendanceChecked()">
            출첵하기
        </button> -->
    </div>
</template>

<script>

import FullCalendar from '@fullcalendar/vue'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import checkImage from '../assets/images/attendance-check.svg'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
        events: [
                {
                    start : "2019-05-21",
                    rendering: 'background',
                    color: '#ff9f89'
                }
                , {
                    start : "2019-05-23",
                    rendering: 'background',
                    color: '#ff9f89'
                }
                ],
        // attendanceDate: "",
        // attendanceDates: [
        //     {
        //         attendanceDate: "2019-05-21",
        //         isChecked : true
        //     },
        //     {
        //         attendanceDate: "2019-05-23",
        //         isChecked : true
        //     }
        // ],
      calendarPlugins: [ interactionPlugin, dayGridPlugin ]
    }
  },
  

   methods: {
        handleDateClick(arg) {
            // console.log(this.$moment().format("YYYY-MM-DD"))
            // console.log(this.$moment().startOf('day'))
            // console.log(this.$moment(arg.date).format("YYYY-MM-DD"))
            //console.log(this.$moment(this.attendanceDate))
            // console.log(arg.date)

            // var todayDate = this.$moment().format("YYYY-MM-DD")         // 오늘 날짜
            // var clickDate = this.$moment(arg.date).format("YYYY-MM-DD") // 클릭한 날짜

            // if (todayDate != clickDate) return alert("접근할 수 없음") // 오늘 날짜에만 클릭 할 수 있도록 한다.

            // var todayDone = this.attendanceDates.some(date => date.attendanceDate == todayDate)
            // if(todayDone) {
            //     return alert("이미 출석되었습니다♥")
            // } else {
            //     alert("출석되었습니다♥")
            //     var newDate = {
            //         attendanceDate: clickDate,
            //         isChecked : true
            //     }
            //     this.attendanceDates.push(newDate)
            // }
            
            var todayDate = this.$moment().format("YYYY-MM-DD")         // 오늘 날짜
            var clickDate = this.$moment(arg.date).format("YYYY-MM-DD") // 클릭한 날짜

            if (todayDate != clickDate) return alert("접근할 수 없음") // 오늘 날짜에만 클릭 할 수 있도록 한다.

            var todayDone = this.events.some(date => date.start == todayDate)
            if(todayDone) {
                return alert("이미 출석되었습니다♥")
            } else {
                alert("출석되었습니다♥")
                var newDate = {
                    start: clickDate,
                    rendering: 'background',
                    color: '#ff9f89'
                }
                this.events.push(newDate)
            }
            
        },
        

        showCheckedDate(event) { // 출석한 날짜에 표시해주기
            // console.log(arg.date.getDate())
            // console.log(arg.date.getMonth())
            //arg.date.getDate()++ arg.el.dataset.date
            // var pYear = arg.date.getFullYear()
            // var pMonth = arg.date.getMonth()
            // var pDate = arg.date.getDate()

            // this.attendanceDates.forEach(dates => { 
            //     if(arg.el.dataset.date == dates.attendanceDate && dates.isChecked==true)
            //         arg.el.css("background-color", "#99CCFF");
            //      });

            // var check = FullCalendar.formatDate(date,'yyyy-MM-dd');
            //         var today = FullCalendar.formatDate(new Date(),'yyyy-MM-dd');
            //         if (check < today) {
            //             cell.css("background-color", "red");
            //         }

            // this.events.forEach(image => {
            //     if(this.events.imageurl) {
            //         var img = document.createElement("img")
            //         img.setAttribute('src', image.imageurl)
            //         event.el.appendChild(img)
            //     }
            // })

            var img = document.createElement("img")
            img.setAttribute('src', checkImage)
            img.classList.add("center")
            event.el.appendChild(img)
            
                
            // var valuableimage = this.events.some(image => image.imageurl)
            //     if(valuableimage) {
            //         event.el.prepend("<center><img src='" + image.imageurl + "'><center>")
            //     }
            

        }
        
    }
}

</script>

<style>
    .center {
        margin: auto;
        display: block;
        height: 35px;
    }
    .fc-bgevent {
        vertical-align: middle !important;
    }
</style>
