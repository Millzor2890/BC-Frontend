import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/security/auth.service';
import { AuthService } from '../services/security/auth.service'


@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  constructor(
    public authService: AuthService,

  ) {
  }

  ngOnInit() {
  }


  tryLogout(){

    console.log("Calling logout");
    this.authService.doLogout();
    console.log("logout called");
  }



}
