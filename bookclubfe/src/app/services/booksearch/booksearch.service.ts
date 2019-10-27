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

   convertToHttps(convertMe: any)
   {
     var stringifitedRefs = JSON.stringify(convertMe);
     stringifitedRefs = stringifitedRefs.replace('"http://','"https://');
     return JSON.parse(stringifitedRefs);
 
   }

   


  search(searchstring: string)
  { 
    var return_data = "api did not work";

    searchstring = searchstring.replace(' ', '+');

    var params: HttpParams =  new HttpParams()
    .set('q', searchstring)
    .set('key', firebase_config.firebase.apiKey)
    .set('maxResults', '10')

    var promise = new Promise((resolve, reject) => {

    this.http.get(this.apiUrl, {params}).toPromise().then((data:any) => {
      Array.of(data)[0].items.forEach( book => {
      var imageRefs = book.volumeInfo.imageLinks || null;

      if(imageRefs !== null)
      {
        book.volumeInfo.imageLinks = this.convertToHttps(book.volumeInfo.imageLinks);
      }
    })
    resolve(data)


    }).catch(error => {console.log(error); reject()})
  
    });
    return promise;
  }


  searchForBookById(bookId: string){
    var params: HttpParams =  new HttpParams()
    .set('key', firebase_config.firebase.apiKey)
    var promise = new Promise((resolve, reject) => {

        this.http.get(this.apiUrl + "/" +bookId, {params}).toPromise().then((data:any) => {
        var imageRefs = data.volumeInfo.imageLinks || null;

        if(imageRefs !== null)
        {
          data.volumeInfo.imageLinks = this.convertToHttps(data.volumeInfo.imageLinks);
        }

        resolve(data)

       } ).catch(error => {console.log(error); reject()})


    });
    return promise
  }
}
