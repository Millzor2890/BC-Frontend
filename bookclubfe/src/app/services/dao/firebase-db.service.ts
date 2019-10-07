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
  //Survery 
  ////Members: [userIds]
  ////MemberInfo
  //////userid
  //////hasVoted
  ////Books:
  //////Id
  //////user id who promoted it
  ////// its current score
  //////

  promoteBookToSurvey(book: any){
    var database = this.db;
    //try to get 
    database.collection("Surveys").where( "members", "array-contains",  firebase.auth().currentUser.uid).get()
    .then(function(querySnapshot){
      if(querySnapshot.size == 0)
      {
        console.log("Create new survey for user");
        var papa =  database.collection("Surveys").add({
          members:[firebase.auth().currentUser.uid],
          memberInfo: [{userId:  firebase.auth().currentUser.uid, hasVoted: false}],
          books:[{
            [0]:{
                id:book.id,
                promotingUser:firebase.auth().currentUser.uid,
                currentScore: 0 
          }
        }]
          
        });

    }
    else if(querySnapshot.size == 1)
    {
      console.log(querySnapshot);

      var data = querySnapshot.docs[0].data();
    
        console.log(data);
        console.log("Total number of books on the shelf is: " + Object.keys(data.books).length);
        querySnapshot.docs[0].ref.update({
          books: firebase.firestore.FieldValue.arrayUnion({
            [Object.keys(data.books).length]: 
            {
              id:book.id,
              promotingUser:firebase.auth().currentUser.uid,
              currentScore: 0 
           
            }
        })
    });
    }
  }
  
  ).catch(function(error){
      console.log("Error promoting to survey");
      console.log(error);

    });

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




    
  
}
