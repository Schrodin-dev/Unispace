import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MainPageComponent } from './main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { AuthService } from './services/auth.service';
import {FormsModule} from "@angular/forms";
import { RegisterComponentComponent } from './register-component/register-component.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./services/auth-guard.service";
import { NotesComponent } from './notes/notes.component';
import { AgendaComponent } from './agenda/agenda.component';
import { EdtComponent } from './edt/edt.component'
import {RequestsService} from "./services/requests.service";

const appRoutes:Routes = [
  { path: '', canActivate: [AuthGuard], component: MainPageComponent},
  { path: 'notes', canActivate: [AuthGuard], component: NotesComponent },
  { path: 'agenda', canActivate: [AuthGuard], component: AgendaComponent },
  { path: 'edt', canActivate: [AuthGuard], component: EdtComponent },
  { path:'login', component: LoginPageComponent},
  { path:'register', component: RegisterComponentComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MainPageComponent,
    FooterComponent,
    LoginPageComponent,
    EditAccountComponent,
    RegisterComponentComponent,
    NotesComponent,
    AgendaComponent,
    EdtComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    AuthGuard,
    RequestsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
