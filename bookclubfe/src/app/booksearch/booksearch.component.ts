import { Component, OnInit } from '@angular/core';

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

  //TODO: Add API Service
  constructor() {
    this.query="";

   }


  ngOnInit() {
  }

  search(event: any){
    console.log("This is the query : " + event.target.value);
    this.booksData = event.target.value
  }

}
