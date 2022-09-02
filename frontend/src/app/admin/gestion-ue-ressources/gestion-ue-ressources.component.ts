import { Component, OnInit } from '@angular/core';
import {RequestsService} from "../../services/requests.service";
import {AuthService} from "../../services/auth.service";
import {UEAdmin} from "../../models/UEAdmin.model";
import {RessourceAdmin} from "../../models/ressourceAdmin.model";
import {LienRessourceUE} from "../../models/lienRessourceUE.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-gestion-ue-ressources',
  templateUrl: './gestion-ue-ressources.component.html',
  styleUrls: ['./gestion-ue-ressources.component.scss']
})
export class GestionUeRessourcesComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;
	error!: String;

	semestres!: Number[];
	UE!: UEAdmin[];
	ressources!: RessourceAdmin[];
	liens!: LienRessourceUE[];

	ajouterLien: LienRessourceUE[] = [];
	modifierLien: LienRessourceUE[] = [];

	form!: FormGroup;
	ajouterUERessource!: String;

  constructor(private requestsService: RequestsService, private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
	  this.chargerCouleurs();
	  this.genererFormulaire();

  }

  private chargerCouleurs(){
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

  private genererFormulaire(){
		this.requestsService.getListeSemestres()
			.then(value => {
				this.semestres = value;
			})

		this.form = this.formBuilder.group({
			semestre: [null, Validators.required]
		});

		this.form.valueChanges.subscribe(value => {
			if(value.semestre !== undefined && value.semestre !== null){
				this.chargerTableau(value.semestre);
			}
		})
  }

  chargerTableau(semestre: number){
		this.requestsService.afficherRessourcesUE(semestre)
			.then(value => {
				this.ajouterUERessource = '';
				this.UE = value.UE;
				this.ressources = value.ressources;
				this.liens = value.liens;
			})
			.catch(error => {
				this.error = error;
			})
  }

	obtenirLien(ue: UEAdmin, ressource: RessourceAdmin): LienRessourceUE | undefined{
		for(let lien of this.liens){
			if(lien.idRessource
				=== Number(ressource.id) &&
				lien.idUE ===
				Number(ue.id)){
				return lien;
			}
		}

		return undefined;
	}

	modificationLien(event: any, lien: LienRessourceUE) {
		for(let lien2 of this.modifierLien){
			if(lien2.idRessource === lien2.idRessource && lien.idUE === lien2.idUE){
				this.modifierLien.splice(this.modifierLien.indexOf(lien2), 1);
			}
		}

		let coeff: number;
		if(event.target.value === undefined || String(event.target.value).length === 0){
			coeff = 0;
		}else{
			coeff = event.target.value;
		}

		this.modifierLien.push(new LienRessourceUE(lien.idRessource, lien.idUE, coeff));
	}

	ajoutLien(event: any, ressource: RessourceAdmin, ue: UEAdmin) {
		for(let lien of this.ajouterLien){
			if(lien.idRessource === Number(ressource.id) && lien.idUE === Number(ue.id)){
				this.ajouterLien.splice(this.ajouterLien.indexOf(lien), 1);
			}
		}

		if(event.target.value === undefined || String(event.target.value).length === 0) return;
		const coeff = event.target.value;
		this.ajouterLien.push(new LienRessourceUE(Number(ressource.id), Number(ue.id), coeff));
	}

	supprimerRessource(ressource: RessourceAdmin, event: boolean) {
		if(!event) return;

		this.requestsService.supprimerRessource(Number(ressource.id))
			.then(() => {
				this.chargerTableau(this.form.value.semestre);
			})
			.catch(error => {
				console.error(error);
				this.error = error;
			});
	}

	supprimerUE(ue: UEAdmin, event: boolean) {
		if(!event) return;

		this.requestsService.supprimerUE(Number(ue.id))
			.then(() => {
				this.chargerTableau(this.form.value.semestre);
			})
			.catch(error => {
				this.error = error;
			});
	}

	ajouterRessourceUE(type: String) {
		this.ajouterUERessource = type;
	}

	submit() {
		let requests: Promise<String>[] = [];

		for(let lien of this.ajouterLien){
			requests.push(this.requestsService.lierRessourceUE(lien.idUE, lien.idRessource, lien.coeff));
		}

		for(let lien of this.modifierLien){
			if(lien.coeff === 0){
				requests.push(this.requestsService.supprimerLienRessourceUE(lien.idUE, lien.idRessource));
			}else{
				requests.push(this.requestsService.modifierLienRessourceUE(lien.idUE, lien.idRessource, lien.coeff));
			}
		}

		Promise.all(requests)
			.then(() => {
				this.modifierLien = [];
				this.ajouterLien = [];

				this.chargerTableau(this.form.value.semestre);
			})
			.catch(error => {
				this.error = error.error.message;
			});
	}
}
