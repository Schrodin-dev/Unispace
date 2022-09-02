import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-gestion-etudiants',
  templateUrl: './gestion-etudiants.component.html',
  styleUrls: ['./gestion-etudiants.component.scss']
})
export class GestionEtudiantsComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;
	couleurPrincipale!: String;

	users!: User[];
	droitsUser!: number;

	error!: String;

  constructor(private authService: AuthService, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.loadCouleurs();
	  this.loadUsers();

	  let droits = this.authService.getDroits();
	  if(droits !== null){
		  this.droitsUser = this.roleStringToNumber(droits);
	  }

  }

  private loadCouleurs(){
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur;});
  }

  loadUsers(){
	  this.requestsService.afficherUtilisateur()
		  .then(users => {
			  this.users = users;
		  })
		  .catch(error => {
			  this.error = error.error.message;
		  })
  }

  peutAugmenterRole(role: String): boolean{
	  let roleNb = this.roleStringToNumber(role);

	  return roleNb < this.droitsUser - 1 && (this.droitsUser === 3 || roleNb >= 0);
  }

  peutReduireRole(role: String): boolean{
	  let roleNb = this.roleStringToNumber(role);

	  return roleNb > 0 && roleNb < this.droitsUser;
  }

  private roleStringToNumber(role: String): number{
	  switch(role){
		  case 'non validé':
			  return -1;
		  case 'élève':
			  return 0;
		  case 'publicateur':
			  return 1;
		  case 'délégué':
			  return 2;
		  case'admin':
			  return 3;
		  default:
			  return -2;
	  }
  }

	private roleNumberToString(role: number): string{
		switch(role){
			case -1:
				return 'non validé';
			case 0:
				return 'élève';
			case 1:
				return 'publicateur';
			case 2:
				return 'délégué';
			case 3:
				return 'admin';
			default:
				return 'erreur';
		}
	}

	augmenterDroits(email: string, droits: string) {
		if(!this.peutAugmenterRole(droits)) return;

		this.requestsService.modifierDroits(email, this.roleNumberToString(this.roleStringToNumber(droits) + 1))
			.then(() => {
				this.loadUsers();
			})
			.catch(error => {
				this.error = error.error.message;
			});
	}

	diminuerDroits(email: string, droits: string) {
		if(!this.peutReduireRole(droits)) return;

		this.requestsService.modifierDroits(email, this.roleNumberToString(this.roleStringToNumber(droits) - 1))
			.then(() => {
				this.loadUsers();
			})
			.catch(error => {
				this.error = error.error.message;
			});
	}
}
