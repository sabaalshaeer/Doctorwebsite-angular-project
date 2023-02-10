import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
//to store the value of username and password
public username= ''
public password= ''

  constructor(public ui: UiService) {}

  ngOnInit(): void {

  }

}
