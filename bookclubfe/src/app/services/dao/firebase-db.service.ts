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

  async removeBookFromShelf(book: any){
    //get db model
    const dbDocument = await this.getBookShelfForUser();
    var data = dbDocument.docs[0].data();
    //remove book from array
    var newBookshelf = new Array;
    var newindex = 0;
    for(var i = 0; i < data.books.length; i++){
      if(book.id != data.books[i][i].id){
        newBookshelf.push({
          [newindex]: {
            shelfOrder: newindex,
            id: data.books[i][i].id
          }
      })
      newindex++;
    }
    var data4db = {
      userId: firebase.auth().currentUser.uid,
      books: newBookshelf
    }
    console.log(data4db);
    //set new array in model
    dbDocument.docs[0].ref.set(data4db);
    //commit to db
  }




    
  
}
