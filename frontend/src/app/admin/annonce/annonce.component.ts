import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-annonce',
  templateUrl: './annonce.component.html',
  styleUrls: ['./annonce.component.scss']
})
export class AnnonceComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;

	form!: FormGroup;
	destinataires!: String[];

	error!: String;
	message!: String;

  constructor(private authService: AuthService, private requestsService: RequestsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
	  this.loadCouleurs();
	  this.genererForm();
	  this.chargerDestinataires();
  }

  loadCouleurs(){
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

  chargerDestinataires(){
	  this.requestsService.chargerDestinatairesAnnonces()
		  .then(destinataires => {
			  this.destinataires = destinataires;
		  })
		  .catch(error => {
			  this.message = '';
			  this.error = error.error.message;
		  })
  }

  genererForm(){
	  this.form = this.formBuilder.group({
		  destinataires: [null, Validators.required], //regarder comment les charger et comment c'est géré côté backend
		  objet: [null, Validators.required],
		  message: [null, Validators.required]
	  });
  }

	envoyerAnnonce() {
		this.requestsService.envoyerAnnonce(this.form.value.destinataires, this.form.value.objet, this.form.value.message)
			.then(message => {
				this.error = '';
				this.message = message;
			})
			.catch(error => {
				this.message = '';
				this.error = error.error.message;
			})
	}
}
