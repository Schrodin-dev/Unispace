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
import {FormsModule} from "@angular/forms";
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

const appRoutes:Routes = [
  { path: '', canActivate: [AuthGuard], component: MainPageComponent},
  { path:'login', component: LoginPageComponent},
  { path:'register', component: RegisterComponentComponent},
  { path:'params', canActivate: [AuthGuard], component: MesDonneesComponent},
  { path:'agenda/content', canActivate: [AuthGuard], component: ContentComponent},
  { path:'agenda/todo', canActivate: [AuthGuard], component: TodoComponent},
  { path:'notes/detail', canActivate: [AuthGuard], component: DetailComponent},
  { path:'notes/graphes', canActivate: [AuthGuard], component: GraphesComponent},
  { path:'edt', canActivate: [AuthGuard], component: MainEdtComponent}
]

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
