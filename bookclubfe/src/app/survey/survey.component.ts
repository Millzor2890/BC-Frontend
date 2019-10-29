import { Component, OnInit, Renderer2, ElementRef  } from '@angular/core';
import {Router} from "@angular/router";
import { FirebaseDBService } from '../services/dao/firebase-db.service';
import { BooksearchService } from '../services/booksearch/booksearch.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  booksToShow: any[];
  private firstChoiceBook: any;
  private secondChoiceBook: any;
  private thirdChoiceBook: any;
  public voteSubmitError: any;
  public myMemberInfo: any;
  

  constructor(public firestoreDao: FirebaseDBService,
    public booksearchService: BooksearchService,
    private render:Renderer2,
    private el: ElementRef,
    private router: Router

  ) 
  { 
    this.booksToShow = new Array;
    this.firstChoiceBook = null;
    this.secondChoiceBook = null;
    this.thirdChoiceBook = null;

  }

  ngOnInit() {
    this.loadBooksForSurvey();
  }

  async submitVote(event: any){
    if(this.myMemberInfo.hasVoted == true)
    {
      this.voteSubmitError = "You have already voted you silly billy.  You cant vote twice!"
    }
    else{
      if(this.firstChoiceBook == null){
        this.voteSubmitError = "Please select a book as your first choice vote!"
      }
      else if(this.secondChoiceBook == null){
        this.voteSubmitError = "Please select a book as your second choice vote!"
      }
      else if(this.thirdChoiceBook == null){
        this.voteSubmitError = "Please select a book as your third choice vote!"
      }
      else{
        await this.firestoreDao.submitVoteBooks(this.firstChoiceBook, this.secondChoiceBook, this.thirdChoiceBook)
        //Needs to wait until after db write happens
        this.router.navigate(['/surveyResults'])
      }
    }

  }

  selectFirstChoice(event: any, bookSelected: any)
  {
    this.firstChoiceBook = bookSelected;
    if(this.secondChoiceBook != null){
      if(this.secondChoiceBook.bookData.id == this.firstChoiceBook.bookData.id)
      {
        //remove selected secondChoice
        this.secondChoiceBook = null;
        let secondTag = this.el.nativeElement.getElementsByClassName('second-choice is-outlined');
        if(secondTag.length > 0)
        {
            for (var i = 0; i < secondTag.length; i++) {
              this.render.removeClass(secondTag[i],"is-outlined");        }
        }

      }
    }
    if(this.thirdChoiceBook != null){
      if(this.thirdChoiceBook.bookData.id == this.firstChoiceBook.bookData.id)
      {
        //remove selected thirdChoice
        this.thirdChoiceBook =null;
        let thirdTag = this.el.nativeElement.getElementsByClassName('third-choice is-outlined');
        if(thirdTag.length > 0)
        {
            for (var i = 0; i < thirdTag.length; i++) {
              this.render.removeClass(thirdTag[i],"is-outlined");        }
        }
      }
    }
    let myTag = this.el.nativeElement.getElementsByClassName('first-choice is-outlined');

    if(myTag.length > 0)
    {
        for (var i = 0; i < myTag.length; i++) {
          this.render.removeClass(myTag[i],"is-outlined");        }
    }
    this.render.addClass(event.target,"is-outlined");
    console.log(event);
  }

  selectSecondChoice(event: any, bookSelected: any)
  {
    this.secondChoiceBook = bookSelected;
    if(this.firstChoiceBook != null){
      if(this.firstChoiceBook.bookData.id == this.secondChoiceBook.bookData.id)
      {
        //remove selected secondChoice
        this.firstChoiceBook = null;
        let firstTag = this.el.nativeElement.getElementsByClassName('first-choice is-outlined');
        if(firstTag.length > 0)
        {
            for (var i = 0; i < firstTag.length; i++) {
              this.render.removeClass(firstTag[i],"is-outlined");        }
        }

      }
    }
    if(this.thirdChoiceBook != null){
      if(this.thirdChoiceBook.bookData.id == this.secondChoiceBook.bookData.id)
      {
        //remove selected thirdChoice
        this.thirdChoiceBook = null;

        let thirdTag = this.el.nativeElement.getElementsByClassName('third-choice is-outlined');
        if(thirdTag.length > 0)
        {
            for (var i = 0; i < thirdTag.length; i++) {
              this.render.removeClass(thirdTag[i],"is-outlined");        }
        }
      }
    }
    let myTag = this.el.nativeElement.getElementsByClassName('second-choice is-outlined');
    console.log("second choice");
    console.log(myTag);
    if(myTag.length > 0)
    {
      for (var i = 0; i < myTag.length; i++) {
        this.render.removeClass(myTag[i],"is-outlined");   
      } 
      
    }
    this.render.addClass(event.target,"is-outlined");
    console.log(event);
  }

  selectThirdChoice(event: any, bookSelected: any)
  {
    this.thirdChoiceBook = bookSelected;
    if(this.secondChoiceBook != null){
      if(this.secondChoiceBook.bookData.id == this.thirdChoiceBook.bookData.id)
      {
        //remove selected secondChoice
        this.secondChoiceBook = null;

        let secondTag = this.el.nativeElement.getElementsByClassName('second-choice is-outlined');
        if(secondTag.length > 0)
        {
            for (var i = 0; i < secondTag.length; i++) {
              this.render.removeClass(secondTag[i],"is-outlined");        }
        }

      }
    }
    if(this.firstChoiceBook != null){
      if(this.firstChoiceBook.bookData.id == this.thirdChoiceBook.bookData.id)
      {
        //remove selected firstChoice
        this.firstChoiceBook = null;

        let thirdTag = this.el.nativeElement.getElementsByClassName('first-choice is-outlined');
        if(thirdTag.length > 0)
        {
            for (var i = 0; i < thirdTag.length; i++) {
              this.render.removeClass(thirdTag[i],"is-outlined");        }
        }
      }
    }
    let myTag = this.el.nativeElement.getElementsByClassName('third-choice is-outlined');
    console.log("third choice");
    console.log(myTag);
    if(myTag.length > 0)
    {
      for (var i = 0; i < myTag.length; i++) {
        this.render.removeClass(myTag[i],"is-outlined");   
      } 
      
    }
    this.render.addClass(event.target,"is-outlined");
    console.log(event);
  }


  removeBookFromSurvey(event: any, bookSelected: any){
    this.booksToShow.splice(this.booksToShow.indexOf(bookSelected),1)
    this.firestoreDao.removeBookFromSurvey(bookSelected);
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

    if(this.myMemberInfo.hasVoted){
      this.router.navigate(['/surveyResults']);

    }
    
    for(var index = 0; index < dataFromDb.books.length; index++)
    {
      console.log(bookData)
      var promotingUser = dataFromDb.books[index].promotingUser;
      var bookData = await this.booksearchService.searchForBookById(dataFromDb.books[index].id)
      this.booksToShow.push({
          "bookData": bookData,
          "nominatingUser": promotingUser,
          "myMemberInfo" : this.myMemberInfo.email,
          "memberInfo": dataFromDb.memberInfo
      })
    }  

  }

}
