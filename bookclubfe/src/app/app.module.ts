import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http'; 
import { environment } from '../environments/environment';
import { BooksearchComponent } from './booksearch/booksearch.component';

import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import {firebase_config} from '../configs/firebase.config'


//auth

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LoginComponentComponent } from './login-component/login-component.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';

import { AuthService } from './services/security/auth.service';
import { BooksearchService } from './services/booksearch/booksearch.service';
import {AuthGuard} from './services/security/auth.guard';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { SurveyComponent } from './survey/survey.component';
import { SurveyResultsComponent } from './survey-results/survey-results.component';
import { NavComponent } from './nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    AppComponent,
    BooksearchComponent,
    LoginComponentComponent,
    HomeComponentComponent,
    RegisterComponent,
    BookshelfComponent,
    SurveyComponent,
    SurveyResultsComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(firebase_config.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    BrowserAnimationsModule, 
    MatSnackBarModule
  ],
  providers: [AuthService,BooksearchService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
