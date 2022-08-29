import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MainPageComponent } from './mainpageComponents/main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { LoginPageComponent } from './login&register/login-page/login-page.component';
import { AuthService } from './services/auth.service';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponentComponent } from './login&register/register-component/register-component.component';
import {AuthGuard} from "./services/auth-guard.service";
import {RequestsService} from "./services/requests.service";
import { MesDonneesComponent } from './params/mes-donnees/mes-donnees.component';
import { ContentComponent } from './agenda/content/content.component';
import { TodoComponent } from './agenda/todo/todo.component';
import { DetailComponent } from './notes/detail/detail.component';
import { MainEdtComponent } from './edt/main-edt/main-edt.component';
import { CoursComponent } from './edt/cours/cours.component';
import { EmbedEdtComponent } from './edt/embed-edt/embed-edt.component';
import { EmbedTodoComponent } from './agenda/embed-todo/embed-todo.component';
import { TravailAFaireComponent } from './agenda/travail-a-faire/travail-a-faire.component';
import { EmbedNotesComponent } from './notes/embed-notes/embed-notes.component';
import { NoteComponent } from './notes/note/note.component';
import { ExceptionIntercept } from './interceptors/exception.interceptor';
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { ErreurComponent } from './erreur/erreur.component';
import { VerifierCompteComponent } from './login&register/verifier-compte/verifier-compte.component';
import { MdpOublieComponent } from './login&register/mdp-oublie/mdp-oublie.component';
import { AjouterModifierNoteComponent } from './notes/ajouter-modifier-note/ajouter-modifier-note.component';

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
    MainEdtComponent,
    CoursComponent,
    EmbedEdtComponent,
    EmbedTodoComponent,
    TravailAFaireComponent,
    EmbedNotesComponent,
    NoteComponent,
    ErreurComponent,
    VerifierCompteComponent,
    MdpOublieComponent,
    AjouterModifierNoteComponent,
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
    RequestsService,
  	{ provide: LOCALE_ID, useValue: 'fr-FR'},
	  {provide: HTTP_INTERCEPTORS, useClass: ExceptionIntercept, multi: true},
	  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
	constructor() {
		registerLocaleData(fr.default);
	}
}
