import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-mes-donnees',
  templateUrl: './mes-donnees.component.html',
  styleUrls: ['./mes-donnees.component.scss']
})
export class MesDonneesComponent implements OnInit {
	couleurTexte!: String;
	couleurFond!: String;
	couleurPrincipale!: String;

	form!: FormGroup;
	classes!: {nomClasse: string; groupes: {nomGroupe: string}[]}[];
	classe!: {nomClasse: string; groupes: {nomGroupe: string}[]}
	userInfos!: { groupe: string | null; nom: string | null; prenom: string | null; email: string | null };
	themes!: number[];
	selectedTheme!: number;

	messageParametres!: String;
	errorParametres!: String;
	messageTheme!: String;
	errorTheme!: String;

  constructor(private authService: AuthService, private requestsService: RequestsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur;});

	  this.userInfos = this.authService.getUserInfos();

	  this.form = this.formBuilder.group({
		  prenom: [this.userInfos.prenom, Validators.maxLength(40)],
		  nom: [this.userInfos.nom, Validators.maxLength(40)],
		  email: [this.userInfos.email, [Validators.email, Validators.pattern(/^[a-zA-Z]+\.[a-zA-Z]+@etu\.umontpellier\.fr$/i), Validators.maxLength(128)]],
		  classe: [null],
		  groupe: [this.userInfos.groupe],
		  mdp: [null],
		  annonces: [null]
	  });

	  this.loadClasses();
	  this.loadAnnonces();
	  this.loadThemes();

	  this.form.valueChanges.subscribe(value => {
		  if(value.classe && value.classe !== this.classe.nomClasse){
			  this.updateClasse(value.classe);
			  console.log(this.classe);
		  }
	  })
  }

  private loadClasses(){
	  this.requestsService.getClasses().toPromise()
		  .then(classes => {
			  this.classes = classes;

			  for(const classe of this.classes){
				  for(const groupe of classe.groupes){
					  if(groupe.nomGroupe === this.userInfos.groupe){
						  this.classe = classe;
						  this.form.patchValue({'classe': classe.nomClasse});
						  return;
					  }
				  }
			  }
		  })
		  .catch(error => {
			  this.messageParametres = '';
			  this.errorParametres = error.error.message;
		  });
  }

  private loadAnnonces(){
	  this.requestsService.getAccepteRecevoirAnnonces()
		  .then(value => {
			  this.form.patchValue({'annonces': value});
		  })
		  .catch(error => {
			  this.messageParametres = '';
			  this.errorParametres = error.error.message;
		  });
  }

  private updateClasse(nomClasse: String){
	  for(const classe of this.classes){
			  if(classe.nomClasse === nomClasse){
				  this.classe = classe;
				  this.form.patchValue({'classe': classe.nomClasse});
				  return;
			  }
	  }
  }

	modifierCompte() {
		this.requestsService.modifierUserInfos(this.form.value.email, this.form.value.nom, this.form.value.prenom, this.form.value.mdp, this.form.value.groupe, (this.form.value.annonces as boolean))
			.then(message => {
				this.errorParametres = '';
				this.messageParametres = message;

				if(this.form.value.email) sessionStorage.setItem("email", this.form.value.email);
				if(this.form.value.nom) sessionStorage.setItem("nom", this.form.value.nom);
				if(this.form.value.prenom) sessionStorage.setItem("prenom", this.form.value.prenom);
				if(this.form.value.groupe) sessionStorage.setItem("groupe", this.form.value.groupe);

				window.location.reload();
			})
			.catch(error => {
				this.messageParametres = '';
				this.errorParametres = error.error.message;
			});
	}

	supprimerCompte($event: boolean){
		if($event){
			this.requestsService.supprimerCompte()
				.then(() => {
					this.authService.disconnect();
				})
				.catch(error => {
					this.messageParametres = '';
					this.errorParametres = error.error.message;
				});
		}
	}

	private loadThemes() {
		this.requestsService.recupererThemes().then(themes => {this.themes = themes;});
		this.authService.theme.subscribe(image => {
			this.selectedTheme = Number(image);
		});
	}

	selectionnerTheme(theme: number){
	  	this.selectedTheme = theme;
	}

	modifierTheme() {
		this.requestsService.modifierTheme(this.selectedTheme)
			.then(message => {
				this.errorTheme = '';
				this.messageTheme = message;
			})
			.catch(error => {
				this.messageTheme = '';
				this.errorTheme = error.error.message;
			});
	}
}
