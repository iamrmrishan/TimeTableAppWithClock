// import { environment } from '../../environments/environment';
import {AngularFireDatabase} from '@angular/fire/database';
import lecture, {default as Lecture} from './Lecture';
// import {combineAll} from "rxjs/internal/operators";
// import {async} from "@angular/core/testing";
import {CurrentViewFormat} from '../Controller/CurrentViewDataloader';
// import
// import {equal} from "assert";



export  class CurrentViewController {
  // var database ;
  // output: Lecture[] = [] ;
  previousData: Lecture[] = [];
  currentData: Lecture[] = [];
  nextData: Lecture[] = [];
  timeTableData: CurrentViewFormat[] = [];
  db: any ;
  date: number ;
  // the time periods variables
  prevTimeStartStr: string;
  nowTimeStartStr: string;
  nextTimeStartStr: string;
  nextTimeEnd: number;
  constructor(db: AngularFireDatabase) {
    this.db = db;
    this.date = new Date().getDay();
    console.log(this.date);
    // db.list('/Friday',
    //     ref => ref.orderByChild('floor').equalTo('02'))
    //   .valueChanges().subscribe((data) => {
    //   console.log(data);
    // });

  }

  async getLectureShedule() {
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
    console.log(this.prevTimeStartStr);
    console.log(this.nowTimeStartStr);
    console.log(this.nextTimeStartStr);
    await this.getTimeLecsBefore(this.prevTimeStartStr , this.nowTimeStartStr);
    // console.log(this.timeTableData);
    // return this.timeTableData;
  }

   
  async getTimeLecsBefore( timeStart , timeEnd ) {
    // this.output.length = 0;
    const output = [];
    console.log(timeStart);
    console.log(timeEnd);
    // to get the lectures which started during that period or continuing from previous periods
    this.db.list('/' + '1' , ref => ref.orderByChild('startTime').endAt('09:00'))
      .valueChanges()
      .subscribe(data => {
      console.log('inside subscribe');
      data.forEach(d => {
        if (d.endTime > '08:00' ) {
          output.push(d);
          // console.log(d);
        }
        // console.log(d.endTime);
      });
      this.previousData = output;
      this.getTimeLecsNow(this.nowTimeStartStr , this.nextTimeStartStr);
    });
    console.log('ecuted : dj 1995');
    // getPreviousLectures(timeStr)
  }
  getTimeLecsNow( timeStart , timeEnd ) {
    // this.output.length = 0;
    const output = [];
    console.log(timeStart);
    console.log(timeEnd);
    // to get the lectures which started during that period or continuing from previous periods
    this.db.list('/' + '1' , ref => ref.orderByChild('startTime').endAt('09:00'))
      .valueChanges().subscribe(data => {

      data.forEach(d => {
        if (d.endTime > '08:00' ) {
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
    this.db.list('/' + '1' , ref => ref.orderByChild('startTime').endAt('09:00'))
      .valueChanges().subscribe(data => {

      data.forEach(d => {
        if (d.endTime > '08:00' ) {
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
      this.timeTableData.push(dataRow);
    }
    return this.timeTableData;
    
  }
}
