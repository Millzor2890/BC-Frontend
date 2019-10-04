import { Injectable } from '@angular/core';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  private db;
  constructor() { 

    this.db = firebase.firestore();
  }


  getBookShelfForUser(){
    return this.db.collection("Bookshelves").where( "userId", "==",  firebase.auth().currentUser.uid).get();
  }




    
  
}
