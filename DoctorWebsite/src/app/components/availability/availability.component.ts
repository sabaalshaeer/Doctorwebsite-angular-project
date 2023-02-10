import { Component, Input } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Appointment } from 'src/Appointment';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent {

   //except an appointment Object from doctor HTML
  @Input() appointment : Appointment | undefined

  constructor(public ui:UiService){}

}
