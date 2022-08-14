import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MainPageComponent } from './mainpageComponents/main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { LoginPageComponent } from './login&register/login-page/login-page.component';
import { AuthService } from './services/auth.service';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponentComponent } from './login&register/register-component/register-component.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./services/auth-guard.service";
import {RequestsService} from "./services/requests.service";
import { MesDonneesComponent } from './params/mes-donnees/mes-donnees.component';
import { ContentComponent } from './agenda/content/content.component';
import { TodoComponent } from './agenda/todo/todo.component';
import { DetailComponent } from './notes/detail/detail.component';
import { GraphesComponent } from './notes/graphes/graphes.component';
import { MainEdtComponent } from './edt/main-edt/main-edt.component';
import { CoursComponent } from './edt/cours/cours.component';
import { EmbedEdtComponent } from './edt/embed-edt/embed-edt.component';
import { EmbedTodoComponent } from './agenda/embed-todo/embed-todo.component';
import { TravailAFaireComponent } from './agenda/travail-a-faire/travail-a-faire.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MainPageComponent,
    FooterComponent,
    LoginPageComponent,
    RegisterComponentComponent,
    MesDonneesComponent,
    ContentComponent,
    TodoComponent,
    DetailComponent,
    GraphesComponent,
    MainEdtComponent,
    CoursComponent,
    EmbedEdtComponent,
    EmbedTodoComponent,
    TravailAFaireComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
    ],
  providers: [
    AuthService,
    AuthGuard,
    RequestsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
