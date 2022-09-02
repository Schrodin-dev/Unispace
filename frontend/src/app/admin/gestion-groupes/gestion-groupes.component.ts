import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-gestion-groupes',
  templateUrl: './gestion-groupes.component.html',
  styleUrls: ['./gestion-groupes.component.scss']
})
export class GestionGroupesComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;

	detail!: {anneeUniv: String, classes: {classe: String, groupes: String[]}[]}[];

  constructor(private authService: AuthService, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.chargerCouleurs();

	  this.requestsService.getDetailGroupes()
		  .then(detail => {this.detail = detail;});

  }

  private chargerCouleurs(){
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});


  }

	add(type: string, nMoinsUn?: String) {
		switch(type){
			case 'anneeUniv':
				console.log("+ anneeUniv")
				break;
			case 'classe':
				console.log("+ classe de A" + nMoinsUn)
				break;
			case 'groupe':
				console.log("+ groupe de " + nMoinsUn)
				break;
		}
	}

	suppr(type: string, nom: String, supprimer: boolean) {
		if(!supprimer) return;

		console.log('supprimer ' + type + ' ' + nom);
	}
}
