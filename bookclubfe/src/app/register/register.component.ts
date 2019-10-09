import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/security/auth.service';
import { Router, Params } from '@angular/router';
import { FirebaseDBService } from '../services/dao/firebase-db.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';



  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private firestoreDao: FirebaseDBService,



  ) {
    this.createForm();
   }

  ngOnInit() {
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['',Validators.required]
    });
  }


  tryRegister(value){
    this.authService.doRegister(value)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.successMessage = "Your account has been created";
      this.firestoreDao.addUserToBookclub();
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }

}
