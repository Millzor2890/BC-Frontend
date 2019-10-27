import { Component, OnInit } from '@angular/core';import { FirebaseDBService } from '../services/dao/firebase-db.service';
import { BooksearchService } from '../services/booksearch/booksearch.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.component.html',
  styleUrls: ['./survey-results.component.css']
})
export class SurveyResultsComponent implements OnInit {
  booksToShow: any[];
  public myMemberInfo: any;


  constructor(public firestoreDao: FirebaseDBService,
    public booksearchService: BooksearchService,
    ) {

      this.booksToShow = new Array;
     }

     ngOnInit() {
      this.loadBooksForSurvey();
    }



  async loadBooksForSurvey(){
    const dbDocument = await this.firestoreDao.getSurveyData();
    var dataFromDb =dbDocument.docs[0].data();

    for(var memberIterator = 0; memberIterator < dataFromDb.memberInfo.length; memberIterator++)
    {
      if(dataFromDb.memberInfo[memberIterator].userId == firebase.auth().currentUser.uid)
      {
        this.myMemberInfo = dataFromDb.memberInfo[memberIterator];
      }
    }
    
    for(var index = 0; index < dataFromDb.books.length; index++)
    {
      console.log(bookData)
      var promotingUser = dataFromDb.books[index].promotingUser;
      var votesToSumUp =dataFromDb.books[index].votes;
      var voteTotal = 0;
      for(var voteIndex=0; voteIndex < votesToSumUp.length; voteIndex++)
      {
        voteTotal+=votesToSumUp[0].score
      }
      console.log("votescore" + voteTotal)

      var bookData = await this.booksearchService.searchForBookById(dataFromDb.books[index].id).toPromise()
      this.booksToShow.push({
          "bookData": bookData,
          "nominatingUser": promotingUser,
          "myMemberInfo" : this.myMemberInfo.email,
          "memberInfo": dataFromDb.memberInfo,
          "voteScore": voteTotal
      })

     
      this.booksToShow.sort(this.compareBookScore)
      
    }  
  }

   compareBookScore(a,b) {
    if (a.voteScore < b.voteScore)
       return 1;
    if (a.voteScore > b.voteScore)
      return -1;
    return 0;
  }
}
