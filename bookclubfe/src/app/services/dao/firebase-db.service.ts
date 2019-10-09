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

  submitVoteBooks(first: any, second: any, third: any)
  {
    this.db.collection("Surveys").where( "members", "array-contains",  firebase.auth().currentUser.uid).get()
    .then((querySnapshot) => {
      var data = querySnapshot.docs[0].data();
      console.log(data);

      for(var i = 0; i < data.books.length; i++){
        console.log(data.books[i])
        if(data.books[i].id == first.bookData.id){
          //Do something
        }
      }

    }).catch((error)=> console.log(error))
      
  }


  addVoteToBook(book:any, points: number)
  {


  }


  addUserToBookclub(){
    this.db.collection("Surveys").where( "members", "array-contains",  "G5LnNytbXFbIuoRJ071mBP5MA5f1").get()
    .then((querySnapshot)=> {
      querySnapshot.docs[0].ref.update({
        members: firebase.firestore.FieldValue.arrayUnion(
          firebase.auth().currentUser.uid
      ),
        memberInfo: firebase.firestore.FieldValue.arrayUnion(
          {
            userId: firebase.auth().currentUser.uid,
            hasVoted: false
          }
        )
    })
  })
  }

  getBookShelfForUser(){
    return this.db.collection("Bookshelves").where( "userId", "==",  firebase.auth().currentUser.uid).get();
  }

  getSurveyData(){
    return this.db.collection("Surveys").where( "members", "array-contains",  firebase.auth().currentUser.uid).get();
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
        database.collection("Surveys").add({
          members:[firebase.auth().currentUser.uid],
          memberInfo: [{userId:  firebase.auth().currentUser.uid, hasVoted: false}],
          books:[{
                id:book.id,
                promotingUser:firebase.auth().currentUser.email,
                currentScore: 0,
                votes: []
          
        }]
        })
    }
    else if(querySnapshot.size == 1)
    {
      var data = querySnapshot.docs[0].data();

        querySnapshot.docs[0].ref.update({
          books: firebase.firestore.FieldValue.arrayUnion(
             
            {
              id:book.id,
              promotingUser:firebase.auth().currentUser.email,
              currentScore: 0,
              votes:[]
           
            
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
