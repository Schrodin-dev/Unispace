import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-gestion-groupes',
  templateUrl: './gestion-groupes.component.html',
  styleUrls: ['./gestion-groupes.component.scss']
})
export class GestionGroupesComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;

	detail!: {anneeUniv: String, classes: {classe: String, groupes: String[]}[]}[];
	parcours!: String[];
	ajouter!: string;
	form!: FormGroup;
	nMoinsUn!: String;
	error!: String;

  constructor(private authService: AuthService, private requestsService: RequestsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
	  this.chargerCouleurs();
	  this.chargerDetails();

  }

  private chargerCouleurs(){
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

  private chargerDetails(){
	  this.requestsService.getDetailGroupes()
		  .then(detail => {this.detail = detail;})
		  .catch(error => {
			  this.error = error.error.message;
		  });
	  this.requestsService.getListeParcours()
		  .then(parcours => {
			  this.parcours = parcours;
		  })
		  .catch(error => {
			  this.error = error.error.message;
		  });
  }

	add(type: string, nMoinsUn?: String) {
		switch(type){
			//on crée un form différend à chaque fois
			case 'anneeUniv':
				this.ajouter = type;
				this.form = this.formBuilder.group({
					nom: [null, [Validators.required, Validators.minLength(1), Validators.min(1)]]
				});

				break;
			case 'classe':
				this.ajouter = type;
				this.form = this.formBuilder.group({
					nom: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
					nomParcours: [null, [Validators.required, Validators.maxLength(10)]]
				});

				if(nMoinsUn) this.nMoinsUn = nMoinsUn;

				break;
			case 'groupe':
				this.ajouter = type;
				this.form = this.formBuilder.group({
					nom: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
					lienIcal: [null, Validators.required]
				});

				if(nMoinsUn) this.nMoinsUn = nMoinsUn;

				break;
			case 'modifierLienICal':
				this.ajouter = type;
				this.form = this.formBuilder.group({
					lienIcal: [null, Validators.required]
				});

				if(nMoinsUn) this.nMoinsUn = nMoinsUn;
				break;
			default:
				this.ajouter = '';
				break;
		}
	}

	suppr(type: string, nom: String, supprimer: boolean) {
		if(!supprimer) return;

		switch(type){
			case 'anneeUniv':
				this.requestsService.supprimerAnneeUniv(nom)
					.then(() => {
						this.chargerDetails();
					})
					.catch(error => {
						this.error = error.error.message;
					});
				break;
			case 'classe':
				this.requestsService.supprimerClasse(nom)
					.then(() => {
						this.chargerDetails();
					})
					.catch(error => {
						this.error = error.error.message;
					});
				break;
			case 'groupe':
				this.requestsService.supprimerGroupe(nom)
					.then(() => {
						this.chargerDetails();
					})
					.catch(error => {
						this.error = error.error.message;
					});
				break;
		}
	}

	validerAjout() {
		switch(this.ajouter){
			case 'anneeUniv':
				this.requestsService.ajouterAnneeUniv(this.form.value.nom)
					.then(() => {
						this.chargerDetails();
						this.ajouter = '';
					})
					.catch(error => {
						this.error = error.error.message;
					});
				break;
			case 'classe':
				console.log(this.form.value.nomParcours);
				this.requestsService.ajouterClasse(this.form.value.nom, this.nMoinsUn, this.form.value.nomParcours)
					.then(() => {
						this.chargerDetails();
						this.ajouter = '';
					})
					.catch(error => {
						this.error = error.error.message;
					});
				break;
			case 'groupe':
				this.requestsService.ajouterGroupe(this.form.value.nom, this.form.value.lienIcal, this.nMoinsUn)
					.then(() => {
						this.chargerDetails();
						this.ajouter = '';
					})
					.catch(error => {
						this.error = error.error.message;
					});
				break;
			case 'modifierLienICal':
				this.requestsService.modifierLienICal(this.nMoinsUn, this.form.value.lienIcal)
					.then(() => {
						this.chargerDetails();
						this.ajouter = '';
					})
					.catch(error => {
						this.error = error.error.message;
					});
				break;
		}
	}
}
