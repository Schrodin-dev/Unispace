import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RequestsService} from "../../services/requests.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-embed-edt',
  templateUrl: './embed-edt.component.html',
  styleUrls: ['./embed-edt.component.scss']
})
export class EmbedEdtComponent implements OnInit {

	dateSelectionnee!: FormGroup;
	edt: any;
	couleurFond!: String;
	couleurPrincipale!: String;
	couleurTexte!: String;

  constructor(private formBuilder: FormBuilder, private requests: RequestsService, private authService: AuthService) { }

  ngOnInit(): void {
		this.dateSelectionnee = this.formBuilder.group({
			date: [new Date().toISOString().substr(0, 10)]
		});


		this.dateSelectionnee.valueChanges.forEach(newValue => {
			this.edt = this.requests.getCours(newValue.date, newValue.date);
		});

		this.authService.couleurFond.subscribe(couleur => {
			this.couleurFond = couleur;
		});
	  this.authService.couleurPrincipale.subscribe(couleur => {
		  this.couleurPrincipale = couleur;
	  });
	  this.authService.textColor.subscribe(couleur => {
		  this.couleurTexte = couleur;
	  });
  }
}
