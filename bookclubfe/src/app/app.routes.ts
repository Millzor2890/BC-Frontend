import { Routes } from '@angular/router';

//import { LoginComponent } from './login/login.component';
//import { UserComponent } from './user/user.component';
//import { RegisterComponent } from './register/register.component';
//import { UserResolver } from './user/user.resolver';
//import { AuthGuard } from './core/auth.guard';
import { BooksearchComponent } from './booksearch/booksearch.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { SurveyComponent } from './survey/survey.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import {RegisterComponent} from './register/register.component';
import { AuthGuard } from './services/security/auth.guard';


export const rootRouterConfig: Routes = [
    { path: 'home', component: HomeComponentComponent },
    { path: 'booksearch', component: BooksearchComponent, canActivate: [AuthGuard]},
    { path: 'bookshelf', component: BookshelfComponent, canActivate: [AuthGuard]},
    { path: 'survey', component: SurveyComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponentComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '**',
        redirectTo: 'home'
    }

    //{ path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    //{ path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    //{ path: 'user', component: UserComponent,  resolve: { data: UserResolver}}
];
