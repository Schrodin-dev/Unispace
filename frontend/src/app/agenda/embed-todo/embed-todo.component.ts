import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {travailAFaire} from "../../models/travailAFaire.model";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-embed-todo',
  templateUrl: './embed-todo.component.html',
  styleUrls: ['./embed-todo.component.scss']
})
export class EmbedTodoComponent implements OnInit {
	couleurFond!: String;
	couleurPrincipale!: String;
	couleurTexte!: String;

	travails!: Promise<travailAFaire[]>;

  constructor(private authService: AuthService, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur});
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur});
	  this.authService.textColor.subscribe(couleur => {this.couleurTexte = couleur});

	  this.travails = this.requestsService.getTravailAFaireEmbed();
  }

}
