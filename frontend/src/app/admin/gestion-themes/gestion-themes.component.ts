import { Component, OnInit } from '@angular/core';
import {Theme} from "../../models/theme.model";
import {RequestsService} from "../../services/requests.service";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-gestion-themes',
  templateUrl: './gestion-themes.component.html',
  styleUrls: ['./gestion-themes.component.scss']
})
export class GestionThemesComponent implements OnInit {
	couleurTexte!: String;
	couleurFond!: String;
	themes!: Theme[];

	error!: String;
	ajouterTheme!: boolean;
	form!: FormGroup;

  constructor(private requestsService: RequestsService, private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
	  this.loadCouleurs();
	  this.rechargerThemes();
	  this.genererFormulaire();
  }

  loadCouleurs(){
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
  }

  rechargerThemes(){
	  this.requestsService.afficherThemesAdmin()
		  .then(themes => {
			  this.themes = themes;
			  this.ajouterTheme = false;
		  })
		  .catch(error => {
			  this.error = error.error.message;
		  });
  }

  genererFormulaire(){
	  this.form = this.formBuilder.group({
		  source: [null, Validators.required],
		  couleurPrincipale: [null, Validators.required],
		  couleurFond: [null, Validators.required]
	  });
  }

	suppr(veutSupprimer: boolean, theme: Theme) {
		if(!veutSupprimer) return;

		this.requestsService.supprimerTheme(theme.id)
			.then(() => {
				this.rechargerThemes();
			})
			.catch(error => {
				this.error = error.error.message;
			});
	}

	ajouter() {
		this.ajouterTheme = true;
	}

	validerTheme() {
		this.requestsService.ajouterTheme(this.form.value.source, this.form.value.couleurPrincipale.toString().substr(1, 6), this.form.value.couleurFond.toString().substr(1, 6))
			.then(() => {
				this.rechargerThemes();
			})
			.catch(error => {
				this.error = error.error.message;
			});
	}
}
