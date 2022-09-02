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
import {MainEdtComponent} from "./edt/main-edt/main-edt.component";
import {VerifierCompteComponent} from "./login&register/verifier-compte/verifier-compte.component";
import {MdpOublieComponent} from "./login&register/mdp-oublie/mdp-oublie.component";
import {GestionEtudiantsComponent} from "./admin/gestion-etudiants/gestion-etudiants.component";
import {GestionUeRessourcesComponent} from "./admin/gestion-ue-ressources/gestion-ue-ressources.component";
import {AnnonceComponent} from "./admin/annonce/annonce.component";
import {GestionGroupesComponent} from "./admin/gestion-groupes/gestion-groupes.component";
import {GestionThemesComponent} from "./admin/gestion-themes/gestion-themes.component";

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: MainPageComponent},
  { path:'login', component: LoginPageComponent},
  { path:'register', component: RegisterComponentComponent},
  { path:'params', canActivate: [AuthGuard], component: MesDonneesComponent},
  { path:'agenda/content', canActivate: [AuthGuard], component: ContentComponent},
  { path:'agenda/todo', canActivate: [AuthGuard], component: TodoComponent},
  { path:'notes/detail', canActivate: [AuthGuard], component: DetailComponent},
  { path:'edt', canActivate: [AuthGuard], component: MainEdtComponent},
	{path: 'agenda', redirectTo: 'agenda/content'},
	{path: 'notes', redirectTo: 'notes/detail'},
	{path: 'verifyAccount', component: VerifierCompteComponent},
	{path: 'verifyAccount/:token', component: VerifierCompteComponent},
	{path: 'resetPassword', component: MdpOublieComponent},
	{path: 'resetPassword/:token', component: MdpOublieComponent},
	{path: 'admin', redirectTo: 'admin/gestionEtudiants'},
	{ path:'admin/gestionEtudiants', canActivate: [AuthGuard], component: GestionEtudiantsComponent},
	{ path:'admin/gestionUERessources', canActivate: [AuthGuard], component: GestionUeRessourcesComponent},
	{ path:'admin/annonce', canActivate: [AuthGuard], component: AnnonceComponent},
	{ path:'admin/gestionGroupes', canActivate: [AuthGuard], component: GestionGroupesComponent},
	{ path:'admin/gestionThemes', canActivate: [AuthGuard], component: GestionThemesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
