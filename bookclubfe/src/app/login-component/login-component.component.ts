import { Component } from '@angular/core';
import { AuthService } from '../services/security/auth.service'
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent {

  loginForm: FormGroup;
  errorMessage: string = '';
  messageSentMessage: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['',Validators.required]
    });
  }

  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(['/bookshelf']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    })
  }

  resetPassword(value){
    this.authService.doPasswordReset(value)
    .then(res => {
      this.messageSentMessage = "Password Reset Email sent successfully!";
    }, err => {
      if(err.message === "There is no user record corresponding to this identifier. The user may have been deleted.")
      {
        this.messageSentMessage = "It looks like this email address is not registered.  Try Creating an account!";

      }
      else{
        this.messageSentMessage = err.message;

      }
    })
  }




}
