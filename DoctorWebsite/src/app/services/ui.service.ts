import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { User } from 'src/User';
import { take } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Appointment } from 'src/Appointment';
import { AstVisitor } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private showRegister = false
  private showLogin = true
  private loading = false
  private userId: number | undefined
  private username: string | undefined
  private doctor = false
  private appointments: Appointment[] = []
  private bookedAppts: Appointment[] = []
  private showNewApp =false

  //inject dependency
  constructor(private http:HttpClient, private snackBar: MatSnackBar) {
    //storing login information locally/browser storage
    const username = localStorage.getItem('username') //The getItem() method returns value of the specified Storage Object item.
    const password = localStorage.getItem('password')
    //if the password and uesename are not null then I can call the tryLogin with that username and password
    if (username !== null && password !== null) {
      this.tryLogin(username, password)
    }
  }
//getter
  public getShowRegister(): boolean {
    return this.showRegister
  }
  public getShowLogin(): boolean {
    return this.showLogin
  }
  public getLoading(): boolean {
    return this.loading
  }
  public getUsername(): string | undefined {
    return this.username
  }

  public getAppointments(): Appointment[] {
    return this.appointments
  }

  public isDoctor():boolean {
    return this.userId !== undefined && this.doctor
  }

  public isShowNewApp(): boolean {
    return this.showNewApp
  }

  public startNewApp(): void {
    this.showNewApp = true
  }

  public stopNewApp(): void {
    this.showNewApp = false
  }


  //add new appointment,post request
  public newApp(date: Date, slot: number): void {
    //check date
    if(date < new Date() ){
      this.showError('Date is invalid')
      return
    }
    // check slot--
    slot--
    if(slot < 0 || slot > 8 || slot % 1 !== 0){
      this.showError('Slot is invalid')
      return
    }
    this.showNewApp = false

    if (this.userId === undefined ){
      this.showError('BUG! You are not logged in!')
      return
    }

    //post http request/add new appointment
    this.http.post('http://localhost:3000/appointments',
    //pass payload object
    {
      //userId of the doctor, to make sure it defined we do if condition before th post request
      doctorId: this.userId,
      //patientId = null
      patientId: null,
      date,
      slot
    }
    )
    .pipe(take(1))
    .subscribe({
      // treat recieved data/"next"object is used to pass the next value in a sequence of values in observables
      next: () => {
        console.log("new appointment")
        this.loadAppointments()
      }, //treat error/"error"object, on the other hand, is used to represent an error that occurred during the execution of an observable
      error: () => {this.showError('Oops, something went wrong')}
    })
  }

  //delete appointment,delete rquest
  public deleteAppt(id: number):void{
    this.http.delete(`http://localhost:3000/appointments/${id}`)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.loadAppointments()
      },
      error: () => {this.showError('Oops, something went wrong')}
    })
  }



  //start register
  public startRegister(): void {
    this.showLogin =false
    this.showRegister = true
  }

  //start login
  public startLogin(): void {
    this.showLogin =true
    this.showRegister = false
  }

  //error message
  private showError(message: string):void{
    this.snackBar.open(message, undefined ,{duration: 2000})
  }

  //loginSuccess
private loginSuccess(user: User):void {
  this.showLogin =false
  this.showRegister = false
  this.userId = user.id
  this.username = user.username
  this.doctor = user.doctor
  //save the localstorage informations
  //localStorage.setItem(keyname, value) method sets the value of the specified Storage Object item.
  localStorage.setItem('username',user.username)
  localStorage.setItem('password',user.password)
  //when login I want to call loadAppointments function
  this.loadAppointments()
}

//load appointment associated with doctor
private loadDoctorAppts(): void {
  this.http.get<Appointment[]>(`http://localhost:3000/appointments?doctorId=${this.userId}`)
  .pipe(take(1))//after one event,unsubscribe
  .subscribe({
    //handle when I get appointments back
    next:appointments => {
      console.log(appointments)
      this.appointments = appointments
      this.loading = false
    },
    error:() => {
      this.loading = false
      this.showError('Oops, something went wrong')
    }
  })
}

//load appointment associated with patient
private loadPatientBookedAppts(): void {
  //load the booked appointment patientId = userId
  this.http.get<Appointment[]>(`http://localhost:3000/appointments?patientId=${this.userId}`)
  .pipe(take(1))//after one event,unsubscribe
  .subscribe({
    //handle when I get appointments back
    next:appointments => {
      console.log(appointments)
      this.bookedAppts = appointments
      this.loadAvailableAppts()
    },
    error:() => {
      this.loading = false
      this.showError('Oops, something went wrong')
    }
  })
}

private loadAvailableAppts(): void {
  //load the available appointment when patientId = null
  this.http.get<Appointment[]>('http://localhost:3000/appointments')
  .pipe(take(1))//after one event,unsubscribe
  .subscribe({
    //handle when I get appointments back
    next:appointments => {
      console.log(appointments)
      this.appointments = appointments.filter(appt => appt.patientId === null)//filter only available
      this.loading = false
    },
    error:() => {
      this.loading = false
      this.showError('Oops, something went wrong')
    }
  })
}

//get appointment associated with current user
private loadAppointments(): void{
  //request to the backend
  this.loading =true
  if(this.doctor){
    this.loadDoctorAppts()
  }else {
    this.loadPatientBookedAppts()
  }

}

 //get http
  public tryLogin(username: string,password: string): void {
    // ? filter user by (where) username= to valur of username and password= to valur of password
    this.http.get<User[]>(`http://localhost:3000/users?username=${username}&password=${password}`)
    //this is observable
    .pipe(take(1))
    //what come back is a list of users
    .subscribe({
      next:users => {
        //condition
        if (users.length !== 1){
          this.showError('Invalid Username and/or Password')
          return
        }
        //call loginSuccess function
        this.loginSuccess(users[0])
      },
      error: err =>{
        this.showError('Oops, something went wrong')
      }
    })
  }

  //logout
  public logout():void{
    this.showRegister = false
    this.showLogin = true
    this.loading = false
    this.userId= undefined
    this.username= undefined
    this.doctor = false
    this.appointments = []
    this.showNewApp =false
    //when logout, clear that localstorage
    //The clear() method removes all the Storage Object item for this domain.
    localStorage.clear()
  }

  public getAvailableAppts(): Appointment[] {
    return this.appointments
  }

  public getPatientBookedAppts(): Appointment[]  {
    return this.bookedAppts
  }
  //book apointment with modify that one,using Put request
  public bookAppt(appointment: Appointment): void {
    this.http.put(`http://localhost:3000/appointments/${appointment.id}`,{
      //send modification I want or we can say modify that one appointment to have my patientId
      // , keep all exist field and override the usedId with this userId
      ...appointment,//copy the exist field
    patientId: this.userId
    })
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.loadAppointments()
      },
      error: () => {
        this.showError('Fail to book')
      }
    })
  }

  public cancelAppt(appointment: Appointment): void {
    this.http.put(`http://localhost:3000/appointments/${appointment.id}`,{
      ...appointment,
      //modify, set the userId to null
    patientId: null
    })
    .pipe(take(1))
    .subscribe({
      next: () => {
        console.log('appointment is canceled')
        this.loadAppointments()
      },
      error: () => {
        this.showError('Fail to cancel')
      }
    })
  }

//get list of Users and check if the user is available before register by filter the username to the username that try to register
  public tryRegister(username: string, password: string, doctor: boolean){
    this.http.get<User[]>(`http://localhost:3000/users?username=${username}`)
    .pipe(take(1))
    .subscribe({
      next: (users) => {
        //what return from this array of users , check that array of users is 0
        if(users.length > 0){
          this.showError('Username is already exist')
          return
        }
        this.register(username, password, doctor)
      },
      error: () => {
        this.showError('Fail to register')
      }
    })
  }

  //register , post http request
  public register(username: string, password: string, doctor: boolean):void {
    this.http.post(`http://localhost:3000/users`, {
      //new user Object
      id: null,
      username,
      password,
      doctor
    })
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.tryLogin(username, password)
      },
      error: () => {
        this.showError('Fail to register')
      }
    })
  }


}
