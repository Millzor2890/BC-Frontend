import { Component, OnInit } from '@angular/core';
import { BooksearchService } from '../services/booksearch/booksearch.service';
import { FirebaseDBService } from '../services/dao/firebase-db.service';
import * as firebase from 'firebase'


@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css']
})
export class BookshelfComponent implements OnInit {
  db:firebase.firestore.Firestore;
  public booksToShow: any[];

  constructor(
    public booksearchService: BooksearchService,
    public firestoreDao: FirebaseDBService
  ) {
    this.db = firebase.firestore();
    this.booksToShow = new Array;

   }

  ngOnInit() {
    this.loadBooksOnShelf();

  }

  async loadBooksOnShelf(){
    //get the shelf record for user
    const dbDocument = await this.firestoreDao.getBookShelfForUser();
    var dataFromDb =dbDocument.docs[0].data();

    for(var index = 0; index < dataFromDb.books.length; index++)
    {
      this.booksearchService.searchForBookById(dataFromDb.books[index][index].id).toPromise()
      .then((data) => this.booksToShow.push(data["volumeInfo"]))
      .catch((error) => console.log(error));
    }
}
}
