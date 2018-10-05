import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router} from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';



@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    public afAuth: AngularFireAuth
  ) {}

  canActivateA(): Promise<boolean>{

    return new Promise<any>((resolve, reject) => {
        var user = firebase.auth().onAuthStateChanged(function(user){
            if (user) {
                console.log(user);
                console.log('user is logged in');
            return resolve(true);
            } else {
                console.log('user is not logged in');
                console.log(this.router)

            return reject(false);
            }
        })
        }
  }


  canActivate(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.canActivateA()
      .then(user => {
        return resolve(true);
      }, err => {
        this.router.navigate(['/login']);
        return resolve(false);
      })
    })
  }


  goAway(navURL): {

    console.log(this.router);
  }

  
}
