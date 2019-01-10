import { Component, OnInit } from '@angular/core';
import {PeriodicElement} from '../Controller/DataLoader';
import {AngularFireDatabase} from '@angular/fire/database';
import * as moment from 'moment';
// import angular.module('myModule', ['ds.clock']);


@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {
  // todaysShedule: any[] = [
  //   {hall: '1', t8to9: 'sub1a', t9to10: 'sub2a' , t10to11: 'sub3a', t11to12: 'sub4a' ,
  //     t13to14: 'sub5a', t14to15: 'sub6a', t15to16: 'sub7a', floor: 'f1'},
  //   {hall: '2', t8to9: 'sub1b', t9to10: 'sub2b' , t10to11: 'sub3b', t11to12: 'sub4b',
  //     t13to14: 'sub5b', t14to15: 'sub6a', t15to16: 'sub7a', floor: 'f2' },
  // ];
  todaysShedule: any[] = [];
  months: string[] = new Array('January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December');
  weekdays: string[] = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  halls = ['A4-202','A4-203','A4-204'];

  database : any;

  constructor(db: AngularFireDatabase) {
    this.date = new Date();
    this.database = db;
  }
  time: Date;
  date: Date;
  todayDate: string;
  todayTime: string;
  dataSource ;
  displayedColumns: string[] = ['Hall', 't8to9', 't9to10' , 't10to11' , 't11to12' , 't13to14', 't14to15' , 't15to16', 't16to17'];

  ngOnInit() {
      // setInterval(function () {
      //
      // },1000);

      // this.date = new Date();
      this.todayDate = this.months[this.date.getMonth()] + ' ' + this.date.getDate() + ', '
        + this.weekdays[this.date.getDay()];
      this.todayTime = this.date.getHours() + ' : ' + this.date.getMinutes() + ' : ' + this.date.getSeconds();
      // this.timer();
      this.getTimetableStructure();

  }

  private timer(): void {
    this.time = new Date();
    console.log(this.time);
    this.todayTime = this.time.getHours() + ' : ' + this.time.getMinutes() + ' : ' + this.time.getSeconds();

  }

  private getTimetableStructure(){
    var today = new Date().getDay();
    // console.log(today);
    this.database.list('/' + today )
      .valueChanges().subscribe((lectureInfo: Array<any>) => {

      console.log(lectureInfo);
      this.halls.forEach((hall) => {
          var hallShedule = [];
         lectureInfo.forEach((lecture)=>{          
           if(hall.match(lecture.location)){
            //  console.log(lecture.location);
             var startTime = moment(lecture.startingTime , 'HH:mm');
             var endTime = moment(lecture.endingTime , 'HH:mm')
            //  console.log(startTime);
             var duration = moment.duration(endTime.diff(startTime)).asHours();
             // gets the position of the array 
             var index = startTime.subtract(8 , 'hours').hours(); 
            //  console.log('index ' + index);
             for(var i = 0 ; i < duration ; i++){
               hallShedule[(index + i)] = lecture.name; // add the lecture name to the positon of the array
             }
           }
           
         });
         console.log(hallShedule);
         var hallSheduleStructure = {
          hall: hall,
          t8to9: hallShedule[0],
          t9to10: hallShedule[1],
          t10to11: hallShedule[2],
          t11to12: hallShedule[3],
          t13to14: hallShedule[4],
          t14to15: hallShedule[5],
          t15to16: hallShedule[6],
          t16to17: hallShedule[6],
          floor: 1
         }
         console.log(hallSheduleStructure);
         this.todaysShedule.push(hallSheduleStructure);
      });

      this.dataSource = this.todaysShedule;

    });
  }

}
