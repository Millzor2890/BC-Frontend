import { Component, OnInit } from '@angular/core';
import { BooksearchService } from '../services/booksearch/booksearch.service';
import { FirebaseDBService } from '../services/dao/firebase-db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase'


@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css']
})
export class BookshelfComponent implements OnInit {
  public booksToShow: any[];

  constructor(
    public booksearchService: BooksearchService,
    public firestoreDao: FirebaseDBService,
    private _snackBar: MatSnackBar
  ) {
    this.booksToShow = new Array;

   }

  ngOnInit() {
    this.loadBooksOnShelf();

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  async loadBooksOnShelf(){
    //get the shelf record for user
    const dbDocument = await this.firestoreDao.getBookShelfForUser();
    console.log(dbDocument)

    var dataFromDb =dbDocument.docs[0].data();
    console.log(JSON.stringify(dataFromDb))
    console.log(dataFromDb["books"].length)

    for(var index = 0; index < dataFromDb.books.length; index++)
    {
      this.booksearchService.searchForBookById(dataFromDb.books[index][index].id)
      .then((data) => this.booksToShow.push(data))
      .catch((error) => console.log(error));
    }  
  }

  

  removeFromBookshelf(event: any,book: any)
  {
    this.booksToShow.splice(this.booksToShow.indexOf(book),1)

    this.firestoreDao.removeBookFromShelf(book);
    this.openSnackBar("Removed from bookshelf", "Close");


    //find a way to refresh the page or update view model.
  }

  promoteToSurvey(event: any,book: any){
    this.firestoreDao.promoteBookToSurvey(book);
    this.openSnackBar("Added To survey", "Close");
  }
}
