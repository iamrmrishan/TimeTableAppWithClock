import Lecture from './Lecture';
import {AngularFireDatabase} from 'angularfire2/database';

export  class CurrentViewFormat {

  previousSlot: Lecture;
  currentSlot: Lecture;
  nextSlot: Lecture;

  // getInfo() {
  //   this.database.list('/Friday').subscribe((LecData ) => {
  //     console.log(LecData);
  //   });
  // }
}
