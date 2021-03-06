import { Component, OnInit } from '@angular/core';
import { BooksearchService } from '../services/booksearch/booksearch.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as firebase from 'firebase'

@Component({
  selector: 'booksearch',
  templateUrl: './booksearch.component.html',
  styleUrls: ['./booksearch.component.css']
})
export class BooksearchComponent implements OnInit {

  request: any;
  query: string;
  //TODO: Eventual result
  booksData: string;
  bookResults: any[];
  transactionStatus: string;
  db:firebase.firestore.Firestore;

  //TODO: Add API Service
  constructor(
    public booksearchService: BooksearchService,
    private _snackBar: MatSnackBar

  ) {
    this.db = firebase.firestore();
    this.query="";
   }


  ngOnInit() {
  }

  updateSearchQuery(event: any){
    this.booksData = event.target.value
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',

    });
  }
  


  searchForBooks(){
    this.booksearchService.search(this.booksData).then(
      (data:any) => {
        var bookResultArray = new Array ;
        Array.of(data)[0].items.forEach( book => {
          

          bookResultArray.push(
            {
              bookData: book,
              transactionStatus : ""
            }
          )
        });
        this.bookResults = bookResultArray;
      }).catch(
      error => 
      {
        console.log(error)
        console.log("Api failed");
      }
    );
  }


saveToBookshelf(event: any,book: any)
{

  var database = this.db;
  //try to get 
  database.collection("Bookshelves").where( "userId", "==",  firebase.auth().currentUser.uid).get()
  .then(function(querySnapshot){
    if(querySnapshot.size == 0)
    {
      console.log("Create new bookshelf for user");
      database.collection("Bookshelves").add({
        userId: firebase.auth().currentUser.uid,
        books:[{
          [0]:{
              id:book.bookData.id,
              shelfOrder:[0]
        }
      }]
        
      }).then(function(docRef)
      {
        console.log("success")
        console.log(event);
        
        book.transactionStatus = "Added your first book to your bookshelf";

        //doNothing
      }).catch(function(error)
      {
        console.log("failure");
        console.log(event);
        book.transactionStatus = "Failed to add book to your bookshelf"


        //DoNothing
      })
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
                id:book.bookData.id,
                shelfOrder:Object.keys(data.books).length,
           
            }
        })

    });
    }
      
      


      //var docToUpdate = querySnapshot[0].set()
      //d
  
    
  }).catch(function(error){
      console.log("get where failed");
      console.log(error);

  });
  this.openSnackBar("Added book to your bookshelf", "Close");

  
  
  
}


}
