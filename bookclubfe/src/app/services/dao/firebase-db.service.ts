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


  dothing(params:string) {

    console.log(firebase.auth().currentUser.email);

    this.db.collection("users").add({
      first: "Ada",
      last: "Lovelace",
      born: 1815
  }).then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
    console.log(docRef);
})
.catch(function(error) {
    console.log("Error adding document: ", error);
});



    
  }
}
