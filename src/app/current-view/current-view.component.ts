import { Component, OnInit } from '@angular/core';
import {CurrentViewFormat} from '../Controller/CurrentViewDataloader';
import { CurrentViewController} from '../Controller/CurrentViewController';
import {AngularFireDatabase} from '@angular/fire/database';
import lecture, {default as Lecture} from '../Controller/Lecture';


//

@Component({
  selector: 'app-current-view',
  templateUrl: './current-view.component.html',
  styleUrls: ['./current-view.component.css']
})

export class CurrentViewComponent implements OnInit {
  // the hard coded view time table data format
  // timeTableData: CurrentViewFormat[] = [
  //   {
  //     previousSlot: {code: 'inter 12213', name: 'programming', location: 'hall01', startingTime: '8 A.M', endingTime: '9 A.M.', floor: 'f1'},
  //     currentSlot: {code: 'inter 12213', name: 'coding', location: 'hall01', startingTime: '8 A.M', endingTime: '9 A.M.', floor: 'f1'} ,
  //     nextSlot: {code: 'inter 2222', name: 'programming', location: 'hall01', startingTime: '8 A.M', endingTime: '9 A.M.', floor: 'f2'},
  //   },
  //   {
  //     previousSlot: {code: 'inter 12213', name: 'programming', location: 'hall01', startingTime: '8 A.M', endingTime: '9 A.M.', floor: 'f1'},
  //     currentSlot: {code: 'inter 12213', name: 'programming', location: 'hall01', startingTime: '8 A.M', endingTime: '9 A.M.', floor: 'f2'} ,
  //     nextSlot: {code: 'inter 2222', name: 'programming', location: 'hall01', startingTime: '8 A.M', endingTime: '9 A.M.', floor: 'f3'},
  //   },
  // ];
   timeTableData: CurrentViewFormat[] = [];
// 
  constructor(db: AngularFireDatabase) {
    this.time = new Date();
    this.database = db;
    this.dayNumber = this.time.getDay();
    // console.log(this.dayNumber);
  }
  database: any ;
  timeSlotPrevios: string;
  timeslotCurrent: string;
  timeSlotNext: string;
  time: Date;
  dayNumber: number ; // the number of the day in the week
  dataSource ;
  displayedColumns: string[] = ['previousSlot', 'currentSlot', 'nextSlot'];

  // data for the current view controller 
  previousData: Lecture[] = [];
  currentData: Lecture[] = [];
  nextData: Lecture[] = [];
  prevTimeStartStr: string;
  nowTimeStartStr: string;
  nextTimeStartStr: string;
  nextTimeEnd: number;
  // displayedColumns: string[] = ['previousSlot'];
  ngOnInit() {
    let time;
    let startTime: string;
    let endTime: string;
    //
    // setting the previous time
    time = this.time.getHours() - 1;
    if (time < 12) {
      startTime = time + ' A.M.';
      endTime = (time + 1) + ' A.M.';
    } else if (time === 12) {
      startTime = time + 'noon';
      endTime = '1 P.M.';
    } else {
      startTime = (time - 12) + ' P.M.';
      endTime = (time - 11) + ' P.M.';
    }
    this.timeSlotPrevios = startTime + ' - ' + endTime;

    //
    // setting the current time
    time = this.time.getHours();
    if (time < 12) {
      startTime = time + ' A.M.';
      endTime = (time + 1) + ' A.M.';
    } else if (time === 12) {
      startTime = time + 'noon';
      endTime = '1 P.M.';
    } else {
      startTime = (time - 12) + ' P.M.';
      endTime = (time - 11) + ' P.M.';
    }
    this.timeslotCurrent = startTime + ' - ' + endTime;

    //
    // setting the next time
    time = this.time.getHours() + 1;
    if (time < 12) {
      startTime = time + ' A.M.';
      endTime = (time + 1) + ' A.M.';
    } else if (time === 12) {
      startTime = time + ' noon';
      endTime = '1 P.M.';
    } else {
      startTime = (time - 12) + ' P.M.';
      endTime = (time - 11) + ' P.M.';
    }
    this.timeSlotNext = startTime + ' - ' + endTime;

    this.getLectureShedule();

  }

  getLectureShedule() {
    const time = new Date();
    // let returnFunction = this.returnData();

    let prevTimeStart = time.getHours() - 1 ;
    let nextTimeStart = time.getHours() + 1   ;

    if (prevTimeStart === -1) {
      prevTimeStart = 24 ;
    }
    if ( nextTimeStart >= 24) {
      nextTimeStart = 0;
    }
    if (this.nextTimeEnd >= 24) {
      this.nextTimeEnd = this.nextTimeEnd - 24 ;
    }

    this.prevTimeStartStr = prevTimeStart + ':00' ;
    this.nowTimeStartStr = time.getHours() + ':00';
    this.nextTimeStartStr = nextTimeStart + ':00';
    this.nextTimeEnd = time.getHours() + 2;
    // console.log(this.prevTimeStartStr);
    // console.log(this.nowTimeStartStr);
    // console.log(this.nextTimeStartStr);
    this.getTimeLecsBefore(this.prevTimeStartStr , this.nowTimeStartStr);
    // console.log(this.timeTableData);
    // return this.timeTableData;
  }

  getTimeLecsBefore( timeStart , timeEnd ) {
    // this.output.length = 0;
    const output = [];
    console.log(timeStart);
    console.log(timeEnd);
    // to get the lectures which started during that period or continuing from previous periods
    this.database.list('/' + this.dayNumber , ref => ref.orderByChild('startingTime').endAt(timeStart+1))
      .valueChanges()
      .subscribe(data => {
      console.log('inside subscribe');
      data.forEach(d => {
        if (d.endingTime > (timeEnd - 1) ) {
          output.push(d);
          // console.log(d);
        }
        // console.log(d.endTime);
      });
      this.previousData = output;
      this.getTimeLecsNow(this.nowTimeStartStr , this.nextTimeStartStr);
    });
    // getPreviousLectures(timeStr)
  }
  getTimeLecsNow( timeStart , timeEnd ) {
    // this.output.length = 0;
    const output = [];
    console.log(timeStart);
    console.log(timeEnd);
    // to get the lectures which started during that period or continuing from previous periods
    this.database.list('/' + this.dayNumber , ref => ref.orderByChild('startingTime').endAt(timeStart + 1))
      .valueChanges().subscribe(data => {

      data.forEach(d => {
        if (d.endingTime > (timeEnd -1) ) {
          output.push(d);
          // console.log(d);
        }
        // console.log(d.endTime);
      });
      this.currentData = output;
      this.getTimeLecsNext(this.prevTimeStartStr, this.nextTimeEnd );

      console.log(output);
      // return output;
    });
    // getPreviousLectures(timeStr)
  }

  getTimeLecsNext( timeStart , timeEnd ) {
    // this.output.length = 0;
    const output = [];
    console.log(timeStart);
    console.log(timeEnd);
    // to get the lectures which started during that period or continuing from previous periods
    this.database.list('/' + this.dayNumber , ref => ref.orderByChild('startingTime').endAt(timeStart +1))
      .valueChanges().subscribe(data => {

      data.forEach(d => {
        if (d.endingTime > (timeEnd - 1) ) {
          output.push(d);
        }
      });
      this.nextData = output;
      this.createDataSet();
      // returnFunction = this.returnData();
      // console.log(output);

    });
  }
  createDataSet() {
    const maxNum: number = Math.max(this.previousData.length , this.currentData.length , this.nextData.length);
    for (let i = 0 ; i < maxNum; i++) {
      const dataRow = {
        previousSlot: this.previousData[i],
        currentSlot: this.currentData[i] ,
        nextSlot: this.nextData[i]  ,
      };
      console.log('data row');
      console.log(dataRow);
      this.timeTableData.push(dataRow);

    }
    console.log(this.timeTableData);
    this.dataSource = this.timeTableData;
    
    
    }
  }





