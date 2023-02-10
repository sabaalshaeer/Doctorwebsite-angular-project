import { Component, Input } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Appointment } from 'src/Appointment';

@Component({
  selector: 'app-cancel-appt',
  templateUrl: './cancel-appt.component.html',
  styleUrls: ['./cancel-appt.component.css']
})
export class CancelApptComponent {

   //except an appointment Object from doctor HTML
  @Input() appointment : Appointment | undefined

  constructor(public ui:UiService){}
}
