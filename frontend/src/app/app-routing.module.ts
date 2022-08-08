import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./services/auth-guard.service";
import {MainPageComponent} from "./mainpageComponents/main-page/main-page.component";
import {LoginPageComponent} from "./login&register/login-page/login-page.component";
import {RegisterComponentComponent} from "./login&register/register-component/register-component.component";
import {MesDonneesComponent} from "./params/mes-donnees/mes-donnees.component";
import {ContentComponent} from "./agenda/content/content.component";
import {TodoComponent} from "./agenda/todo/todo.component";
import {DetailComponent} from "./notes/detail/detail.component";
import {GraphesComponent} from "./notes/graphes/graphes.component";
import {MainEdtComponent} from "./edt/main-edt/main-edt.component";

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: MainPageComponent},
  { path:'login', component: LoginPageComponent},
  { path:'register', component: RegisterComponentComponent},
  { path:'params', canActivate: [AuthGuard], component: MesDonneesComponent},
  { path:'agenda/content', canActivate: [AuthGuard], component: ContentComponent},
  { path:'agenda/todo', canActivate: [AuthGuard], component: TodoComponent},
  { path:'notes/detail', canActivate: [AuthGuard], component: DetailComponent},
  { path:'notes/graphes', canActivate: [AuthGuard], component: GraphesComponent},
  { path:'edt', canActivate: [AuthGuard], component: MainEdtComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
