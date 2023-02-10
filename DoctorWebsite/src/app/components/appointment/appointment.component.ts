import { Component, Input } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Appointment } from 'src/Appointment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {
  //except an appointment Object from doctor HTML
  @Input() appointment : Appointment | undefined

  constructor(public ui:UiService){}

}
