import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent {

  //store date and slot
  public date: Date = new Date()
  public slot: number = 0

  //iterate throught available slot
  public readonly slots: number[] = [1,2,3,4,5,6,7,8]
  constructor(public ui:UiService){}

}
