import { Component, OnInit } from '@angular/core';
import { FirebaseDBService } from '../services/dao/firebase-db.service';
import { BooksearchService } from '../services/booksearch/booksearch.service';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  booksToShow: any[];
  db:firebase.firestore.Firestore;
  

  constructor(public firestoreDao: FirebaseDBService,
    public booksearchService: BooksearchService,
  ) 
  { 
    this.booksToShow = new Array;
  }

  ngOnInit() {
    this.loadBooksForSurvey();
  }

  async loadBooksForSurvey(){
    const dbDocument = await this.firestoreDao.getSurveyData();
    var dataFromDb =dbDocument.docs[0].data();

    console.log(dataFromDb);
    console.log(dataFromDb.books);
    for(var index = 0; index < dataFromDb.books.length; index++)
    {
      var promotingUser = dataFromDb.books[index].promotingUser;
      console.log("promoting user " +promotingUser)
      var bookData = await this.booksearchService.searchForBookById(dataFromDb.books[index].id).toPromise()
      this.booksToShow.push({
          "bookData": bookData,
          "nominatingUser": promotingUser,
      })
    }  

  }

}
