import { Component } from '@angular/core';
import { UiService } from './services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //arg/field is the dependency of this component
  constructor(public ui: UiService){}
}
