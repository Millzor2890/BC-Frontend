import { Component, OnInit } from '@angular/core';
import { BooksearchService } from '../services/booksearch/booksearch.service';

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
  bookResults: string;

  //TODO: Add API Service
  constructor(
    public booksearchService: BooksearchService
  ) {
    
    this.query="";

   }


  ngOnInit() {
  }

  updateSearchQuery(event: any){
    console.log("This is the query : " + event.target.value);
    this.booksData = event.target.value
  }


  searchForBooks(){
    this.booksearchService.search(this.booksData).subscribe(
      (data:any) => {
        this.bookResults =   JSON.stringify(Array.of(data)[0].items[0]);
      },
      error => 
      {
        this.bookResults = "api did not work, and failed";
      }
    );
  }



}
