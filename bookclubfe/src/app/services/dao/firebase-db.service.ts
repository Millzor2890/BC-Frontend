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
    var promise = new Promise((resolve, reject) => {
      this.db.collection("Surveys").where( "members", "array-contains",  firebase.auth().currentUser.uid).get()
      .then((querySnapshot) => {
        //console.log(querySnapshot)
        var newBookshelf = new Array;
        var data = querySnapshot.docs[0].data();
        for(var i = 0; i < data.books.length; i++){
          if(first.bookData.id == data.books[i].id){
            var newvoteslist = new Array;
            for(var j = 0; j < data.books[i].votes.length; j++){
              newvoteslist.push(data.books[i].votes[j])
            }

            newvoteslist.push({userid: firebase.auth().currentUser.uid, score: 3000})
            newBookshelf.push({
              currentScore: 0,
              id: data.books[i].id,
              promotingUser: data.books[i].promotingUser,
              votes : newvoteslist
            }
            
            )
          }
          else if(second.bookData.id == data.books[i].id)
          {
            var newvoteslist = new Array;
            for(var j = 0; j < data.books[i].votes.length; j++){
              newvoteslist.push(data.books[i].votes[j])
            }

            newvoteslist.push({userid: firebase.auth().currentUser.uid, score: 2000})
            newBookshelf.push({
              currentScore: 0,
              id: data.books[i].id,
              promotingUser: data.books[i].promotingUser,
              votes : newvoteslist
            }
            
            )

          }
          else if(third.bookData.id == data.books[i].id)
          {
            var newvoteslist = new Array;
            for(var j = 0; j < data.books[i].votes.length; j++){
              newvoteslist.push(data.books[i].votes[j])
            }

            newvoteslist.push({userid: firebase.auth().currentUser.uid, score: 1000})
            newBookshelf.push({
              currentScore: 0,
              id: data.books[i].id,
              promotingUser: data.books[i].promotingUser,
              votes : newvoteslist
            }
            
            )

          }
          else{
            newBookshelf.push({
              currentScore: 0,
              id: data.books[i].id,
              promotingUser: data.books[i].promotingUser,
              votes : data.books[i].votes
            })

            }
          }
          var newMemberInfo = new Array;
          for(var k = 0; k < data.memberInfo.length; k++){
            if(data.memberInfo[k].userId == firebase.auth().currentUser.uid)
            {
              newMemberInfo.push({
                hasVoted: true,
                userId: firebase.auth().currentUser.uid,
                email: data.memberInfo[k].email
              })
            }
            else{
              newMemberInfo.push(data.memberInfo[k])
            }
          }


          var bookUpdate = querySnapshot.docs[0].ref.update("books",newBookshelf); 
          var memberUpdate =  querySnapshot.docs[0].ref.update("memberInfo",newMemberInfo);
          
          Promise.all([bookUpdate,memberUpdate]).then(() =>{
              console.log("db is up to date");
              resolve();
            }
          )

          //Need to save that the current user has voted and cannot vote again.



        console.log(data);


      }).catch((error)=> {console.log(error); reject();})
      });
    return promise;
      
  
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
            hasVoted: false,
            email: firebase.auth().currentUser.email
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

  async removeBookFromSurvey(bookToRemove: any)
  {
    console.log(bookToRemove)
    const dbDocument = await this.getSurveyData();
    var data = dbDocument.docs[0].data();
    var newSurveyBookShelf = new Array;

    for(var i =0; i < data.books.length; i++){
      if(bookToRemove.bookData.id!= data.books[i].id){
        newSurveyBookShelf.push(data.books[i]);
      }
    }


    var data4db = {
      memberInfo: data.memberInfo,
      books: newSurveyBookShelf,
      members: data.members
    }
    dbDocument.docs[0].ref.set(data4db);
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
