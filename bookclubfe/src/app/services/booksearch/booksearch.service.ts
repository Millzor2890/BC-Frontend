import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {firebase_config} from '../../../configs/firebase.config';


@Injectable()
export class BooksearchService {

  private apiUrl;

  

  constructor(private http: HttpClient)
  {
    this.apiUrl = "https://www.googleapis.com/books/v1/volumes";


   }


  search(searchstring: string)
  {
    var return_data = "api did not work";

    searchstring = searchstring.replace(' ', '+');

    var params: HttpParams =  new HttpParams()
    .set('q', searchstring)
    .set('key', firebase_config.firebase.apiKey)
    .set('maxResults', '10')
    return this.http.get(this.apiUrl, {params});
  }


  searchForBookById(bookId: string){
    return this.http.get(this.apiUrl + "/" +bookId);
  }
}
