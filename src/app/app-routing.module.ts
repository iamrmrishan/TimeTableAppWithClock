import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimeTableComponent} from './time-table/time-table.component';
import {CurrentViewComponent} from './current-view/current-view.component';
import {DigitalClockComponent} from'./digital-clock/digital-clock.component';
const routes: Routes = [
  {
    path: '',
    component: TimeTableComponent
  },
   {

   path: '',
   component: DigitalClockComponent
   //path: 'current',
   //component : DigitalClockComponent,
  },
  {
    path: 'current',
    component: CurrentViewComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
