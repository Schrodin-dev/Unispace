import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-gestion-parcours',
  templateUrl: './gestion-parcours.component.html',
  styleUrls: ['./gestion-parcours.component.scss']
})
export class GestionParcoursComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;

	listeParcours!: String[];
	ajouter!: boolean;
	form!: FormGroup;

	error!: String;

  constructor(private authService: AuthService, private requestsService: RequestsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
		this.loadCouleurs();
		this.chargerParcours();
		this.creerFormualaire();

  }

  loadCouleurs(){
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

  chargerParcours(){
	  this.requestsService.getListeParcours()
		  .then(parcours => {
			  this.listeParcours = parcours;
		  })
		  .catch(error => {
			  this.error = error.error.message;
		  });
  }

  creerFormualaire(){
	  this.form = this.formBuilder.group({
		  nomParcours: [null, [Validators.required, Validators.maxLength(10)]]
	  });
  }

  supprimerParcours(accepteSupprimer: boolean, parcours: String){
	  if(!accepteSupprimer) return;

	  this.requestsService.supprimerParcours(parcours)
		  .then(() => {
			  this.chargerParcours();
			  this.ajouter = false;
		  })
		  .catch(error => {
			  this.error = error.error.message;
		  });
  }

  ajouterParcours(){
	  this.ajouter = true;
  }

  validerAjoutParcours(){
	  this.requestsService.ajouterParcours(this.form.value.nomParcours)
		  .then(() => {
			  this.chargerParcours();
			  this.ajouter = false;
		  })
		  .catch(error => {
			  this.error = error.error.message;
		  });
  }



}
